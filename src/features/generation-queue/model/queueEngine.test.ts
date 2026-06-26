import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GenerationTask } from "@/entities/generation-task";
import type { QueueAction } from "./queueActions";
import { createQueueEngine } from "./queueEngine";
import { queueReducer } from "./queueReducer";
import { initialQueueState } from "./queueState";
import {
  makeTask,
  minutesFromBase,
  sequenceRandom,
  stableRandom,
} from "./testHelpers";

function createHarness(options?: {
  initialTasks?: GenerationTask[];
  random?: () => number;
  maxConcurrent?: number;
}) {
  let state = {
    ...initialQueueState,
    tasks: options?.initialTasks ?? [],
  };
  const dispatches: QueueAction[] = [];

  const dispatch = (action: QueueAction) => {
    dispatches.push(action);
    state = queueReducer(state, action);
  };

  const engine = createQueueEngine({
    dispatch,
    getTasks: () => state.tasks,
    random: options?.random ?? stableRandom,
    maxConcurrent: options?.maxConcurrent,
  });

  return {
    engine,
    dispatch,
    dispatches,
    getState: () => state,
    getTask: (id: string) => {
      const task = state.tasks.find((item) => item.id === id);
      if (!task) throw new Error(`Task ${id} not found`);
      return task;
    },
  };
}

async function advanceEngine(ms = 1_000) {
  await vi.advanceTimersByTimeAsync(ms);
}

describe("queueEngine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at most two queued tasks (slot limit)", async () => {
    const tasks = ["a", "b", "c"].map((id, index) =>
      makeTask({ id, createdAt: minutesFromBase(index) }),
    );
    const { engine, dispatches, getTask } = createHarness({
      initialTasks: tasks,
    });

    engine.start();
    await advanceEngine();

    const started = dispatches.filter(
      (action) => action.type === "TICK_PROGRESS",
    );
    const startedIds = new Set(started.map((action) => action.taskId));

    expect(startedIds.size).toBeLessThanOrEqual(2);
    expect(startedIds.has("a")).toBe(true);
    expect(startedIds.has("b")).toBe(true);
    expect(startedIds.has("c")).toBe(false);
    expect(getTask("a").status).toBe("running");
    expect(getTask("b").status).toBe("running");
    expect(getTask("c").status).toBe("queued");

    engine.stop();
  });

  it("promotes queued tasks in FIFO order when a slot frees", async () => {
    const tasks = ["first", "second", "third"].map((id, index) =>
      makeTask({ id, createdAt: minutesFromBase(index) }),
    );
    const { engine, dispatch, dispatches, getTask } = createHarness({
      initialTasks: tasks,
    });

    engine.start();
    await advanceEngine();

    expect(getTask("first").status).toBe("running");
    expect(getTask("second").status).toBe("running");
    expect(getTask("third").status).toBe("queued");

    dispatch({ type: "COMPLETE", taskId: "first" });
    engine.sync();
    await advanceEngine();

    expect(
      dispatches.some(
        (action) =>
          action.type === "TICK_PROGRESS" && action.taskId === "third",
      ),
    ).toBe(true);
    expect(getTask("third").status).toBe("running");

    engine.stop();
  });

  it("does not progress a task after abortTask + cancel", async () => {
    const { engine, dispatch, dispatches, getTask } = createHarness({
      initialTasks: [makeTask({ id: "run", status: "running", progress: 20 })],
    });

    engine.start();
    await advanceEngine();

    const ticksBeforeCancel = dispatches.filter(
      (action) => action.type === "TICK_PROGRESS" && action.taskId === "run",
    ).length;

    engine.abortTask("run");
    dispatch({ type: "CANCEL", taskId: "run" });
    engine.sync();

    await advanceEngine(5_000);

    const ticksAfterCancel = dispatches.filter(
      (action) => action.type === "TICK_PROGRESS" && action.taskId === "run",
    ).length;

    expect(getTask("run").status).toBe("canceled");
    expect(ticksAfterCancel).toBe(ticksBeforeCancel);
    expect(
      dispatches.some(
        (action) => action.type === "COMPLETE" && action.taskId === "run",
      ),
    ).toBe(false);

    engine.stop();
  });

  it("dispatches COMPLETE when progress reaches 100", async () => {
    const random = sequenceRandom([
      0, // tick delay (min)
      0.99, // shouldFail — no
      0, // progress step for text -> +8, 92 + 8 = 100
    ]);

    const { engine, dispatches, getTask } = createHarness({
      initialTasks: [
        makeTask({ id: "run", status: "running", progress: 92, type: "text" }),
      ],
      random,
    });

    engine.start();
    await advanceEngine();

    expect(
      dispatches.some(
        (action) => action.type === "COMPLETE" && action.taskId === "run",
      ),
    ).toBe(true);
    expect(getTask("run")).toMatchObject({ status: "done", progress: 100 });

    engine.stop();
  });

  it("dispatches FAIL when random triggers failure", async () => {
    const random = sequenceRandom([
      0, // fail (< FAIL_RATE)
      0, // message index
      0, // delay (unused)
    ]);

    const { engine, dispatches, getTask } = createHarness({
      initialTasks: [makeTask({ id: "run", status: "running", progress: 10 })],
      random,
    });

    engine.start();
    await advanceEngine();

    expect(
      dispatches.some(
        (action) => action.type === "FAIL" && action.taskId === "run",
      ),
    ).toBe(true);
    expect(getTask("run").status).toBe("failed");
    expect(getTask("run").error).toBeTruthy();

    engine.stop();
  });

  it("clears timers on stop", async () => {
    const { engine, dispatches } = createHarness({
      initialTasks: [makeTask({ id: "run", status: "running", progress: 10 })],
    });

    engine.start();
    await advanceEngine(100);
    const ticksBeforeStop = dispatches.filter(
      (action) => action.type === "TICK_PROGRESS",
    ).length;

    engine.stop();
    await advanceEngine(5_000);

    const ticksAfterStop = dispatches.filter(
      (action) => action.type === "TICK_PROGRESS",
    ).length;
    expect(ticksAfterStop).toBe(ticksBeforeStop);
  });
});

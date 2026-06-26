import { describe, expect, it } from "vitest";
import type { QueueState } from "./queueState";
import { initialQueueState } from "./queueState";
import { queueReducer } from "./queueReducer";
import { makeTask, minutesFromBase } from "./testHelpers";

function reduce(state: QueueState, ...actions: Parameters<typeof queueReducer>[1][]) {
  return actions.reduce((next, action) => queueReducer(next, action), state);
}

function taskById(state: QueueState, id: string) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) throw new Error(`Task ${id} not found`);
  return task;
}

describe("queueReducer", () => {
  describe("status transitions", () => {
    it("promotes queued task to running on TICK_PROGRESS", () => {
      const state = reduce(initialQueueState, {
        type: "HYDRATE",
        payload: { tasks: [{ ...makeTask({ id: "t1" }), createdAt: minutesFromBase(0).toISOString() }] },
      });

      const next = queueReducer(state, {
        type: "TICK_PROGRESS",
        taskId: "t1",
        progress: 12,
      });

      expect(taskById(next, "t1")).toMatchObject({
        status: "running",
        progress: 12,
      });
      expect(taskById(next, "t1").queuePosition).toBeUndefined();
    });

    it("updates progress for running tasks", () => {
      const state = reduce(initialQueueState, {
        type: "HYDRATE",
        payload: {
          tasks: [
            {
              ...makeTask({ id: "t1", status: "running", progress: 20 }),
              createdAt: minutesFromBase(0).toISOString(),
            },
          ],
        },
      });

      const next = queueReducer(state, {
        type: "TICK_PROGRESS",
        taskId: "t1",
        progress: 35,
      });

      expect(taskById(next, "t1")).toMatchObject({
        status: "running",
        progress: 35,
      });
    });

    it("ignores TICK_PROGRESS for terminal statuses", () => {
      const hydrated = [
        makeTask({ id: "done", status: "done", progress: 100 }),
        makeTask({ id: "failed", status: "failed", progress: 40, error: "boom" }),
      ].map((task) => ({ ...task, createdAt: task.createdAt.toISOString() }));

      const state = queueReducer(initialQueueState, {
        type: "HYDRATE",
        payload: { tasks: hydrated },
      });

      const next = reduce(
        state,
        { type: "TICK_PROGRESS", taskId: "done", progress: 50 },
        { type: "TICK_PROGRESS", taskId: "failed", progress: 50 },
      );

      expect(taskById(next, "done").progress).toBe(100);
      expect(taskById(next, "failed").progress).toBe(40);
    });

    it("completes only running tasks and stores done duration", () => {
      const startedAt = new Date(Date.now() - 12_000);
      const hydrated = [
        makeTask({
          id: "running",
          status: "running",
          progress: 90,
          startedAt,
        }),
        makeTask({ id: "queued", status: "queued", progress: 0, queuePosition: 1 }),
      ].map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        startedAt: task.startedAt?.toISOString(),
      }));

      const state = queueReducer(initialQueueState, {
        type: "HYDRATE",
        payload: { tasks: hydrated },
      });

      const next = reduce(
        state,
        { type: "COMPLETE", taskId: "running" },
        { type: "COMPLETE", taskId: "queued" },
      );

      expect(taskById(next, "running")).toMatchObject({
        status: "done",
        progress: 100,
        eta: 12,
        startedAt: undefined,
      });
      expect(taskById(next, "queued").status).toBe("queued");
    });

    it("fails only running tasks", () => {
      const hydrated = [
        makeTask({ id: "running", status: "running", progress: 40 }),
        makeTask({ id: "queued", status: "queued", progress: 0, queuePosition: 1 }),
      ].map((task) => ({ ...task, createdAt: task.createdAt.toISOString() }));

      const state = queueReducer(initialQueueState, {
        type: "HYDRATE",
        payload: { tasks: hydrated },
      });

      const next = reduce(
        state,
        { type: "FAIL", taskId: "running", error: "Timeout" },
        { type: "FAIL", taskId: "queued", error: "Timeout" },
      );

      expect(taskById(next, "running")).toMatchObject({
        status: "failed",
        error: "Timeout",
      });
      expect(taskById(next, "queued").status).toBe("queued");
    });

    it("cancels queued and running tasks", () => {
      const hydrated = [
        makeTask({ id: "queued", status: "queued", progress: 0, queuePosition: 1 }),
        makeTask({ id: "running", status: "running", progress: 55 }),
        makeTask({ id: "done", status: "done", progress: 100 }),
      ].map((task) => ({ ...task, createdAt: task.createdAt.toISOString() }));

      const state = queueReducer(initialQueueState, {
        type: "HYDRATE",
        payload: { tasks: hydrated },
      });

      const next = reduce(
        state,
        { type: "CANCEL", taskId: "queued" },
        { type: "CANCEL", taskId: "running" },
        { type: "CANCEL", taskId: "done" },
      );

      expect(taskById(next, "queued").status).toBe("canceled");
      expect(taskById(next, "running").status).toBe("canceled");
      expect(taskById(next, "done").status).toBe("done");
    });

    it("retries failed and canceled tasks back to queued", () => {
      const hydrated = [
        makeTask({ id: "failed", status: "failed", progress: 33, error: "Credits" }),
        makeTask({ id: "canceled", status: "canceled", progress: 12 }),
        makeTask({ id: "done", status: "done", progress: 100 }),
      ].map((task) => ({ ...task, createdAt: task.createdAt.toISOString() }));

      const state = queueReducer(initialQueueState, {
        type: "HYDRATE",
        payload: { tasks: hydrated },
      });

      const next = reduce(
        state,
        { type: "RETRY", taskId: "failed" },
        { type: "RETRY", taskId: "canceled" },
        { type: "RETRY", taskId: "done" },
      );

      expect(taskById(next, "failed")).toMatchObject({
        status: "queued",
        progress: 0,
        error: undefined,
        queuePosition: 1,
      });
      expect(taskById(next, "canceled")).toMatchObject({
        status: "queued",
        progress: 0,
        queuePosition: 2,
      });
      expect(taskById(next, "done").status).toBe("done");
    });
  });

  describe("queue positions", () => {
    it("assigns FIFO queue positions to queued tasks", () => {
      const state = reduce(
        initialQueueState,
        {
          type: "ADD_TASK",
          task: makeTask({ id: "older", createdAt: minutesFromBase(0) }),
        },
        {
          type: "ADD_TASK",
          task: makeTask({ id: "newer", createdAt: minutesFromBase(5) }),
        },
      );

      expect(taskById(state, "older").queuePosition).toBe(1);
      expect(taskById(state, "newer").queuePosition).toBe(2);
    });

    it("recomputes queue positions after cancel", () => {
      const hydrated = [
        makeTask({ id: "first", createdAt: minutesFromBase(0), queuePosition: 1 }),
        makeTask({ id: "second", createdAt: minutesFromBase(1), queuePosition: 2 }),
        makeTask({ id: "third", createdAt: minutesFromBase(2), queuePosition: 3 }),
      ].map((task) => ({ ...task, createdAt: task.createdAt.toISOString() }));

      const state = queueReducer(initialQueueState, {
        type: "HYDRATE",
        payload: { tasks: hydrated },
      });

      const next = queueReducer(state, { type: "CANCEL", taskId: "second" });

      expect(taskById(next, "first").queuePosition).toBe(1);
      expect(taskById(next, "third").queuePosition).toBe(2);
      expect(next.tasks.find((task) => task.id === "second")?.status).toBe("canceled");
    });
  });
});

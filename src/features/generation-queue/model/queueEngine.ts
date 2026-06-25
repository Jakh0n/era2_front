import type { GenType, GenerationTask } from "@/entities/generation-task";
import type { QueueAction } from "./queueActions";

export const MAX_CONCURRENT = 2;

export const TICK_DELAY_MIN_MS = 400;
export const TICK_DELAY_MAX_MS = 700;

export const FAIL_RATE = 0.15;

export const FAIL_MESSAGES = [
  "Недостаточно кредитов",
  "Превышено время ожидания",
  "Модель временно недоступна",
] as const;

export type RandomSource = () => number;

export interface QueueEngineOptions {
  dispatch: (action: QueueAction) => void;
  getTasks: () => GenerationTask[];
  random?: RandomSource;
  maxConcurrent?: number;
}

export function randomTickDelay(random: RandomSource = Math.random): number {
  const span = TICK_DELAY_MAX_MS - TICK_DELAY_MIN_MS + 1;
  return TICK_DELAY_MIN_MS + Math.floor(random() * span);
}

export function countRunningTasks(tasks: GenerationTask[]): number {
  return tasks.filter((task) => task.status === "running").length;
}

export function getQueuedFifo(tasks: GenerationTask[]): GenerationTask[] {
  return tasks
    .filter((task) => task.status === "queued")
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export function getAvailableSlots(
  tasks: GenerationTask[],
  maxConcurrent: number = MAX_CONCURRENT,
): number {
  return Math.max(0, maxConcurrent - countRunningTasks(tasks));
}

export function pickTasksToStart(
  tasks: GenerationTask[],
  maxConcurrent: number = MAX_CONCURRENT,
): string[] {
  const slots = getAvailableSlots(tasks, maxConcurrent);
  return getQueuedFifo(tasks)
    .slice(0, slots)
    .map((task) => task.id);
}

export function getProgressStep(
  type: GenType,
  random: RandomSource = Math.random,
): number {
  const roll = random();

  if (type === "video" || type === "audio") {
    return 2 + Math.floor(roll * 5);
  }

  return 8 + Math.floor(roll * 8);
}

export function shouldFail(
  random: RandomSource = Math.random,
  rate: number = FAIL_RATE,
): boolean {
  return random() < rate;
}

export function pickFailMessage(random: RandomSource = Math.random): string {
  const index = Math.floor(random() * FAIL_MESSAGES.length);
  return FAIL_MESSAGES[index] ?? FAIL_MESSAGES[0];
}

export function computeNextProgress(
  task: GenerationTask,
  random: RandomSource = Math.random,
): number {
  return Math.min(100, task.progress + getProgressStep(task.type, random));
}

type TimerId = ReturnType<typeof setTimeout>;

export class QueueEngine {
  private readonly dispatch: (action: QueueAction) => void;
  private readonly getTasks: () => GenerationTask[];
  private readonly random: RandomSource;
  private readonly maxConcurrent: number;

  private readonly timers = new Map<string, TimerId>();
  private readonly aborted = new Set<string>();
  private active = false;

  constructor(options: QueueEngineOptions) {
    this.dispatch = options.dispatch;
    this.getTasks = options.getTasks;
    this.random = options.random ?? Math.random;
    this.maxConcurrent = options.maxConcurrent ?? MAX_CONCURRENT;
  }

  start(): void {
    this.active = true;
    this.sync();
  }

  stop(): void {
    this.active = false;
    this.clearAllTimers();
    this.aborted.clear();
  }

  /** Stop pending ticks for a task immediately (call before CANCEL dispatch). */
  abortTask(taskId: string): void {
    this.aborted.add(taskId);
    this.clearTimer(taskId);
  }

  /** Resume promotion, ticking, and slot filling after reducer updates. */
  sync(): void {
    if (!this.active) return;

    const tasks = this.getTasks();

    for (const task of tasks) {
      if (task.status === "queued") {
        this.aborted.delete(task.id);
      }
    }

    for (const taskId of [...this.timers.keys()]) {
      const task = tasks.find((item) => item.id === taskId);
      if (!task || task.status !== "running") {
        this.clearTimer(taskId);
      }
    }

    for (const task of tasks) {
      if (task.status !== "running") continue;
      if (this.aborted.has(task.id) || this.timers.has(task.id)) continue;
      this.scheduleTick(task.id);
    }

    for (const taskId of pickTasksToStart(tasks, this.maxConcurrent)) {
      if (this.aborted.has(taskId) || this.timers.has(taskId)) continue;
      this.scheduleTick(taskId);
    }
  }

  private scheduleTick(taskId: string): void {
    this.clearTimer(taskId);

    const timer = setTimeout(() => {
      this.timers.delete(taskId);
      this.runTick(taskId);
    }, randomTickDelay(this.random));

    this.timers.set(taskId, timer);
  }

  private runTick(taskId: string): void {
    if (!this.active || this.aborted.has(taskId)) return;

    const task = this.getTasks().find((item) => item.id === taskId);
    if (!task || (task.status !== "running" && task.status !== "queued")) {
      return;
    }

    if (shouldFail(this.random)) {
      this.dispatch({
        type: "FAIL",
        taskId,
        error: pickFailMessage(this.random),
      });
      return;
    }

    const nextProgress = computeNextProgress(task, this.random);

    if (nextProgress >= 100) {
      this.dispatch({ type: "COMPLETE", taskId });
      return;
    }

    this.dispatch({ type: "TICK_PROGRESS", taskId, progress: nextProgress });

    if (this.active && !this.aborted.has(taskId)) {
      this.scheduleTick(taskId);
    }
  }

  private clearTimer(taskId: string): void {
    const timer = this.timers.get(taskId);
    if (timer === undefined) return;

    clearTimeout(timer);
    this.timers.delete(taskId);
  }

  private clearAllTimers(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }
}

export function createQueueEngine(options: QueueEngineOptions): QueueEngine {
  return new QueueEngine(options);
}

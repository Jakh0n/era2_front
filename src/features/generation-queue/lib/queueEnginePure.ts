import type { GenType, GenerationTask } from "@/entities/generation-task";
import { clampProgress } from "./clampProgress";
import {
  FAIL_MESSAGES,
  FAIL_RATE,
  MAX_CONCURRENT,
  TICK_MS,
} from "./queueConstants";

export type RandomSource = () => number;

export function randomTickDelay(random: RandomSource = Math.random): number {
  const span = TICK_MS.max - TICK_MS.min + 1;
  return TICK_MS.min + Math.floor(random() * span);
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
  return clampProgress(task.progress + getProgressStep(task.type, random));
}

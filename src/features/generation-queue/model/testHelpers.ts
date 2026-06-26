import type { GenerationTask } from "@/entities/generation-task";
import type { RandomSource } from "../lib/queueEnginePure";

const BASE_TIME = Date.UTC(2026, 0, 1, 12, 0, 0);

export function minutesFromBase(minutes: number): Date {
  return new Date(BASE_TIME + minutes * 60_000);
}

export function makeTask(
  overrides: Partial<GenerationTask> & Pick<GenerationTask, "id">,
): GenerationTask {
  return {
    type: "text",
    prompt: `Prompt for ${overrides.id}`,
    model: "GPT 5.2",
    status: "queued",
    progress: 0,
    createdAt: minutesFromBase(0),
    ...overrides,
  };
}

/** Deterministic random: never triggers fail (>= FAIL_RATE) and uses minimal tick delay. */
export function stableRandom(): number {
  return 0.99;
}

export function sequenceRandom(values: number[]): RandomSource {
  let index = 0;
  return () => values[index++ % values.length] ?? 0.99;
}

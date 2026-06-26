/** Clamp progress to 0–100. */
export function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, value));
}

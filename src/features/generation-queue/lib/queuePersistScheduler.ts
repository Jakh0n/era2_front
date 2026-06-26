import { PERSIST_DEBOUNCE_MS } from "./queueConstants";
import { writePersistedState } from "./queuePersistence";
import type { QueueState } from "./queueTypes";

type PersistPayload = Pick<QueueState, "tasks" | "filter" | "sort" | "search">;

let timer: ReturnType<typeof setTimeout> | null = null;
let pending: PersistPayload | null = null;

export function schedulePersistedState(state: PersistPayload): void {
  pending = state;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    if (pending) writePersistedState(pending);
    pending = null;
  }, PERSIST_DEBOUNCE_MS);
}

export function flushPersistedState(state: PersistPayload): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  pending = null;
  writePersistedState(state);
}

export function cancelPersistSchedule(): void {
  if (timer) clearTimeout(timer);
  timer = null;
  pending = null;
}

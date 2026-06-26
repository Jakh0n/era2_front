import type { QueueHydratePayload } from "../model/queueActions";
import { buildHydratePayload, readPersistedState } from "./queuePersistence";

export const QUEUE_LOAD_ERROR_MESSAGE =
  "Не удалось загрузить очередь генераций";

/** Demo flag: open any page with `?failQueueLoad=1` to show ErrorState (§4.5). */
export function shouldSimulateQueueLoadFailure(): boolean {
  if (typeof window === "undefined") return false;
  return (
    new URLSearchParams(window.location.search).get("failQueueLoad") === "1"
  );
}

export function initializeQueueState(): QueueHydratePayload {
  if (shouldSimulateQueueLoadFailure()) {
    throw new Error(QUEUE_LOAD_ERROR_MESSAGE);
  }

  const persisted = readPersistedState();
  return buildHydratePayload(persisted);
}

import type { ReactNode } from "react";
import { useQueueRuntime } from "./useQueueRuntime";

export function QueueProvider({ children }: { children: ReactNode }) {
  useQueueRuntime();
  return <>{children}</>;
}

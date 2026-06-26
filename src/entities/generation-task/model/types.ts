export type GenType = "text" | "image" | "video" | "audio";

export type TaskStatus = "queued" | "running" | "done" | "failed" | "canceled";

export interface GenerationTask {
  id: string;
  type: GenType;
  prompt: string;
  model: string;
  status: TaskStatus;
  /** 0–100 */
  progress: number;
  createdAt: Date;
  error?: string;
  /** ETA in seconds (queued/running) or completed duration in seconds (done). */
  eta?: number;
  credits?: number;
  /** 1-based position in queue (queued only). */
  queuePosition?: number;
  /** Set when task enters running — used to compute done duration. */
  startedAt?: Date;
}

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
  /** Estimated seconds until completion (queued / running). */
  eta?: number;
  credits?: number;
  /** 1-based position in queue (queued only). */
  queuePosition?: number;
}

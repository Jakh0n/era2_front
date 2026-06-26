export const MAX_CONCURRENT = 2;

/** Progress tick interval range (ms) — each tick schedules the next with a random delay in this range. */
export const TICK_MS = { min: 400, max: 700 } as const;

export const FAIL_RATE = 0.15;

export const FAIL_MESSAGES = [
  "Недостаточно кредитов",
  "Превышено время ожидания",
  "Модель временно недоступна",
] as const;

export const INIT_DELAY_MS = 600;
export const SEARCH_DEBOUNCE_MS = 300;
export const STATUS_BAR_PREVIEW_LIMIT = 3;

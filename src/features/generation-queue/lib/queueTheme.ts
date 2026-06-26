/**
 * ERA2 queue UI — token class names from TZ palette.
 * Values live in app/styles/styles.css (--c-* vars, @theme era-*).
 *
 * TZ mapping:
 *   era/bg-1       → bg-era-bg-1
 *   era/line       → border-era-line
 *   form/border    → border-era-form-border
 *   era/fg         → text-era-fg
 *   era/fg-mute    → text-era-fg-mute
 *   era/accent     → text-era-accent / bg-era-accent
 *   destructive    → text-era-destructive
 */
export const queueTheme = {
  /** Queue page / loading / error shell */
  pageShell: "mx-auto w-full max-w-6xl space-y-6 px-4 pt-6 pb-4 md:px-6",
  cardShell:
    "rounded-[16px] border border-era-line bg-era-bg-1 transition-colors hover:border-era-form-border",
  cardShellActive:
    "border-era-accent hover:border-era-accent",
  statusBarShell:
    "rounded-[16px] border border-era-line bg-era-bg-1 transition-colors hover:border-era-form-border shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
  previewShell:
    "overflow-hidden border border-era-accent/20 era-queue-preview-bg",
  /** Task preview / type icon — Figma radius 16px */
  previewRadius: "!rounded-[16px]",
  /** Status bar mini preview (32px) */
  previewRadiusSm: "!rounded-[10px]",
  iconButton:
    "size-8 shrink-0 cursor-pointer rounded-[8px] border border-era-line bg-era-bg-1 text-era-fg-dim hover:text-era-fg hover:border-era-form-border hover:bg-era-bg-2",
  accentIconButton:
    "size-8 shrink-0 cursor-pointer rounded-[8px] border border-era-line bg-era-bg-1 text-era-accent-2 hover:text-era-accent-hi hover:border-era-form-border hover:bg-era-bg-2",
  inputShell:
    "rounded-full border-era-form-border bg-era-bg-1 text-era-fg placeholder:text-era-fg-mute",
  dropdownShell: "border-era-form-border bg-era-bg-1 text-era-fg",
  skeleton: "bg-era-line",
  filterChipActive:
    "cursor-pointer border-era-accent bg-era-accent text-white hover:bg-era-accent hover:text-white",
  filterChipIdle:
    "cursor-pointer border-era-line bg-era-bg-2 text-era-fg-mute hover:border-era-form-border hover:text-era-fg",
  sortTrigger:
    "h-7 w-auto shrink-0 cursor-pointer gap-1.5 rounded-full border border-era-line bg-era-bg-2 px-3.5 text-[13px] font-medium text-era-fg-mute shadow-none focus:ring-0 focus:ring-offset-0 [&>svg]:size-3.5 [&>svg]:opacity-60",
} as const;

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
  cardShell:
    "rounded-2xl border border-era-line bg-era-bg-1 transition-colors hover:border-era-form-border",
  statusBarShell:
    "rounded-2xl border border-era-line bg-era-bg-1 transition-colors hover:border-era-form-border shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
  typeIconShell:
    "border border-era-accent/20 bg-era-accent/10 text-era-accent",
  iconButton:
    "size-8 shrink-0 rounded-[8px] border border-era-line bg-era-bg-1 text-era-fg-dim hover:text-era-fg hover:border-era-form-border hover:bg-era-bg-2",
  accentIconButton:
    "size-8 shrink-0 rounded-[8px] border border-era-line bg-era-bg-1 text-era-accent-2 hover:text-era-accent-hi hover:border-era-form-border hover:bg-era-bg-2",
  inputShell:
    "rounded-full border-era-form-border bg-era-bg-1 text-era-fg placeholder:text-era-fg-mute",
  dropdownShell: "border-era-form-border bg-era-bg-1 text-era-fg",
  skeleton: "bg-era-line",
} as const;

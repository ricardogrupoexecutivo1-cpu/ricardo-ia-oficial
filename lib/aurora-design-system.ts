export const auroraTheme = {
  colors: {
    background: "#f7fafc",
    backgroundSoft: "#ffffff",
    backgroundMuted: "#eef4f7",
    surface: "rgba(255,255,255,0.88)",
    surfaceStrong: "rgba(255,255,255,0.96)",
    surfaceBorder: "rgba(15,23,42,0.08)",

    text: "#0f172a",
    textSoft: "#334155",
    textMuted: "#64748b",
    textInverse: "#ffffff",

    primary: "#16a34a",
    primaryHover: "#15803d",
    primarySoft: "rgba(22,163,74,0.12)",
    primaryBorder: "rgba(22,163,74,0.24)",

    secondary: "#0ea5e9",
    secondarySoft: "rgba(14,165,233,0.12)",
    secondaryBorder: "rgba(14,165,233,0.24)",

    success: "#16a34a",
    successSoft: "rgba(22,163,74,0.12)",

    warning: "#d97706",
    warningSoft: "rgba(217,119,6,0.12)",

    danger: "#dc2626",
    dangerSoft: "rgba(220,38,38,0.12)",

    info: "#2563eb",
    infoSoft: "rgba(37,99,235,0.12)",

    shadow: "rgba(15,23,42,0.10)",
    shadowStrong: "rgba(15,23,42,0.16)",

    overlay: "rgba(15,23,42,0.35)",
    glass: "rgba(255,255,255,0.68)",
  },

  radius: {
    xs: "10px",
    sm: "14px",
    md: "18px",
    lg: "24px",
    xl: "30px",
    pill: "999px",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    "4xl": "40px",
    "5xl": "48px",
  },

  shadow: {
    soft: "0 10px 30px rgba(15,23,42,0.08)",
    medium: "0 14px 40px rgba(15,23,42,0.10)",
    strong: "0 20px 60px rgba(15,23,42,0.16)",
    glow: "0 0 0 1px rgba(22,163,74,0.10), 0 18px 50px rgba(22,163,74,0.16)",
  },

  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    hero: "clamp(2rem, 4vw, 4.5rem)",
    title: "clamp(1.5rem, 2.8vw, 2.5rem)",
    subtitle: "clamp(1.125rem, 2vw, 1.5rem)",
    body: "1rem",
    small: "0.92rem",
    tiny: "0.82rem",
  },

  layout: {
    container: "1240px",
    reading: "780px",
    sectionY: "clamp(56px, 8vw, 104px)",
    sectionGap: "clamp(20px, 3vw, 32px)",
  },

  motion: {
    fast: "160ms ease",
    normal: "220ms ease",
    slow: "320ms ease",
  },
} as const;

export const auroraClassNames = {
  page:
    "min-h-screen bg-[var(--aurora-bg)] text-[var(--aurora-text)] antialiased",

  container:
    "mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8",

  section:
    "py-12 sm:py-16 lg:py-24",

  surface:
    "rounded-[24px] border border-[var(--aurora-border)] bg-[var(--aurora-surface)] shadow-[var(--aurora-shadow-soft)] backdrop-blur-md",

  surfaceStrong:
    "rounded-[28px] border border-[var(--aurora-border)] bg-[var(--aurora-surface-strong)] shadow-[var(--aurora-shadow-medium)] backdrop-blur-md",

  card:
    "rounded-[24px] border border-[var(--aurora-border)] bg-[var(--aurora-surface-strong)] shadow-[var(--aurora-shadow-soft)] transition-all duration-200",

  cardInteractive:
    "rounded-[24px] border border-[var(--aurora-border)] bg-[var(--aurora-surface-strong)] shadow-[var(--aurora-shadow-soft)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[var(--aurora-shadow-medium)]",

  badge:
    "inline-flex items-center rounded-full border border-[var(--aurora-primary-border)] bg-[var(--aurora-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--aurora-primary)]",

  title:
    "text-3xl font-black tracking-[-0.03em] sm:text-4xl lg:text-5xl",

  sectionTitle:
    "text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl",

  subtitle:
    "text-base leading-7 text-[var(--aurora-text-soft)] sm:text-lg",

  label:
    "text-sm font-semibold text-[var(--aurora-text-soft)]",

  input:
    "h-12 w-full rounded-[16px] border border-[var(--aurora-border)] bg-white px-4 text-[15px] text-[var(--aurora-text)] outline-none transition-all duration-200 placeholder:text-[var(--aurora-text-muted)] focus:border-[var(--aurora-primary)] focus:ring-4 focus:ring-[var(--aurora-primary-soft)]",

  textarea:
    "w-full rounded-[16px] border border-[var(--aurora-border)] bg-white px-4 py-3 text-[15px] text-[var(--aurora-text)] outline-none transition-all duration-200 placeholder:text-[var(--aurora-text-muted)] focus:border-[var(--aurora-primary)] focus:ring-4 focus:ring-[var(--aurora-primary-soft)]",

  buttonPrimary:
    "inline-flex h-12 items-center justify-center rounded-[16px] border border-[var(--aurora-primary)] bg-[var(--aurora-primary)] px-5 text-sm font-bold text-white shadow-[var(--aurora-shadow-soft)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[var(--aurora-primary-hover)] hover:shadow-[var(--aurora-shadow-medium)] active:translate-y-0",

  buttonSecondary:
    "inline-flex h-12 items-center justify-center rounded-[16px] border border-[var(--aurora-border)] bg-white px-5 text-sm font-bold text-[var(--aurora-text)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--aurora-primary-border)] hover:bg-[var(--aurora-primary-soft)]",

  buttonGhost:
    "inline-flex h-11 items-center justify-center rounded-[14px] px-4 text-sm font-semibold text-[var(--aurora-text-soft)] transition-all duration-200 hover:bg-[var(--aurora-bg-muted)] hover:text-[var(--aurora-text)]",

  metricCard:
    "rounded-[24px] border border-[var(--aurora-border)] bg-[var(--aurora-surface-strong)] p-5 shadow-[var(--aurora-shadow-soft)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[var(--aurora-shadow-medium)]",

  metricValue:
    "text-3xl font-black tracking-[-0.03em] text-[var(--aurora-text)]",

  metricLabel:
    "text-sm font-semibold text-[var(--aurora-text-soft)]",

  helper:
    "text-sm leading-6 text-[var(--aurora-text-muted)]",

  divider:
    "h-px w-full bg-[linear-gradient(90deg,transparent,rgba(15,23,42,0.10),transparent)]",
} as const;

export function getAuroraCssVariables(): Record<string, string> {
  return {
    "--aurora-bg": auroraTheme.colors.background,
    "--aurora-bg-soft": auroraTheme.colors.backgroundSoft,
    "--aurora-bg-muted": auroraTheme.colors.backgroundMuted,
    "--aurora-surface": auroraTheme.colors.surface,
    "--aurora-surface-strong": auroraTheme.colors.surfaceStrong,
    "--aurora-border": auroraTheme.colors.surfaceBorder,

    "--aurora-text": auroraTheme.colors.text,
    "--aurora-text-soft": auroraTheme.colors.textSoft,
    "--aurora-text-muted": auroraTheme.colors.textMuted,
    "--aurora-text-inverse": auroraTheme.colors.textInverse,

    "--aurora-primary": auroraTheme.colors.primary,
    "--aurora-primary-hover": auroraTheme.colors.primaryHover,
    "--aurora-primary-soft": auroraTheme.colors.primarySoft,
    "--aurora-primary-border": auroraTheme.colors.primaryBorder,

    "--aurora-secondary": auroraTheme.colors.secondary,
    "--aurora-secondary-soft": auroraTheme.colors.secondarySoft,
    "--aurora-secondary-border": auroraTheme.colors.secondaryBorder,

    "--aurora-success": auroraTheme.colors.success,
    "--aurora-success-soft": auroraTheme.colors.successSoft,

    "--aurora-warning": auroraTheme.colors.warning,
    "--aurora-warning-soft": auroraTheme.colors.warningSoft,

    "--aurora-danger": auroraTheme.colors.danger,
    "--aurora-danger-soft": auroraTheme.colors.dangerSoft,

    "--aurora-info": auroraTheme.colors.info,
    "--aurora-info-soft": auroraTheme.colors.infoSoft,

    "--aurora-shadow-soft": auroraTheme.shadow.soft,
    "--aurora-shadow-medium": auroraTheme.shadow.medium,
    "--aurora-shadow-strong": auroraTheme.shadow.strong,
    "--aurora-shadow-glow": auroraTheme.shadow.glow,

    "--aurora-radius-xs": auroraTheme.radius.xs,
    "--aurora-radius-sm": auroraTheme.radius.sm,
    "--aurora-radius-md": auroraTheme.radius.md,
    "--aurora-radius-lg": auroraTheme.radius.lg,
    "--aurora-radius-xl": auroraTheme.radius.xl,
    "--aurora-radius-pill": auroraTheme.radius.pill,

    "--aurora-space-xs": auroraTheme.spacing.xs,
    "--aurora-space-sm": auroraTheme.spacing.sm,
    "--aurora-space-md": auroraTheme.spacing.md,
    "--aurora-space-lg": auroraTheme.spacing.lg,
    "--aurora-space-xl": auroraTheme.spacing.xl,
    "--aurora-space-2xl": auroraTheme.spacing["2xl"],
    "--aurora-space-3xl": auroraTheme.spacing["3xl"],
    "--aurora-space-4xl": auroraTheme.spacing["4xl"],
    "--aurora-space-5xl": auroraTheme.spacing["5xl"],

    "--aurora-font-family": auroraTheme.typography.fontFamily,
    "--aurora-font-hero": auroraTheme.typography.hero,
    "--aurora-font-title": auroraTheme.typography.title,
    "--aurora-font-subtitle": auroraTheme.typography.subtitle,
    "--aurora-font-body": auroraTheme.typography.body,
    "--aurora-font-small": auroraTheme.typography.small,
    "--aurora-font-tiny": auroraTheme.typography.tiny,

    "--aurora-container": auroraTheme.layout.container,
    "--aurora-reading": auroraTheme.layout.reading,
    "--aurora-section-y": auroraTheme.layout.sectionY,
    "--aurora-section-gap": auroraTheme.layout.sectionGap,

    "--aurora-motion-fast": auroraTheme.motion.fast,
    "--aurora-motion-normal": auroraTheme.motion.normal,
    "--aurora-motion-slow": auroraTheme.motion.slow,
  };
}
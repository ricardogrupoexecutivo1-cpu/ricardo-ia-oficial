import { getAuroraCssVariables } from "@/lib/aurora-design-system";

function cssVarsToString(vars: Record<string, string>) {
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n");
}

export function AuroraThemeStyle() {
  const cssVariables = getAuroraCssVariables();

  const rootCss = cssVarsToString(cssVariables);

  const css = `
:root {
${rootCss}
}

html {
  font-family: var(--aurora-font-family);
  background: #f4f8fc;
  color: var(--aurora-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background:
    radial-gradient(circle at top, rgba(37,99,235,0.08), transparent 24%),
    radial-gradient(circle at right top, rgba(14,165,233,0.08), transparent 22%),
    linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
  color: var(--aurora-text);
}

::selection {
  background: rgba(37,99,235,0.18);
  color: var(--aurora-text);
}

* {
  box-sizing: border-box;
  border-color: var(--aurora-border);
}

a {
  color: inherit;
}

button,
input,
textarea,
select {
  font: inherit;
}

.aurora-grid-bg {
  background-image:
    linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px);
  background-size: 24px 24px;
}

.aurora-page-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(37,99,235,0.08), transparent 24%),
    radial-gradient(circle at right top, rgba(14,165,233,0.08), transparent 22%),
    linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
  color: var(--aurora-text);
}

.aurora-container {
  width: 100%;
  max-width: var(--aurora-container);
  margin-inline: auto;
  padding-inline: 16px;
}

@media (min-width: 640px) {
  .aurora-container {
    padding-inline: 24px;
  }
}

@media (min-width: 1024px) {
  .aurora-container {
    padding-inline: 32px;
  }
}

.aurora-section {
  padding-block: var(--aurora-section-y);
}

.aurora-surface {
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,255,0.96) 100%);
  border: 1px solid rgba(37,99,235,0.16);
  border-radius: 26px;
  box-shadow:
    0 18px 50px rgba(37,99,235,0.08),
    0 10px 28px rgba(15,23,42,0.06);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.aurora-surface-strong {
  background: linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(244,248,255,0.98) 100%);
  border: 1px solid rgba(37,99,235,0.20);
  border-radius: 30px;
  box-shadow:
    0 22px 60px rgba(37,99,235,0.10),
    0 12px 30px rgba(15,23,42,0.07);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.aurora-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.97) 100%);
  border: 1px solid rgba(15,23,42,0.09);
  border-radius: 24px;
  box-shadow:
    0 12px 28px rgba(15,23,42,0.05),
    inset 0 1px 0 rgba(255,255,255,0.75);
  transition:
    transform var(--aurora-motion-normal),
    box-shadow var(--aurora-motion-normal),
    border-color var(--aurora-motion-normal),
    background var(--aurora-motion-normal);
}

.aurora-card-hover:hover {
  transform: translateY(-2px);
  border-color: rgba(37,99,235,0.18);
  box-shadow:
    0 16px 36px rgba(37,99,235,0.08),
    0 10px 22px rgba(15,23,42,0.06);
}

.aurora-title {
  margin: 0;
  font-size: var(--aurora-font-title);
  line-height: 1.02;
  letter-spacing: -0.04em;
  font-weight: 900;
  color: var(--aurora-text);
}

.aurora-hero-title {
  margin: 0;
  font-size: var(--aurora-font-hero);
  line-height: 0.98;
  letter-spacing: -0.05em;
  font-weight: 950;
  color: var(--aurora-text);
}

.aurora-subtitle {
  margin: 0;
  font-size: var(--aurora-font-subtitle);
  line-height: 1.65;
  color: var(--aurora-text-soft);
}

.aurora-helper {
  margin: 0;
  font-size: var(--aurora-font-small);
  line-height: 1.7;
  color: var(--aurora-text-muted);
}

.aurora-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border-radius: var(--aurora-radius-pill);
  border: 1px solid rgba(37,99,235,0.18);
  background: linear-gradient(180deg, rgba(219,234,254,0.95) 0%, rgba(239,246,255,0.98) 100%);
  color: var(--aurora-info);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.01em;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.75);
}

.aurora-button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 16px;
  border: 1px solid #2563eb;
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  box-shadow:
    0 14px 30px rgba(37,99,235,0.24),
    inset 0 1px 0 rgba(255,255,255,0.18);
  transition:
    transform var(--aurora-motion-fast),
    box-shadow var(--aurora-motion-fast),
    background var(--aurora-motion-fast),
    border-color var(--aurora-motion-fast);
}

.aurora-button-primary:hover {
  transform: translateY(-1px);
  background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
  border-color: #1d4ed8;
  box-shadow:
    0 18px 36px rgba(37,99,235,0.28),
    inset 0 1px 0 rgba(255,255,255,0.18);
}

.aurora-button-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 16px;
  border: 1px solid rgba(37,99,235,0.18);
  background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(243,248,255,1) 100%);
  color: #0f172a;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  box-shadow:
    0 10px 22px rgba(15,23,42,0.05),
    inset 0 1px 0 rgba(255,255,255,0.82);
  transition:
    transform var(--aurora-motion-fast),
    border-color var(--aurora-motion-fast),
    background var(--aurora-motion-fast),
    box-shadow var(--aurora-motion-fast);
}

.aurora-button-secondary:hover {
  transform: translateY(-1px);
  border-color: rgba(37,99,235,0.28);
  background: linear-gradient(180deg, rgba(239,246,255,1) 0%, rgba(219,234,254,1) 100%);
  box-shadow:
    0 14px 28px rgba(37,99,235,0.10),
    inset 0 1px 0 rgba(255,255,255,0.82);
}

.aurora-input,
.aurora-textarea,
.aurora-select {
  width: 100%;
  border: 1px solid rgba(37,99,235,0.14);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.98) 100%);
  color: var(--aurora-text);
  outline: none;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.82),
    0 6px 16px rgba(15,23,42,0.03);
  transition:
    border-color var(--aurora-motion-fast),
    box-shadow var(--aurora-motion-fast),
    background var(--aurora-motion-fast);
}

.aurora-input,
.aurora-select {
  min-height: 48px;
  padding: 0 14px;
}

.aurora-textarea {
  min-height: 120px;
  padding: 14px;
  resize: vertical;
}

.aurora-input::placeholder,
.aurora-textarea::placeholder {
  color: var(--aurora-text-muted);
}

.aurora-input:focus,
.aurora-textarea:focus,
.aurora-select:focus {
  border-color: #2563eb;
  box-shadow:
    0 0 0 4px rgba(37,99,235,0.12),
    inset 0 1px 0 rgba(255,255,255,0.82);
}

.aurora-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(37,99,235,0.18),
    rgba(15,23,42,0.08),
    transparent
  );
}

.aurora-metric-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.97) 100%);
  border: 1px solid rgba(15,23,42,0.09);
  border-radius: 24px;
  box-shadow:
    0 12px 28px rgba(15,23,42,0.05),
    inset 0 1px 0 rgba(255,255,255,0.75);
  padding: 20px;
  transition:
    transform var(--aurora-motion-fast),
    box-shadow var(--aurora-motion-fast),
    border-color var(--aurora-motion-fast);
}

.aurora-metric-card:hover {
  transform: translateY(-2px);
  border-color: rgba(37,99,235,0.18);
  box-shadow:
    0 16px 34px rgba(37,99,235,0.08),
    0 10px 22px rgba(15,23,42,0.06);
}

.aurora-metric-label {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 800;
  color: var(--aurora-text-soft);
}

.aurora-metric-value {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1;
  letter-spacing: -0.04em;
  font-weight: 900;
  color: var(--aurora-text);
}

.aurora-status-ok {
  color: var(--aurora-success);
  background: var(--aurora-success-soft);
}

.aurora-status-warning {
  color: var(--aurora-warning);
  background: var(--aurora-warning-soft);
}

.aurora-status-danger {
  color: var(--aurora-danger);
  background: var(--aurora-danger-soft);
}

.aurora-status-info {
  color: var(--aurora-info);
  background: var(--aurora-info-soft);
}
`;

  return <style id="aurora-theme-style">{css}</style>;
}
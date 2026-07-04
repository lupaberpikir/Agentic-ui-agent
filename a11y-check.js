#!/usr/bin/env node
/**
 * a11y-check.js
 * Reads design.md color tokens and outputs WCAG pass/fail results.
 * Run: node a11y-check.js
 * Place this file in your project root alongside design.md.
 *
 * Checks:
 *   - Contrast ratio (WCAG 1.4.3 + 1.4.11)
 *   - Text spacing compliance hints (WCAG 1.4.12)
 *   - Target size reminder (WCAG 2.5.8)
 */

const fs = require("fs");
const path = require("path");

// ─── Color utilities ─────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const clean = hex.replace(/^#/, "");
  if (clean.length === 3) {
    return clean.split("").map((c) => parseInt(c + c, 16));
  }
  if (clean.length === 6) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }
  return null;
}

function parseColor(value) {
  if (!value) return null;
  value = value.trim();

  // Hex
  if (value.startsWith("#")) return hexToRgb(value);

  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = value.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) return [+rgbMatch[1], +rgbMatch[2], +rgbMatch[3]];

  // hsl — rough conversion (not handling full spec, just common values)
  const hslMatch = value.match(/hsla?\(\s*([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%/);
  if (hslMatch) {
    return hslToRgb(+hslMatch[1], +hslMatch[2] / 100, +hslMatch[3] / 100);
  }

  return null;
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function linearize(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance([r, g, b]) {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(rgb1, rgb2) {
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── Parse design.md tokens ──────────────────────────────────────────────────

function parseDesignMd(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const tokens = {};

  // Match lines like: --color-xxx: [value]   # comment
  const tokenRe = /--([\w-]+):\s*([^#\n]+)/g;
  let match;
  while ((match = tokenRe.exec(content)) !== null) {
    const key = "--" + match[1].trim();
    const val = match[2].trim().replace(/;$/, "");
    // Skip placeholder values like [value]
    if (!val.startsWith("[") && val !== "") {
      tokens[key] = val;
    }
  }

  return tokens;
}

// ─── Contrast checks ─────────────────────────────────────────────────────────

const CHECKS = [
  // [label, fg-token, bg-token, required-ratio, criterion, notes]
  ["Body text on background",           "--color-text-primary",   "--color-background", 4.5, "1.4.3 AA normal text"],
  ["Secondary text on background",      "--color-text-secondary", "--color-background", 4.5, "1.4.3 AA normal text"],
  ["Muted/caption text on background",  "--color-text-muted",     "--color-background", 4.5, "1.4.3 AA normal text (use 3:1 if text is ≥24px or ≥19px bold)"],
  ["Primary CTA on background",         "--color-primary",        "--color-background", 3.0, "1.4.11 non-text contrast"],
  ["Border on background",              "--color-border",         "--color-background", 3.0, "1.4.11 non-text contrast"],
];

// ─── Output helpers ──────────────────────────────────────────────────────────

const PASS = "\x1b[32m✅ PASS\x1b[0m";
const FAIL = "\x1b[31m❌ FAIL\x1b[0m";
const SKIP = "\x1b[33m⚠️  SKIP\x1b[0m";
const BOLD = (s) => `\x1b[1m${s}\x1b[0m`;
const DIM  = (s) => `\x1b[2m${s}\x1b[0m`;

function formatRatio(r) {
  return r.toFixed(2) + ":1";
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  // Walk up directory tree to find design.md (like ESLint config discovery)
  function findDesignMd(startDir) {
    let dir = startDir;
    while (true) {
      const candidate = path.join(dir, "design.md");
      if (fs.existsSync(candidate)) return candidate;
      const parent = path.dirname(dir);
      if (parent === dir) return null; // reached filesystem root
      dir = parent;
    }
  }

  const designPath = findDesignMd(process.cwd());
  if (!designPath) {
    console.error("❌ design.md not found in this directory or any parent directory.");
    console.error("   Run Extractor first, or place design.md in your project root.");
    process.exit(1);
  }

  const tokens = parseDesignMd(designPath);
  const tokenCount = Object.keys(tokens).length;

  console.log("\n" + BOLD("╔══════════════════════════════════════════════╗"));
  console.log(BOLD("║         a11y-check — WCAG Hard Gates         ║"));
  console.log(BOLD("╚══════════════════════════════════════════════╝"));
  console.log(DIM(`  design.md: ${designPath}`));
  console.log(DIM(`  Tokens found: ${tokenCount}\n`));

  let passCount = 0;
  let failCount = 0;
  let skipCount = 0;

  // ── Contrast checks ────────────────────────────────────────────────────────
  console.log(BOLD("── Contrast (WCAG 1.4.3 + 1.4.11) ──────────────────"));

  for (const [label, fgKey, bgKey, required, criterion, note] of CHECKS) {
    const fgVal = tokens[fgKey];
    const bgVal = tokens[bgKey];

    if (!fgVal || !bgVal) {
      console.log(`${SKIP}  ${label}`);
      console.log(DIM(`       Token missing: ${!fgVal ? fgKey : bgKey} — fill in design.md`));
      skipCount++;
      continue;
    }

    const fgRgb = parseColor(fgVal);
    const bgRgb = parseColor(bgVal);

    if (!fgRgb || !bgRgb) {
      console.log(`${SKIP}  ${label}`);
      console.log(DIM(`       Could not parse color: ${!fgRgb ? fgVal : bgVal}`));
      skipCount++;
      continue;
    }

    const ratio = contrastRatio(fgRgb, bgRgb);
    const passed = ratio >= required;
    const status = passed ? PASS : FAIL;

    console.log(`${status}  ${label}`);
    console.log(DIM(`       ${fgKey} (${fgVal}) on ${bgKey} (${bgVal})`));
    console.log(DIM(`       Ratio: ${formatRatio(ratio)} — need ≥ ${required}:1 — ${criterion}`));
    if (note) console.log(DIM(`       Note: ${note}`));

    passed ? passCount++ : failCount++;
    console.log();
  }

  // ── Text spacing reminder ──────────────────────────────────────────────────
  console.log(BOLD("── Text Spacing (WCAG 1.4.12) ───────────────────────"));
  console.log(`${SKIP}  Cannot auto-check — verify these in CSS:`);
  console.log(DIM("       line-height    ≥ 1.5 × font-size"));
  console.log(DIM("       paragraph gap  ≥ 2.0 × font-size"));
  console.log(DIM("       letter-spacing ≥ 0.12 × font-size"));
  console.log(DIM("       word-spacing   ≥ 0.16 × font-size"));
  console.log(DIM("       Layout must not break if user applies these overrides.\n"));
  skipCount++;

  // ── Target size reminder ───────────────────────────────────────────────────
  console.log(BOLD("── Target Size (WCAG 2.5.8) ─────────────────────────"));
  console.log(`${SKIP}  Cannot auto-check — verify in DevTools/inspector:`);
  console.log(DIM("       All interactive elements ≥ 24×24px CSS"));
  console.log(DIM("       Recommended on mobile: ≥ 44×44px"));
  console.log(DIM("       24px target OK if surrounded by ≥ 12px spacing\n"));
  skipCount++;

  // ── Reflow reminder ────────────────────────────────────────────────────────
  console.log(BOLD("── Reflow (WCAG 1.4.10) ─────────────────────────────"));
  console.log(`${SKIP}  Cannot auto-check — verify manually:`);
  console.log(DIM("       Set viewport to 320px: no horizontal scrollbar"));
  console.log(DIM("       Zoom browser to 400%: all content accessible\n"));
  skipCount++;

  // ── Focus visibility reminder ──────────────────────────────────────────────
  console.log(BOLD("── Focus Visibility (WCAG 2.4.7) ────────────────────"));
  console.log(`${SKIP}  Cannot auto-check — verify by keyboard-tabbing:`);
  console.log(DIM("       Every interactive element shows a visible focus ring"));
  console.log(DIM("       No outline: none without a custom :focus-visible style\n"));
  skipCount++;

  // ── Color alone reminder ───────────────────────────────────────────────────
  console.log(BOLD("── Color Alone (WCAG 1.4.1) ─────────────────────────"));
  console.log(`${SKIP}  Cannot auto-check — review component output:`);
  console.log(DIM("       Error states: color + icon + text label"));
  console.log(DIM("       Success states: color + icon or checkmark"));
  console.log(DIM("       Links in body text: must have underline or non-color indicator\n"));
  skipCount++;

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log(BOLD("══════════════════════════════════════════════════════"));
  console.log(BOLD(`  Summary`));
  console.log(`  ${PASS}: ${passCount}`);
  console.log(`  ${FAIL}: ${failCount}`);
  console.log(`  ${SKIP}: ${skipCount} (manual verification required)`);
  console.log(BOLD("══════════════════════════════════════════════════════\n"));

  if (failCount > 0) {
    console.log("\x1b[31m" + BOLD(`  ${failCount} hard gate(s) failed — do not ship.\x1b[0m`));
    process.exit(1);
  } else if (tokenCount < 5) {
    console.log("\x1b[33m  design.md has few tokens filled in. Run Extractor first.\x1b[0m");
  } else {
    console.log("\x1b[32m  All scripted checks passed. Complete manual items above before shipping.\x1b[0m");
  }
}

main();

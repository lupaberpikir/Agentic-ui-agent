# Agentic UI Workflow

A universal 3-agent design system for AI-assisted UI development. Works with Claude Code, Cursor, and Codex.

**The problem it solves:** AI generates the same generic UI every session because it has no memory of your design. This workflow gives it persistent context — once per project.

---

## How it works

Three agents run in a loop, with `design.md` as the shared memory:

```
Extractor → Builder → QA → (fix) → QA → done
```

- **Extractor** — reads your Figma/screenshots, populates `design.md` with tokens, typography (clamp formulas), spacing, and component patterns
- **Builder** — implements UI strictly from `design.md`. Handles full responsive range: 375 → 768 → 1440 → 1920 → 2560px. Never improvises design decisions
- **QA** — diffs the output against `design.md`. Flags drift. Never approves silently. Updates Anti-Patterns to prevent repeat mistakes

The only file that changes per project is `design.md`. The agents are global.

---

## Install (one time)

```bash
git clone https://github.com/lupaberpikir/Agentic-ui-agent.git
cd Agentic-ui-agent
bash install.sh
```

This:
- Copies agent files to `~/.agentic-ui/`
- Adds the workflow to `~/.claude/CLAUDE.md` (global Claude Code config)
- Installs `a11y-check` and `agentic-ui-init` as global commands via npm
- Prints the text to paste into Cursor's global user rules

---

## Start a new project

```bash
cd your-project
agentic-ui-init
```

Creates `design.md` in the project root. That's the only file you need per project.

---

## Run the accessibility checker

```bash
a11y-check
```

Reads your `design.md` color tokens, outputs WCAG pass/fail (contrast ratios, target size reminders, text spacing). Exits with code 1 if any hard gate fails — plug into CI.

Works from any subfolder — walks up to find `design.md` automatically.

---

## What goes where

| File | Location | Per project? |
|------|----------|-------------|
| `extractor.md` | `~/.agentic-ui/` | No |
| `builder.md` | `~/.agentic-ui/` | No |
| `qa.md` | `~/.agentic-ui/` | No |
| `a11y-check` | global npm command | No |
| `agentic-ui-init` | global npm command | No |
| `design.md` | project root | Yes — created by `agentic-ui-init` |

---

## Platform support

| Platform | Config |
|----------|--------|
| Claude Code | `~/.claude/CLAUDE.md` (set by installer) |
| Cursor | Paste into Settings → Rules for AI (installer prints the text) |

---

## What's in design.md

- Color tokens
- Typography with `clamp()` formulas derived from Figma anchor points (375 / 768 / 1440px)
- Large screen extension table (1440 → 1920 → 2560px)
- Spacing system and container max-width steps
- Component patterns (buttons, cards, nav, forms)
- Layout rules and grid columns across all breakpoints
- Anti-patterns (grows every time QA catches drift)
- Active Design Decisions (weekly changelog)
- WCAG hard rules (contrast, target size, text spacing, reflow, focus, color alone)
- UX laws as Builder guidance (Fitts, Hick, Miller, Jakob, Gestalt)

---

## What the agents enforce

**Typography**
- All font sizes use `clamp()` — no fixed px values
- Body text is the base unit; heading/body ratio stays proportional at all screen sizes
- Formula derived mathematically from Figma anchor points

**Responsive**
- Not just mobile/desktop — full range including 1920px and 2560px
- Container max-width steps up at large screens (prevents content island)
- Section padding grows fluidly

**Consistency**
- Builder reads Anti-Patterns before writing any code
- QA adds to Anti-Patterns every time it catches new drift
- Each session starts cleaner than the last

**Accessibility**
- WCAG hard gates in QA checklist (pass/fail, not suggestions)
- `a11y-check` script verifies contrast ratios programmatically
- UX laws baked into Builder's pre-build checklist

---

## Files in this repo

```
├── install.sh          ← run once to set up globally
├── init-project.sh     ← run per project (also: agentic-ui-init)
├── a11y-check.js       ← WCAG checker script (also: a11y-check)
├── package.json        ← npm package for global CLI install
├── design.md           ← blank template (copied by agentic-ui-init)
├── extractor.md        ← Agent 1 instructions
├── builder.md          ← Agent 2 instructions
├── qa.md               ← Agent 3 instructions
├── CLAUDE.md           ← Claude Code platform config (project-level template)
└── .cursorrules        ← Cursor platform config (project-level template)
```

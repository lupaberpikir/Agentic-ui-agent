# design.md
# Source of truth for this project's design system.
# Every AI agent MUST read this file before touching any UI.
# Update this file whenever designs change — before generating anything.

---

## Project Identity

- **Project name**: [PROJECT_NAME]
- **Product type**: [e.g. SaaS dashboard / landing page / mobile app]
- **Design source**: [Figma link / screenshot folder / existing codebase]
- **Stack**: [e.g. Next.js + Tailwind / React + CSS Modules / HTML + vanilla CSS]
- **Last updated**: [DATE]

---

## Color Tokens

> Fill these from Figma, existing CSS variables, or visual inspection.

```
--color-primary:        [value]   # Main brand color
--color-primary-hover:  [value]   # Hover state
--color-secondary:      [value]
--color-background:     [value]   # Page background
--color-surface:        [value]   # Card / panel background
--color-border:         [value]
--color-text-primary:   [value]
--color-text-secondary: [value]
--color-text-muted:     [value]
--color-success:        [value]
--color-warning:        [value]
--color-error:          [value]
```

---

## Typography

```
Font family (heading):  [e.g. Inter, Sora, Clash Display]
Font family (body):     [e.g. Inter, DM Sans]
Font weights used:      [e.g. 400 (regular), 500 (medium), 700 (bold)]
```

### Type Scale — Figma Anchor Points
> Extractor reads these from Figma. Values at 375, 768, 1440 are exact and non-negotiable.
> Builder derives clamp() formulas that pass through all three anchors and extend gracefully beyond 1440.

```
                  375px     768px     1440px    → clamp formula
Hero heading:     [Xpx]     [Xpx]     [Xpx]    → clamp([min], [vw-val], [max])
Section heading:  [Xpx]     [Xpx]     [Xpx]    → clamp([min], [vw-val], [max])
Body text (base): [Xpx]     [Xpx]     [Xpx]    → clamp([min], [vw-val], [max])
Label / caption:  [Xpx]     [Xpx]     [Xpx]    → clamp([min], [vw-val], [max])
```

### Type Scale — Large Screen Extension
> Beyond 1440px, values continue scaling until they hit the cap.
> Body text is the base — all other sizes are multipliers of it.
> Ratio between heading and body must stay proportional across all screens.

```
                  1440px    1920px    2560px    cap
Hero heading:     [Xpx]     [Xpx]     [Xpx]    [Xpx]
Section heading:  [Xpx]     [Xpx]     [Xpx]    [Xpx]
Body text (base): [Xpx]     [Xpx]     [Xpx]    [Xpx]
Label / caption:  [Xpx]     [Xpx]     [Xpx]    [Xpx]
```

### Scaling Rules
- Body text is the base unit. Everything else scales as a multiplier of it.
- Hero heading target ratio: ~[X]× body at all screen sizes
- Section heading target ratio: ~[X]× body at all screen sizes
- Label / caption target ratio: ~[X]× body at all screen sizes
- Line height: headings [value], body [value] — do not change these across breakpoints
- Letter spacing: headings [value], body [value]

---

## Spacing System

```
Base unit: [e.g. 4px or 8px]

Scale:
  --space-1:  [value]
  --space-2:  [value]
  --space-4:  [value]
  --space-6:  [value]
  --space-8:  [value]
  --space-12: [value]
  --space-16: [value]
  --space-24: [value]
```

### Section Padding — Figma Anchors + Large Screen Extension
> Spacing is fluid — it grows with the viewport to prevent cramped feeling at large screens.

```
                  375px     768px     1440px    1920px    2560px
Section padding:  [Xpx]     [Xpx]     [Xpx]     [Xpx]     [Xpx]
Component gap:    [Xpx]     [Xpx]     [Xpx]     [Xpx]     [Xpx]
```

### Container Max-Width — Stepped
> Prevents content island at large screens. Container expands in steps beyond 1440.

```
< 768px:   100% (full width)
768px:     100% (full width)
1280px:    [Xpx]
1440px:    [Xpx]  ← Figma desktop value
1920px:    [Xpx]  ← extended beyond Figma
2560px:    [Xpx]  ← extended beyond Figma
```

---

## Border & Radius

```
--radius-sm:   [value]
--radius-md:   [value]
--radius-lg:   [value]
--radius-full: [value]   # Pills, tags

Border style: [e.g. 1px solid var(--color-border)]
```

---

## Shadows

```
--shadow-sm:  [value]
--shadow-md:  [value]
--shadow-lg:  [value]
```

---

## Component Patterns

> Describe how key components look and behave. Be specific.

### Buttons
- Primary: [background, text color, radius, padding, hover state]
- Secondary: [outline or ghost style]
- Destructive: [color]
- Disabled state: [opacity or color]
- Size variants: [sm / md / lg padding values]

### Cards
- Background: [color]
- Border: [yes/no, style]
- Radius: [value]
- Padding: [value]
- Shadow: [value]

### Navigation
- Style: [sticky / fixed / static]
- Background: [color, blur?]
- Link style: [color, hover]
- Active state: [how indicated]

### Forms / Inputs
- Border: [style]
- Radius: [value]
- Focus state: [ring color]
- Error state: [how shown]
- Label position: [above / floating]

### [Add other components specific to this project]

---

## Layout Rules

- Grid system: [e.g. 12-col, gap 24px]
- Breakpoints:
  - Mobile:  < 768px
  - Tablet:  768px – 1279px
  - Desktop: 1280px – 1439px
  - Large:   1440px – 1919px
  - XL:      1920px – 2559px
  - 2K+:     2560px+
- Section structure: [e.g. always full-width wrapper + constrained inner container]
- Image handling: [aspect ratios, object-fit rules]

### Grid Columns — Figma Anchors + Large Screen Extension
```
                  375px   768px   1440px  1920px  2560px
Card grid:        [X]col  [X]col  [X]col  [X]col  [X]col
Feature grid:     [X]col  [X]col  [X]col  [X]col  [X]col
```

### Navigation Behavior
```
< 768px:   Hamburger menu
768px+:    Full nav
1920px+:   Full nav + [extra items visible / wider spacing]
```

---

## Motion & Animation

- Default transition: [e.g. 200ms ease]
- Hover transitions: [e.g. scale, opacity, color]
- Page transitions: [if any]
- Avoid: [list any animations that feel off-brand]

---

## Brand Voice (for copy in UI)

- Tone: [e.g. direct, confident, no fluff]
- Avoid words: [list]
- CTA style: [e.g. verb-first, short, active voice]

---

## Anti-Patterns

> Things Claude defaults to that are WRONG for this project.
> This section is critical — update it every time you catch drift.

- [ ] Do NOT use generic blue (#3B82F6) — use --color-primary
- [ ] Do NOT add drop shadows to every card — only use shadow on [specific components]
- [ ] Do NOT use rounded-full on buttons — use --radius-md
- [ ] Do NOT add gradient backgrounds unless specified
- [ ] Do NOT use placeholder Lorem Ipsum — use realistic content
- [ ] [Add project-specific anti-patterns here]

---

## Active Design Decisions

> This is your weekly changelog. Update BEFORE generating anything.
> Clear resolved items every sprint.

### Current sprint / session
- [ ] [e.g. Hero section: new layout with split text + image, image on right]
- [ ] [e.g. Nav: changed from sticky to fixed, added blur backdrop]
- [ ] [e.g. CTA button: changed from filled to outline style]

### Recently resolved (keep for 1 sprint then clear)
- [x] [example resolved change]

---

## Files & Structure Reference

> Help agents navigate the project without guessing.

```
src/
  components/     # Reusable UI components
  pages/          # or app/ for Next.js App Router
  styles/         # Global CSS / tokens
  assets/         # Images, icons, fonts
```

- Global styles live at: [path]
- Design tokens defined at: [path]
- Component naming convention: [e.g. PascalCase, kebab-case files]

---

## Accessibility — WCAG Hard Rules
> These are pass/fail. Not suggestions. Run `node a11y-check.js` to verify.
> QA must gate on these — do not ship if any fail.

### Contrast (WCAG 1.4.3 + 1.4.11)
```
Body text (< 24px, not bold):     contrast ratio ≥ 4.5:1 against background
Large text (≥ 24px or ≥ 19px bold): contrast ratio ≥ 3:1 against background
UI components (borders, icons):    contrast ratio ≥ 3:1 against adjacent color
Input borders:                     contrast ratio ≥ 3:1 against background
Focus ring:                        contrast ratio ≥ 3:1 against adjacent color

Project values to verify:
  --color-text-primary on --color-background:  [ratio] — target ≥ 4.5:1
  --color-text-secondary on --color-background: [ratio] — target ≥ 4.5:1
  --color-text-muted on --color-background:    [ratio] — target ≥ 4.5:1
  --color-primary (CTA) on --color-background: [ratio] — target ≥ 3:1
  --color-border on --color-background:        [ratio] — target ≥ 3:1
```

### Text Spacing (WCAG 1.4.12)
```
line-height:       ≥ 1.5× font size
paragraph spacing: ≥ 2× font size
letter-spacing:    ≥ 0.12× font size
word-spacing:      ≥ 0.16× font size

Must not break layout when these values are applied by user override.
```

### Target Size (WCAG 2.5.8)
```
Minimum: 24×24px CSS (hard floor — no exceptions)
Recommended: 44×44px (AA-level safety margin, especially on mobile)

Apply to: buttons, links, checkboxes, radio buttons, toggles, icon buttons
Spacing can substitute for size: 24px target is ok if 12px spacing surrounds it
```

### Reflow (WCAG 1.4.10)
```
At 320px viewport width: no horizontal scrolling
At 400% browser zoom:    no loss of content or function
Test: set viewport to 320px, verify all content is accessible without scroll
```

### Focus Visibility (WCAG 2.4.7)
```
Every interactive element must have a visible focus indicator
Focus ring: min 2px solid, contrast ≥ 3:1 against adjacent colors
Never use: outline: none without providing a custom alternative
```

### Resize Text (WCAG 1.4.4)
```
Content must be usable at 200% browser zoom
Use relative units (rem, em, %) — not px for layout-critical sizing
Test: zoom to 200%, verify no content is cut off or lost
```

### Color Alone (WCAG 1.4.1)
```
Never convey meaning through color only
Error states:   color + icon + text label
Success states: color + icon or checkmark
Status badges:  color + text label
Links in body:  underline or other non-color indicator
```

### Checker Script
```
Run: node a11y-check.js
Reads: design.md color tokens
Outputs: pass/fail for contrast, target size, text spacing
QA reads script output — does not eyeball these manually
```

---

## UX Laws — Builder Guidance
> These are heuristics, not pass/fail. Builder applies them while building.
> QA uses them as a "does this feel right" check, not a hard gate.

### Fitts's Law — target size and proximity
- Bigger and closer targets are faster to hit
- Primary CTA: largest interactive element on the screen
- Thumb zone on mobile (bottom 1/3 of screen): put primary actions here
- Don't place destructive actions (delete, cancel) near confirm buttons

### Hick's Law — fewer choices = faster decisions
- Nav items: max 5–7 top-level items before grouping/dropdown
- CTA per screen: ideally 1 primary, max 2 (primary + secondary)
- Forms: group related fields, don't show everything at once if avoidable
- If a screen has more than 2 competing CTAs → flag for design review

### Miller's Law — ~7±2 items before grouping
- Lists longer than 7 items need visual grouping, pagination, or search
- Navigation menus > 7 items → add section headers or nested groups
- Feature comparison tables > 7 rows → add sticky headers or filtering

### Jakob's Law — use familiar patterns
- Nav: top or left sidebar — don't reinvent
- Links: underlined or clearly distinct from body text
- Forms: label above field (not placeholder-only)
- Modals: X button top-right, Esc to close, backdrop click to dismiss
- If breaking a convention — it must be deliberate and clearly better

### Gestalt — visual grouping
- Related elements: grouped by spacing (proximity), not just color
- Section separation: whitespace gap ≥ 2× component internal gap
- Don't rely on color alone to show relationships (Gestalt + WCAG 1.4.1)
- Cards in a grid: consistent padding and border treatment, not mixed styles

---

## How to Use This File

**Extractor Agent**: Populate all [placeholder] values from the design source before any other agent runs.

**Builder Agent**: Read this entire file before writing a single line of UI code. When in doubt, check here first — not your training data.

**QA Agent**: After generation, diff the output against this file. Flag any value that doesn't match. Update Anti-Patterns if you catch new drift.

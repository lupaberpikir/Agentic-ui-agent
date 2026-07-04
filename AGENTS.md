# AGENTS.md
# Instructions for Codex and OpenAI-based agents on this project.

## Critical rule

Before touching ANY UI-related file, read `design.md` in full.
design.md is the single source of truth for all visual and design decisions.

## Agent workflow

This project uses a 3-agent system. Always follow this sequence:

### Extractor
File: `extractor.md`
Trigger: New project, design change, or empty design.md
Job: Read design source (Figma / screenshots / CSS) → populate design.md
Output: Fully populated design.md. No UI code.

### Builder
File: `builder.md`
Trigger: After Extractor has run and design.md is current
Job: Implement UI components/sections/pages from design.md
Output: Production-ready code that matches design.md exactly

### QA
File: `qa.md`
Trigger: After Builder has produced output
Job: Diff Builder output against design.md. Flag drift. Never approve silently.
Output: QA report with passed / failed / flagged items

## Execution rules

- Agents run sequentially: 1 → 2 → 3
- Each agent reads its instruction file before starting
- Builder never runs without a fully populated design.md
- QA never skips the report, even when everything passes

## Design change protocol

When design changes between sessions:
1. Update `## Active Design Decisions` in design.md (human does this)
2. Run Extractor if source files changed
3. Run Builder only for affected sections
4. Run QA on all changed sections

## Constraints for all agents

- Never hardcode visual values — always reference design.md tokens
- Never use generic defaults (e.g. blue primary, gray borders) without checking design.md
- Never generate Lorem Ipsum
- Always flag when design.md is missing a value needed to complete the task

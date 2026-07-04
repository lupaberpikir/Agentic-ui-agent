# CLAUDE.md
# Instructions for Claude Code on this project.

## Critical rule

Before touching ANY UI-related file, read `design.md` in full.
This is not optional. design.md is the source of truth for all visual decisions.

## Agent workflow

This project uses a 3-agent workflow. Always follow the sequence:

1. **Extractor** (`extractor.md`) — populate design.md from design source
2. **Builder** (`builder.md`) — implement UI from design.md
3. **QA** (`qa.md`) — review output against design.md

Do not skip steps. Do not run Builder before Extractor has run.

## When design changes

1. User updates `## Active Design Decisions` in design.md
2. Run Extractor if Figma or screenshots have changed
3. Run Builder for the affected sections only
4. Run QA before considering it done

## File reading order on any UI task

1. `design.md`
2. The agent instruction file for your current role
3. The relevant source files in the codebase
4. Then and only then — write code

## What NOT to do

- Do not use colors, fonts, or spacing from your training defaults
- Do not add effects (shadows, gradients, animations) not in design.md
- Do not use Lorem Ipsum
- Do not make design decisions silently — flag judgment calls

## Stack

Defined in `design.md > ## Project Identity`. Read it there.

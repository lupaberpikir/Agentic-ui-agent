#!/bin/bash
# Agentic UI Workflow — Global Installer
# Run once from this folder: bash install.sh
set -e

INSTALL_DIR="$HOME/.agentic-ui"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "Installing Agentic UI Workflow..."
echo "  Source: $SCRIPT_DIR"
echo "  Target: $INSTALL_DIR"
echo ""

# ─── 1. Copy agent files ────────────────────────────────────────────────────
mkdir -p "$INSTALL_DIR"
cp "$SCRIPT_DIR/extractor.md"  "$INSTALL_DIR/"
cp "$SCRIPT_DIR/builder.md"    "$INSTALL_DIR/"
cp "$SCRIPT_DIR/qa.md"         "$INSTALL_DIR/"
cp "$SCRIPT_DIR/design.md"     "$INSTALL_DIR/design-template.md"
echo "✅ Agent files installed to $INSTALL_DIR"

# ─── 2. Global Claude Code config ───────────────────────────────────────────
mkdir -p "$HOME/.claude"
CLAUDE_GLOBAL="$HOME/.claude/CLAUDE.md"

AGENTIC_BLOCK="
## Agentic UI Workflow (global)
## Agent files: $INSTALL_DIR/

Before ANY UI work, read ./design.md (project root) in full.
Agent instructions:
  Extractor: $INSTALL_DIR/extractor.md
  Builder:   $INSTALL_DIR/builder.md
  QA:        $INSTALL_DIR/qa.md

Workflow: Extractor → Builder → QA → fix → QA loop
Never use colors, fonts, or spacing not in design.md.
Run \`a11y-check\` after Builder output — do not ship if it fails.
"

if grep -q "Agentic UI Workflow (global)" "$CLAUDE_GLOBAL" 2>/dev/null; then
  echo "⚠️  ~/.claude/CLAUDE.md already has agentic-ui block — skipping"
else
  printf '%s\n' "$AGENTIC_BLOCK" >> "$CLAUDE_GLOBAL"
  echo "✅ Updated ~/.claude/CLAUDE.md"
fi

# ─── 3. Install CLI commands via npm ────────────────────────────────────────
chmod +x "$SCRIPT_DIR/a11y-check.js"
chmod +x "$SCRIPT_DIR/init-project.sh"
npm install -g "$SCRIPT_DIR/" --silent
echo "✅ Installed: a11y-check + agentic-ui-init (global npm)"

# ─── 4. Done ────────────────────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════"
echo "  Installation complete."
echo ""
echo "  Start any new project:"
echo "    cd your-project && agentic-ui-init"
echo ""
echo "  Run accessibility check:"
echo "    a11y-check"
echo ""
echo "  Claude Code: works globally — nothing else needed."
echo ""
echo "  Cursor global rules — paste into Settings > Rules for AI:"
echo "  ──────────────────────────────────────────────────────────"
cat <<EOF
For any UI/frontend work, read and follow the Agentic UI Workflow:
1. Always read ./design.md (project root) before writing any UI code
2. Extractor agent: $INSTALL_DIR/extractor.md
3. Builder agent:   $INSTALL_DIR/builder.md
4. QA agent:        $INSTALL_DIR/qa.md
Workflow: Extractor → Builder → QA → fix → QA (repeat until all pass)
Never use colors, fonts, spacing, or effects not defined in design.md.
EOF
echo "  ──────────────────────────────────────────────────────────"
echo "══════════════════════════════════════════════"
echo ""

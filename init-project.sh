#!/bin/bash
# agentic-ui-init
# Run in any project root to bootstrap the agentic UI workflow.
# Only copies design.md — agents live globally at ~/.agentic-ui/
set -e

INSTALL_DIR="$HOME/.agentic-ui"

if [ ! -d "$INSTALL_DIR" ]; then
  echo "❌ Agentic UI not installed. Run install.sh first."
  exit 1
fi

echo ""
echo "Initializing Agentic UI Workflow in $(pwd)..."

# design.md — the only per-project file needed
if [ -f "./design.md" ]; then
  echo "⚠️  design.md already exists — not overwriting."
  echo "   Delete it manually if you want a fresh template."
else
  cp "$INSTALL_DIR/design-template.md" ./design.md
  echo "✅ Created design.md"
fi

echo ""
echo "Next:"
echo "  1. Fill in design.md > Project Identity (name, stack, Figma link)"
echo "  2. Run Extractor to populate tokens from your design source"
echo "  3. Run Builder to implement UI"
echo "  4. Run QA and loop until all pass"
echo "  5. Run \`a11y-check\` before shipping"
echo ""

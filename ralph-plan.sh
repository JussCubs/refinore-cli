#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "🧠 Ralph Planning Mode — Generating IMPLEMENTATION_PLAN.md"
echo "Working directory: $(pwd)"
echo ""

# Run Claude Code once in planning mode
cat PROMPT_plan.md | claude -p --dangerously-skip-permissions

echo ""
echo "✅ Planning complete! Check IMPLEMENTATION_PLAN.md"

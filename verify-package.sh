#!/bin/bash
# Comprehensive verification script for refinore-cli

set -e

echo "════════════════════════════════════════════════════════════"
echo "  refinore-cli Package Verification"
echo "════════════════════════════════════════════════════════════"
echo

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_RUN=0
TESTS_PASSED=0

run_test() {
  local test_name="$1"
  local test_cmd="$2"
  
  TESTS_RUN=$((TESTS_RUN + 1))
  echo -n "[$TESTS_RUN] $test_name... "
  
  if eval "$test_cmd" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC}"
    return 1
  fi
}

echo "1. File Structure Checks"
echo "────────────────────────────────────────────────────────────"

run_test "package.json exists" "test -f package.json"
run_test "tsconfig.json exists" "test -f tsconfig.json"
run_test "README.md exists" "test -f README.md"
run_test "LICENSE exists" "test -f LICENSE"
run_test "dist/ directory exists" "test -d dist"
run_test "src/ directory exists" "test -d src"
run_test "node_modules/ exists" "test -d node_modules"

echo
echo "2. Source Files Checks"
echo "────────────────────────────────────────────────────────────"

run_test "src/index.ts exists" "test -f src/index.ts"
run_test "src/api.ts exists" "test -f src/api.ts"
run_test "src/config.ts exists" "test -f src/config.ts"
run_test "src/utils.ts exists" "test -f src/utils.ts"
run_test "All command files exist" "test -f src/commands/init.ts && test -f src/commands/mine.ts && test -f src/commands/status.ts"

echo
echo "3. Build Output Checks"
echo "────────────────────────────────────────────────────────────"

run_test "dist/index.js exists" "test -f dist/index.js"
run_test "dist/index.js is executable" "test -x dist/index.js"
run_test "dist/index.js has shebang" "head -1 dist/index.js | grep -q '#!/usr/bin/env node'"
run_test "All .d.ts files generated" "test -f dist/api.d.ts && test -f dist/config.d.ts"

echo
echo "4. Package.json Validation"
echo "────────────────────────────────────────────────────────────"

run_test "package.json has name" "grep -q '\"name\": \"refinore-cli\"' package.json"
run_test "package.json has version" "grep -q '\"version\":' package.json"
run_test "package.json has bin entry" "grep -q '\"refinore\": \"dist/index.js\"' package.json"
run_test "package.json has dependencies" "grep -q '\"chalk\":' package.json"
run_test "package.json has license" "grep -q '\"license\": \"MIT\"' package.json"

echo
echo "5. TypeScript Compilation"
echo "────────────────────────────────────────────────────────────"

run_test "TypeScript compiles clean" "npm run build"

echo
echo "6. CLI Functionality"
echo "────────────────────────────────────────────────────────────"

run_test "CLI shows help" "node dist/index.js --help"
run_test "CLI shows version" "node dist/index.js --version"
run_test "init command help" "node dist/index.js init --help"
run_test "mine command help" "node dist/index.js mine --help"
run_test "status command help" "node dist/index.js status --help"
run_test "balance command help" "node dist/index.js balance --help"
run_test "stop command help" "node dist/index.js stop --help"
run_test "history command help" "node dist/index.js history --help"
run_test "deposit command help" "node dist/index.js deposit --help"
run_test "whoami command help" "node dist/index.js whoami --help"

echo
echo "7. Error Handling"
echo "────────────────────────────────────────────────────────────"

run_test "balance without config shows error" "node dist/index.js balance 2>&1 | grep -q 'Not configured'"
run_test "mine without config shows error" "node dist/index.js mine 2>&1 | grep -q 'Not configured'"

echo
echo "8. Documentation Checks"
echo "────────────────────────────────────────────────────────────"

run_test "README has installation" "grep -q 'Installation' README.md"
run_test "README has commands" "grep -q 'Commands' README.md"
run_test "EXAMPLES.md exists" "test -f EXAMPLES.md"
run_test "CHANGELOG.md exists" "test -f CHANGELOG.md"
run_test "PUBLISHING.md exists" "test -f PUBLISHING.md"

echo
echo "9. NPM Package Validation"
echo "────────────────────────────────────────────────────────────"

run_test "npm pack dry-run" "npm pack --dry-run"
run_test "package.json is valid JSON" "cat package.json | python3 -m json.tool"

echo
echo "════════════════════════════════════════════════════════════"
echo -e "  ${BLUE}Test Results${NC}"
echo "════════════════════════════════════════════════════════════"
echo -e "  Total tests:  ${BLUE}$TESTS_RUN${NC}"
echo -e "  Passed:       ${GREEN}$TESTS_PASSED${NC}"
echo -e "  Failed:       ${RED}$((TESTS_RUN - TESTS_PASSED))${NC}"
echo

if [ $TESTS_PASSED -eq $TESTS_RUN ]; then
  echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
  echo
  echo "Package is ready to publish!"
  echo
  echo "Next steps:"
  echo "  1. npm login"
  echo "  2. npm publish"
  echo "  3. npx refinore-cli --help"
  echo
  exit 0
else
  echo -e "${RED}✗ SOME TESTS FAILED${NC}"
  echo
  echo "Please fix the failing tests before publishing."
  echo
  exit 1
fi

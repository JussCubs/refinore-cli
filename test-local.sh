#!/bin/bash
# Local testing script for refinore-cli

set -e

echo "=== Testing refinore-cli locally ==="
echo

# Test help
echo "1. Testing --help..."
node dist/index.js --help
echo "✓ Help works"
echo

# Test balance without config
echo "2. Testing balance without config..."
node dist/index.js balance 2>&1 | grep -q "Not configured" && echo "✓ Error handling works"
echo

# Test mine help
echo "3. Testing mine --help..."
node dist/index.js mine --help | grep -q "Amount to deploy" && echo "✓ Mine help works"
echo

# Test other commands help
echo "4. Testing all command helps..."
for cmd in status stop history deposit whoami; do
  node dist/index.js $cmd --help > /dev/null && echo "✓ $cmd --help works"
done
echo

echo "=== All basic tests passed! ==="
echo
echo "To test with real API:"
echo "  node dist/index.js init"
echo

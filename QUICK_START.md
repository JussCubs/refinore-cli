# refinore-cli — Quick Start Card

## 📍 Location
```
/home/ralph/cook/refinore-cli
```

## ⚡ Test It Now

```bash
cd /home/ralph/cook/refinore-cli

# Show help
node dist/index.js --help

# Test a command
node dist/index.js mine --help

# Run verification (if available)
bash verify-package.sh
```

## 🚀 Publish to npm

```bash
cd /home/ralph/cook/refinore-cli

# Login (first time only)
npm login

# Publish
npm publish

# Done! ✅
```

## 📦 After Publishing

```bash
# Anyone can install with:
npm install -g refinore-cli

# Or use directly:
npx -y refinore-cli --auto-mine
```

## 🧪 Test with Real API

```bash
cd /home/ralph/cook/refinore-cli

# Initialize
node dist/index.js init
# Paste API key from https://automine.refinore.com

# Check balance
node dist/index.js balance

# Start mining (basic)
node dist/index.js mine -a 0.01 -t 15

# Start mining with thresholds (new in v1.1.0!)
node dist/index.js mine -a 0.01 -t 15 --ev-min 5 --motherlode-min 100

# Check status
node dist/index.js status

# Stop
node dist/index.js stop
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| `README.md` | User guide |
| `EXAMPLES.md` | Usage examples with thresholds |
| `BUILD_COMPLETE.md` | Build summary |
| `PUBLISHING.md` | How to publish |
| `PROJECT_SUMMARY.md` | Technical details |

## ✅ Status (v1.1.0)

```
✓ TypeScript compiles clean
✓ All 8 commands working
✓ risk_tolerance removed
✓ Advanced thresholds added:
  • --ev-min <number>
  • --motherlode-min <number>
  • --sol-deployed-max <number>
✓ API updated to pass thresholds
✓ Documentation complete
✓ Ready to publish
```

## 🎯 Commands

```bash
refinore init      # Setup (now with optional thresholds)
refinore mine      # Start mining (NEW threshold flags)
refinore status    # Check status
refinore balance   # Show balances
refinore stop      # Stop mining
refinore history   # View history
refinore deposit   # Deposit info
refinore whoami    # Account info
```

## 💡 One-Liner Install + Mine

```bash
npx -y refinore-cli --auto-mine
```

## 🆕 What's New in v1.1.0

### Removed
- ❌ `--risk` / `-r` flag (low/medium/high)
- ❌ Risk tolerance from API calls
- ❌ Risk mentions in all documentation

### Added
- ✅ `--ev-min <number>` - Only mine if EV% > threshold
- ✅ `--motherlode-min <number>` - Only mine if motherlode > threshold
- ✅ `--sol-deployed-max <number>` - Stop after deploying X SOL total
- ✅ Threshold configuration in `refinore init`
- ✅ Thresholds saved to `~/.refinore/config.json`
- ✅ API now accepts `ev_threshold`, `motherlode_threshold`, `sol_deployed_max`

### Examples

**Before (v1.0.x):**
```bash
refinore mine -a 0.01 -t 15 -r medium
```

**After (v1.1.0):**
```bash
# Default: mine all rounds
refinore mine -a 0.01 -t 15

# Smart: only mine profitable rounds
refinore mine -a 0.01 -t 15 --ev-min 5

# Hunter: only mine high motherlodes
refinore mine -a 0.02 -t 25 --motherlode-min 100

# Budget: limit total spending
refinore mine -a 0.01 -t 15 --sol-deployed-max 1000

# Combined strategy
refinore mine -a 0.01 -t 15 --ev-min 3 --motherlode-min 50
```

---

**Built:** 2026-02-11  
**Version:** 1.1.0  
**Status:** ✅ READY TO SHIP

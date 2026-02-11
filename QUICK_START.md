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

# Run verification (41 tests)
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

# Start mining
node dist/index.js mine -a 0.01 -t 15

# Check status
node dist/index.js status

# Stop
node dist/index.js stop
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| `README.md` | User guide |
| `EXAMPLES.md` | Usage examples |
| `BUILD_COMPLETE.md` | Build summary |
| `PUBLISHING.md` | How to publish |
| `PROJECT_SUMMARY.md` | Technical details |

## ✅ Status

```
✓ All 41 tests passed
✓ TypeScript compiles clean
✓ All 8 commands working
✓ Error handling verified
✓ Documentation complete
✓ Ready to publish
```

## 🎯 Commands

```bash
refinore init      # Setup
refinore mine      # Start mining
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

---

**Built:** 2026-02-11  
**By:** Subagent  
**For:** Ralph  
**Status:** ✅ READY TO SHIP

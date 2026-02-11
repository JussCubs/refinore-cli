# TASK: Build refinore-cli — Standalone CLI for ORE Mining on Solana

## Goal
Create a polished npm CLI package that lets users mine ORE on Solana via refinORE with a single command.

## User Flow
```bash
# First run (installs globally)
npx -y refinore-cli --auto-mine

# After install, refinore is on PATH
refinore mine --amount 0.01 --tiles 15
refinore status
refinore balance
refinore stop
```

## Reference Material
- **refinore-mcp repo:** /tmp/refinore-mcp (MCP server with all API logic)
- **ore-miner skill:** /root/clawd/skills/ore-miner (agent skill with full docs)
- **API endpoints:** See ore-miner/SKILL.md for complete API reference

## Architecture
- **Package name:** refinore-cli
- **Binary name:** refinore
- **Stack:** Node.js + TypeScript + Commander.js for CLI framework
- **API client:** Reuse API logic from refinore-mcp
- **Config storage:** ~/.refinore/config.json (API key, wallet, preferences)
- **Session management:** Track active sessions, allow start/stop/status

## Commands to Implement

### Setup & Config
- `refinore init` — Interactive setup wizard (API key, optional thresholds)
- `refinore config` — Show/edit config
- `refinore whoami` — Show account info + wallet address

### Mining
- `refinore mine [options]` — Start mining session
  - `--amount <sol>` — Amount per round (default from config)
  - `--tiles <num>` — Number of tiles 1-25 (default from config)
  - `--token <SOL|USDC|ORE|stORE|SKR>` — Mining token (default SOL)
  - `--ev-min <number>` — Minimum EV% to mine (optional)
  - `--motherlode-min <number>` — Minimum motherlode ORE to mine (optional)
  - `--sol-deployed-max <number>` — Maximum total SOL deployed (optional)
  - `--mode <optimal|random|custom>` — Tile selection mode
  - `--auto-restart` — Auto-restart on completion (default: true)
- `refinore stop` — Stop active session
- `refinore status` — Show active session + round info
- `refinore history [options]` — Show mining history
  - `--limit <num>` — Number of rounds to show

### Wallet & Rewards
- `refinore balance` — Show all token balances
- `refinore rewards` — Show unclaimed rewards
- `refinore deposit` — Show deposit instructions

### Live Monitoring
- `refinore watch` — Live dashboard (blessed/ink UI)
  - Real-time round countdown
  - Session stats (rounds played, win rate, P&L)
  - Current balances
  - Motherlode size
  - Press 'q' to quit

### Strategies
- `refinore strategy list` — List saved strategies
- `refinore strategy create <name>` — Create new strategy
- `refinore strategy run <name>` — Start mining with strategy

## Non-Goals (Future Features)
- DCA/limit orders (API supports, but CLI v1 can skip)
- Staking operations (future)
- Multi-account support (future)

## Technical Requirements

1. **First-run experience**
   - If no config exists, run interactive `init` wizard automatically
   - Prompt for API key, validate it
   - Get wallet address from API, save to config
   - Optionally set thresholds (EV%, motherlode, SOL deployed max)

2. **Global install detection**
   - On first `npx` run, prompt: "Install globally for easier access?"
   - If yes, run `npm install -g refinore-cli`
   - Show success message

3. **Error handling**
   - Validate API key before commands
   - Check wallet balance before mining
   - Graceful API error messages (not raw stack traces)
   - Warn if balance too low

4. **Output style**
   - Use colors (chalk) — green for success, yellow for warnings, red for errors
   - Spinners for API calls (ora)
   - Tables for history/balances (cli-table3)
   - Progress bars for countdowns (if using watch mode)

5. **API client**
   - Reuse refinore-mcp's API logic where possible
   - Base URL: https://automine.refinore.com/api
   - Auth: x-api-key header with rsk_ token
   - Handle wallet_address requirement (fetch from /account/me, cache in config)

## File Structure
```
refinore-cli/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts         # CLI entry point (commander setup)
│   ├── commands/
│   │   ├── init.ts      # Setup wizard
│   │   ├── mine.ts      # Start mining
│   │   ├── status.ts    # Session status
│   │   ├── balance.ts   # Wallet balances
│   │   ├── stop.ts      # Stop mining
│   │   ├── history.ts   # Mining history
│   │   ├── watch.ts     # Live dashboard
│   │   └── strategy.ts  # Strategy management
│   ├── api/
│   │   └── client.ts    # API wrapper (GET/POST helpers)
│   ├── config/
│   │   └── manager.ts   # Config read/write (~/.refinore/config.json)
│   └── utils/
│       ├── logger.ts    # Colored output helpers
│       └── format.ts    # Format numbers, times, etc.
├── bin/
│   └── refinore         # Shebang script (#!/usr/bin/env node)
└── README.md
```

## Dependencies
- `commander` — CLI framework
- `chalk` — Terminal colors
- `ora` — Spinners
- `cli-table3` — Tables
- `inquirer` — Interactive prompts
- `node-fetch` — HTTP client (or axios)

## Success Criteria
- [ ] `npx -y refinore-cli --auto-mine` works on first run
- [ ] `refinore mine` starts a session with defaults
- [ ] `refinore status` shows current round + session stats
- [ ] `refinore balance` shows SOL, ORE, USDC balances
- [ ] `refinore stop` stops active session
- [ ] All commands validate API key exists
- [ ] Config persists at ~/.refinore/config.json
- [ ] Published to npm as `refinore-cli`
- [ ] README has quick start + full command reference

## Phase 1 (Initial Implementation)
Focus on core commands first:
1. `init` — setup wizard
2. `mine` — start session
3. `status` — show session
4. `balance` — show balances
5. `stop` — stop session

Ship this, then iterate with `watch` (live dashboard) and `strategy` commands.

---

Generate IMPLEMENTATION_PLAN.md with tasks broken down into implementable chunks.

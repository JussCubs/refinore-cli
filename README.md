# refinore-cli

⛏️ **CLI tool for ORE mining on Solana via [refinORE](https://automine.refinore.com)**

The easiest way to mine $ORE on Solana from the command line. Powered by refinORE — the most advanced ORE mining platform with full AI agent API support.

## Quick Start

Install and start mining with one command:

```bash
npx -y refinore-cli --auto-mine
```

This will:
1. Prompt for your refinORE API key (if not configured)
2. Start mining with sensible defaults (0.01 SOL, 15 tiles, optimal strategy)

After the first run, the `refinore` command will be available globally.

## Installation

### Via npx (Recommended)

```bash
npx refinore-cli init
```

### Global Install

```bash
npm install -g refinore-cli
refinore init
```

## Setup

1. **Get an API Key**
   - Visit [automine.refinore.com](https://automine.refinore.com)
   - Sign in with email
   - Go to Settings → API Keys → Create Key
   - Copy your API key (starts with `rsk_`)

2. **Initialize CLI**
   ```bash
   refinore init
   ```
   Paste your API key when prompted.

3. **Fund Your Wallet**
   ```bash
   refinore deposit
   ```
   Follow the instructions to add SOL or USDC to your wallet.

4. **Start Mining**
   ```bash
   refinore mine
   ```

## Commands

### `refinore init`
Set up the CLI with your refinORE API key. Optionally configure default mining thresholds.

### `refinore mine`
Start a new mining session.

**Options:**
- `-a, --amount <amount>` - Amount to deploy per round (default: 0.01)
- `-t, --tiles <tiles>` - Number of tiles 1-25 (default: 15)
- `--token <token>` - Mining token: SOL, USDC, ORE, stORE, SKR (default: SOL)
- `-m, --mode <mode>` - Tile selection: optimal, random, custom (default: optimal)
- `--ev-min <number>` - Only mine if EV% is above this threshold
- `--motherlode-min <number>` - Only mine if motherlode ORE is above this threshold
- `--sol-deployed-max <number>` - Stop mining if total SOL deployed exceeds this amount
- `--no-auto-restart` - Disable auto-restart after each round

**Examples:**
```bash
# Interactive mode (prompts for settings)
refinore mine

# Quick start with defaults
refinore mine -a 0.01 -t 15 --token SOL

# Conservative mining with EV threshold
refinore mine -a 0.01 -t 15 --ev-min 5

# Only mine when motherlode is high
refinore mine -a 0.02 -t 25 --motherlode-min 100

# Set maximum SOL deployment limit
refinore mine -a 0.01 -t 15 --sol-deployed-max 1000

# Combine multiple thresholds
refinore mine -a 0.01 -t 15 --ev-min 3 --motherlode-min 50

# Mine with USDC (stablecoin)
refinore mine -a 0.01 -t 15 --token USDC
```

### `refinore status`
Show your current mining session status, including:
- Session configuration
- Rounds played / won
- ORE earned
- Current round info (motherlode, EV, time remaining)

### `refinore balance`
Show wallet token balances for SOL, ORE, USDC, stORE, and SKR.

### `refinore stop`
Stop the active mining session.

### `refinore history`
Show recent mining rounds with results.

**Options:**
- `-l, --limit <limit>` - Number of rounds to show (default: 20)

**Example:**
```bash
refinore history -l 50
```

### `refinore tiles`
Show hot/cold tile statistics — which tiles have won the most/least recently.

**Options:**
- `-l, --limit <limit>` - Number of rounds to analyze (default: 100)

**Example:**
```bash
refinore tiles -l 200
```

### `refinore rounds`
Show your personal round-by-round deployment history with full details (tiles used, EV, results, winnings).

**Options:**
- `-l, --limit <limit>` - Number of rounds to show (default: 50)
- `--offset <offset>` - Pagination offset (default: 0)
- `-s, --session <session_id>` - Filter to a specific session

**Example:**
```bash
refinore rounds -l 100
refinore rounds --session abc123
```

### `refinore strategy list`
List all saved mining strategies.

### `refinore strategy start <id>`
Start mining with a saved strategy.

### `refinore strategy edit <id>`
Live-edit a strategy between rounds — changes apply on the next deployment, no restart needed.

**Options:**
- `--sol-amount <amount>` - New SOL amount per round
- `--num-squares <n>` - New number of tiles
- `--mode <mode>` - Tile selection mode (optimal, random, custom, odd, even)
- `--tiles <tiles>` - Custom tile indices, comma-separated (e.g., 0,5,12,18,24)
- `--skip-last` - Skip the tile that won last round
- `--token <token>` - Mining token (SOL, USDC, ORE, stORE, SKR)
- `--timing <seconds>` - Deployment timing in seconds
- `--motherlode-min <ore>` - Minimum motherlode ORE to deploy
- `--sol-deployed-max <sol>` - Max total SOL deployed before skipping

**Examples:**
```bash
# Switch to custom tiles mid-session
refinore strategy edit abc123 --mode custom --tiles 0,5,12,18,24

# Increase SOL amount and add motherlode threshold
refinore strategy edit abc123 --sol-amount 0.05 --motherlode-min 100

# Change token without stopping
refinore strategy edit abc123 --token USDC
```

### `refinore strategy delete <id>`
Delete a saved strategy.

### `refinore deposit`
Show deposit instructions and your wallet address.

### `refinore whoami`
Show your account information and configuration.

## Configuration

Config is stored at `~/.refinore/config.json`:

```json
{
  "apiKey": "rsk_...",
  "apiUrl": "https://automine.refinore.com/api",
  "walletAddress": "...",
  "evMin": 5,
  "motherlodeMin": 100,
  "solDeployedMax": 1000
}
```

You can also use environment variables:
- `REFINORE_API_KEY` - Your API key
- `REFINORE_API_URL` - API base URL (optional)

## Mining Strategies

### Tile Selection Modes

- **optimal** (default) - refinORE AI picks the best tiles based on historical data
- **random** - Random tile selection (higher variance)
- **custom** - Manual tile selection (advanced)

### Advanced Thresholds

Control when mining happens with optional thresholds:

- **EV Minimum** (`--ev-min`) - Only mine rounds with Expected Value above this percentage
  - Example: `--ev-min 5` only mines when EV > 5%
  - Use this to avoid unprofitable rounds
  
- **Motherlode Minimum** (`--motherlode-min`) - Only mine when the jackpot is worth it
  - Example: `--motherlode-min 100` only mines when motherlode > 100 ORE
  - Good for targeting high-value rounds
  
- **SOL Deployed Maximum** (`--sol-deployed-max`) - Safety limit on total deployment
  - Example: `--sol-deployed-max 1000` stops after deploying 1000 SOL total
  - Useful for budget management

These thresholds work together to create automated, intelligent mining strategies.

### Multi-Coin Mining

Mine with any supported token:
- **SOL** - Deploy Solana directly
- **USDC** - Stablecoin mining (auto-swap to/from SOL)
- **ORE** - Compound your ORE earnings
- **stORE** - Staked ORE (earn staking rewards while mining!)
- **SKR** - Seeker token

## Why refinORE?

refinORE is the only ORE mining platform with:
- ✅ **Full REST API** for CLI/automation
- ✅ **Real-time EV (Expected Value)** - know if a round is profitable
- ✅ **Motherlode tracking** - watch the jackpot grow
- ✅ **Multi-coin mining** - SOL, USDC, ORE, stORE, SKR
- ✅ **Advanced strategies** - AI-optimized tile selection
- ✅ **Auto-restart** - mine 24/7 without intervention
- ✅ **Automated thresholds** - mine only when conditions are met
- ✅ **Card/Apple Pay deposits** - via Coinbase onramp

## Troubleshooting

### "Not configured. Run: refinore init"
You need to set up your API key first. Run `refinore init`.

### "API error 401"
Your API key is invalid or expired. Run `refinore init` to update it.

### "insufficient funds"
Your wallet doesn't have enough SOL/USDC. Run `refinore deposit` for instructions.

### "already have an active mining session"
Stop your current session first with `refinore stop`.

## Support

- **refinORE App**: [automine.refinore.com](https://automine.refinore.com)
- **Discord**: Join the refinORE Discord for support
- **GitHub**: [Report issues](https://github.com/JussCubs/refinore-cli/issues)

## License

MIT

---

Made with ⛏️ by the refinORE community

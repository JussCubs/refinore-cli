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
Set up the CLI with your refinORE API key.

### `refinore mine`
Start a new mining session.

**Options:**
- `-a, --amount <amount>` - Amount to deploy per round (default: 0.01)
- `-t, --tiles <tiles>` - Number of tiles 1-25 (default: 15)
- `--token <token>` - Mining token: SOL, USDC, ORE, stORE, SKR (default: SOL)
- `-r, --risk <risk>` - Risk tolerance: low, medium, high (default: medium)
- `-m, --mode <mode>` - Tile selection: optimal, random, custom (default: optimal)
- `--no-auto-restart` - Disable auto-restart after each round

**Examples:**
```bash
# Interactive mode (prompts for settings)
refinore mine

# Quick start with defaults
refinore mine -a 0.01 -t 15 --token SOL -r medium

# Conservative mining
refinore mine -a 0.005 -t 10 -r low

# Aggressive (all tiles)
refinore mine -a 0.02 -t 25 -r high

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
  "walletAddress": "..."
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

### Risk Tolerance

- **low** - Conservative, fewer tiles, steady returns
- **medium** (default) - Balanced approach
- **high** - Aggressive, more tiles, higher variance

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
- **GitHub**: [Report issues](https://github.com/yourusername/refinore-cli/issues)

## License

MIT

---

Made with ⛏️ by the refinORE community

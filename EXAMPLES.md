# refinore-cli Examples

## Quick Start

### One-Command Start
```bash
npx -y refinore-cli --auto-mine
```
This will prompt for API key if needed, then start mining immediately.

## Basic Workflow

### 1. Initial Setup
```bash
# Install globally
npm install -g refinore-cli

# Or use npx
npx refinore-cli init
```

When prompted:
- Paste your API key from https://automine.refinore.com
- Press Enter to use default API URL

### 2. Fund Your Wallet
```bash
refinore deposit
```

Copy the wallet address and either:
- Send SOL from another wallet
- Use the refinORE app to buy with credit card

### 3. Check Balance
```bash
refinore balance
```

### 4. Start Mining
```bash
refinore mine
```

Follow the interactive prompts to configure:
- Amount per round (e.g., 0.01 SOL)
- Number of tiles (1-25)
- Mining token (SOL, USDC, ORE, stORE, SKR)
- Risk tolerance (low, medium, high)
- Strategy (optimal, random, custom)

### 5. Monitor Progress
```bash
# Check current session
refinore status

# View history
refinore history
```

### 6. Stop Mining
```bash
refinore stop
```

## Advanced Examples

### Conservative Mining
Small bets, fewer tiles, lower risk:
```bash
refinore mine -a 0.005 -t 10 -r low --token SOL
```

### Aggressive Mining
Larger bets, all tiles, high risk:
```bash
refinore mine -a 0.05 -t 25 -r high --token SOL
```

### Stablecoin Mining
Mine with USDC to avoid SOL price exposure:
```bash
refinore mine -a 0.01 -t 15 --token USDC -r medium
```

### ORE Compounding
Reinvest your ORE earnings:
```bash
refinore mine -a 0.1 -t 20 --token ORE -r medium
```

### Stake and Mine
Mine with stORE to earn staking rewards while mining:
```bash
refinore mine -a 0.01 -t 15 --token stORE -r medium
```

## Automation Examples

### Shell Script for 24/7 Mining
```bash
#!/bin/bash
# mine-forever.sh

while true; do
  echo "Starting mining session..."
  refinore mine -a 0.01 -t 15 --token SOL -r medium
  
  # If mining stops unexpectedly, wait and restart
  echo "Session ended. Waiting 30s before restart..."
  sleep 30
done
```

### Cron Job for Daily Status Reports
```bash
# Add to crontab with: crontab -e
# Send daily mining report at 9 AM
0 9 * * * refinore history -l 100 > ~/mining-report-$(date +\%Y\%m\%d).txt
```

### Check Balance Before Mining
```bash
#!/bin/bash
# smart-mine.sh - Only mine if balance > 0.1 SOL

BALANCE=$(refinore balance | grep "SOL" | awk '{print $2}')

if (( $(echo "$BALANCE > 0.1" | bc -l) )); then
  echo "Balance sufficient ($BALANCE SOL), starting mining..."
  refinore mine -a 0.01 -t 15 --token SOL -r medium
else
  echo "Balance too low ($BALANCE SOL), skipping..."
fi
```

## Strategy Examples

### Motherlode Hunter
When motherlode is high, use all tiles to maximize chances:
```bash
# Check current round info
refinore status

# If motherlode > 100 ORE, go full degen
refinore mine -a 0.02 -t 25 -r high
```

### EV-Based Strategy
```bash
#!/bin/bash
# ev-mine.sh - Only mine when Expected Value is positive

EV=$(refinore status | grep "Expected Value" | awk '{print $3}' | tr -d '%+')

if (( $(echo "$EV > 5" | bc -l) )); then
  echo "EV is positive ($EV%), mining..."
  refinore mine -a 0.02 -t 20 -r high
elif (( $(echo "$EV > 0" | bc -l) )); then
  echo "EV is slightly positive ($EV%), conservative mining..."
  refinore mine -a 0.01 -t 10 -r low
else
  echo "EV is negative ($EV%), skipping this round..."
fi
```

### Diversified Mining
Spread risk across multiple tokens:
```bash
# Mine with SOL
refinore mine -a 0.01 -t 10 --token SOL -r medium &
sleep 5

# Mine with USDC
refinore mine -a 10 -t 10 --token USDC -r medium &
```

## Monitoring Examples

### Live Status Monitor
```bash
# Watch status every 10 seconds
watch -n 10 refinore status
```

### History Analysis
```bash
# Get last 100 rounds
refinore history -l 100 > history.txt

# Calculate win rate
grep "WIN" history.txt | wc -l
```

### Balance Alerts
```bash
#!/bin/bash
# alert-low-balance.sh - Send alert if balance < 0.05 SOL

BALANCE=$(refinore balance | grep "SOL" | awk '{print $2}')

if (( $(echo "$BALANCE < 0.05" | bc -l) )); then
  echo "WARNING: Low balance ($BALANCE SOL)"
  # Send notification (e.g., via email, Telegram, etc.)
fi
```

## Environment Variable Usage

Instead of storing API key in config file:
```bash
export REFINORE_API_KEY="rsk_your_key_here"
export REFINORE_API_URL="https://automine.refinore.com/api"

refinore balance
```

Or inline:
```bash
REFINORE_API_KEY="rsk_..." refinore mine -a 0.01 -t 15
```

## Docker Example

```dockerfile
FROM node:20-alpine

RUN npm install -g refinore-cli

ENV REFINORE_API_KEY=rsk_your_key_here

CMD ["refinore", "mine", "-a", "0.01", "-t", "15", "--token", "SOL"]
```

Build and run:
```bash
docker build -t refinore-miner .
docker run -d --name miner refinore-miner
```

## Troubleshooting Examples

### Test API Connection
```bash
refinore whoami
```

### Verify Config
```bash
cat ~/.refinore/config.json
```

### Re-initialize
```bash
rm -rf ~/.refinore
refinore init
```

### Check Node.js Version
```bash
node --version  # Should be >= 14.0.0
```

## Tips

1. **Start small**: Test with 0.005-0.01 SOL per round first
2. **Monitor EV**: Only mine when Expected Value is positive
3. **Watch motherlode**: Increase tiles when jackpot is high
4. **Use stablecoins**: Mine with USDC if you're risk-averse
5. **Auto-restart**: Keep it enabled for 24/7 mining
6. **Check history**: Review your results and adjust strategy
7. **Compound earnings**: Use ORE token to reinvest profits

## Support

Need help? Check the [README](README.md) or visit:
- refinORE App: https://automine.refinore.com
- Discord: https://discord.gg/refinore

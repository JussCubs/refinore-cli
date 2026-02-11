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
- Optionally set default thresholds (EV%, motherlode, SOL deployed)

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
- Strategy (optimal, random, custom)
- Optional: Advanced thresholds

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
Small bets, fewer tiles:
```bash
refinore mine -a 0.005 -t 10 --token SOL
```

### Aggressive Mining
Larger bets, all tiles:
```bash
refinore mine -a 0.05 -t 25 --token SOL
```

### Smart Mining with EV Threshold
Only mine when Expected Value is positive:
```bash
refinore mine -a 0.01 -t 15 --ev-min 5
```
This only mines rounds where EV > 5%, avoiding unprofitable rounds.

### Motherlode Hunter
Target high-value rounds only:
```bash
refinore mine -a 0.02 -t 25 --motherlode-min 100
```
Only mines when the jackpot is above 100 ORE.

### Budget-Controlled Mining
Set a maximum total SOL deployment:
```bash
refinore mine -a 0.01 -t 15 --sol-deployed-max 500
```
Automatically stops after deploying 500 SOL total across all rounds.

### Combined Thresholds
Use multiple conditions for optimal strategy:
```bash
refinore mine -a 0.01 -t 15 --ev-min 3 --motherlode-min 50 --sol-deployed-max 1000
```
Only mines when:
- EV > 3%
- Motherlode > 50 ORE
- Total deployed < 1000 SOL

### Stablecoin Mining
Mine with USDC to avoid SOL price exposure:
```bash
refinore mine -a 0.01 -t 15 --token USDC
```

### ORE Compounding
Reinvest your ORE earnings:
```bash
refinore mine -a 0.1 -t 20 --token ORE
```

### Stake and Mine
Mine with stORE to earn staking rewards while mining:
```bash
refinore mine -a 0.01 -t 15 --token stORE
```

## Automation Examples

### Shell Script for Smart 24/7 Mining
```bash
#!/bin/bash
# smart-mine.sh - Mine with EV threshold

while true; do
  echo "Starting mining session with EV threshold..."
  refinore mine -a 0.01 -t 15 --token SOL --ev-min 5
  
  # If mining stops, wait and check again
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
# balance-check.sh - Only mine if balance > 0.1 SOL

BALANCE=$(refinore balance | grep "SOL" | awk '{print $2}')

if (( $(echo "$BALANCE > 0.1" | bc -l) )); then
  echo "Balance sufficient ($BALANCE SOL), starting mining..."
  refinore mine -a 0.01 -t 15 --token SOL --ev-min 5
else
  echo "Balance too low ($BALANCE SOL), skipping..."
fi
```

## Strategy Examples

### EV-Based Strategy
```bash
#!/bin/bash
# ev-strategy.sh - Adjust strategy based on current EV

# Get current round info from status
refinore status > /tmp/status.txt
EV=$(grep "Expected Value" /tmp/status.txt | awk '{print $3}' | tr -d '%+')

if (( $(echo "$EV > 10" | bc -l) )); then
  echo "Very high EV ($EV%), aggressive mining..."
  refinore mine -a 0.05 -t 25
elif (( $(echo "$EV > 5" | bc -l) )); then
  echo "Good EV ($EV%), standard mining..."
  refinore mine -a 0.02 -t 20
elif (( $(echo "$EV > 0" | bc -l) )); then
  echo "Positive EV ($EV%), conservative mining..."
  refinore mine -a 0.01 -t 10
else
  echo "Negative EV ($EV%), skipping this round..."
fi
```

### Motherlode Tracking
Monitor and mine based on jackpot size:
```bash
#!/bin/bash
# motherlode-tracker.sh

while true; do
  refinore status | grep "Motherlode"
  
  # Mine when motherlode is high
  refinore mine -a 0.01 -t 15 --motherlode-min 80
  
  sleep 60
done
```

### Diversified Mining
Spread risk across multiple tokens:
```bash
# Mine with SOL
refinore mine -a 0.01 -t 10 --token SOL --ev-min 5 &

# Mine with USDC (in a separate session if supported)
# refinore mine -a 10 -t 10 --token USDC --ev-min 5 &
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
TOTAL=$(grep -c "Round" history.txt)
WINS=$(grep -c "WIN" history.txt)
echo "Win rate: $WINS / $TOTAL"
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

# Mine with EV threshold
CMD ["refinore", "mine", "-a", "0.01", "-t", "15", "--token", "SOL", "--ev-min", "5"]
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
2. **Use EV thresholds**: Set `--ev-min 5` to mine only profitable rounds
3. **Watch motherlode**: Use `--motherlode-min` to target high-value rounds
4. **Set budget limits**: Use `--sol-deployed-max` to control total spending
5. **Use stablecoins**: Mine with USDC if you're risk-averse
6. **Auto-restart**: Keep it enabled for 24/7 mining
7. **Check history**: Review your results and adjust thresholds
8. **Compound earnings**: Use ORE token to reinvest profits

## Real-World Scenarios

### Scenario 1: Conservative Investor
"I want steady returns with minimal risk"
```bash
refinore mine -a 0.005 -t 10 --token USDC --ev-min 5 --sol-deployed-max 100
```

### Scenario 2: Jackpot Hunter
"I only want to mine when the motherlode is huge"
```bash
refinore mine -a 0.05 -t 25 --motherlode-min 200
```

### Scenario 3: Smart Automation
"Mine 24/7 but only when it makes sense"
```bash
refinore mine -a 0.01 -t 15 --ev-min 3 --motherlode-min 50 --auto-restart
```

### Scenario 4: Budget-Conscious
"I have 100 SOL to spend, make it count"
```bash
refinore mine -a 0.01 -t 15 --ev-min 5 --sol-deployed-max 100
```

## Support

Need help? Check the [README](README.md) or visit:
- refinORE App: https://automine.refinore.com
- Discord: https://discord.gg/refinore

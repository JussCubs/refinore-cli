import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { createTable, header, errorMessage, successMessage, section } from '../utils';

export async function balanceCommand(): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  const spinner = ora('Fetching balances...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const accountInfo = await api.getAccountInfo();
    const walletAddress = accountInfo.wallet_address || accountInfo.walletAddress;

    if (!walletAddress) {
      spinner.fail('Could not get wallet address');
      errorMessage('Account info missing wallet address');
      process.exit(1);
    }

    const balances = await api.getBalances(walletAddress);
    spinner.succeed('Balances loaded');

    header('💰 Wallet Balances');

    console.log(chalk.gray('Wallet: ') + chalk.white(walletAddress));
    console.log();

    const table = createTable(['Token', 'Balance', 'USD Value']);

    const tokens = [
      { symbol: 'SOL', balance: balances.sol || 0, usd: balances.solUsd || 0 },
      { symbol: 'ORE', balance: balances.ore || 0, usd: balances.oreUsd || 0 },
      { symbol: 'USDC', balance: balances.usdc || 0, usd: balances.usdcUsd || 0 },
      { symbol: 'stORE', balance: balances.store || 0, usd: balances.storeUsd || 0 },
      { symbol: 'SKR', balance: balances.skr || 0, usd: balances.skrUsd || 0 },
    ];

    tokens.forEach(token => {
      const balanceStr = token.balance.toFixed(6);
      const usdStr = token.usd ? `$${token.usd.toFixed(2)}` : '-';
      const balanceColor = token.balance > 0 ? chalk.green : chalk.gray;
      
      table.push([
        chalk.bold(token.symbol),
        balanceColor(balanceStr),
        token.usd > 0 ? chalk.green(usdStr) : chalk.gray(usdStr),
      ]);
    });

    console.log(table.toString());
    console.log();

    // Show total USD value
    const totalUsd = tokens.reduce((sum, t) => sum + (t.usd || 0), 0);
    if (totalUsd > 0) {
      console.log(chalk.bold('Total Value: ') + chalk.green.bold(`$${totalUsd.toFixed(2)}`));
      console.log();
    }

    // Try to fetch rewards
    try {
      const rewards = await api.getRewards(walletAddress);
      if (rewards && (rewards.unclaimed_sol > 0 || rewards.unrefined_ore > 0)) {
        section('🎁 Unclaimed Rewards');
        const rewardsTable = createTable(['Type', 'Amount']);
        
        if (rewards.unclaimed_sol > 0) {
          rewardsTable.push(['Unclaimed SOL', chalk.yellow(rewards.unclaimed_sol.toFixed(6))]);
        }
        if (rewards.unrefined_ore > 0) {
          rewardsTable.push(['Unrefined ORE', chalk.yellow(rewards.unrefined_ore.toFixed(6))]);
        }
        if (rewards.bonus_ore > 0) {
          rewardsTable.push(['Bonus ORE', chalk.yellow(rewards.bonus_ore.toFixed(6))]);
        }

        console.log(rewardsTable.toString());
        console.log();
      }
    } catch (err) {
      // Rewards endpoint might not be available, ignore
    }

  } catch (error: any) {
    spinner.fail('Failed to fetch balances');
    errorMessage(error.message);
    process.exit(1);
  }
}

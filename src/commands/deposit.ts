import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { header, errorMessage, successMessage, infoMessage } from '../utils';

export async function depositCommand(): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  const spinner = ora('Fetching deposit info...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const accountInfo = await api.getAccountInfo();

    spinner.succeed('Deposit info loaded');

    const walletAddress = accountInfo.wallet_address || accountInfo.walletAddress;

    if (!walletAddress) {
      errorMessage('Could not get wallet address');
      process.exit(1);
    }

    header('💰 Deposit Funds');

    console.log(chalk.bold('Your refinORE Wallet Address:'));
    console.log();
    console.log(chalk.green.bold(`  ${walletAddress}`));
    console.log();

    infoMessage('How to deposit:');
    console.log();
    console.log(chalk.cyan('1. Credit Card / Apple Pay:'));
    console.log(chalk.gray('   • Visit ') + chalk.white('https://automine.refinore.com'));
    console.log(chalk.gray('   • Click the "Fund" button'));
    console.log(chalk.gray('   • Use Coinbase onramp for instant deposits'));
    console.log();

    console.log(chalk.cyan('2. Transfer from Another Wallet:'));
    console.log(chalk.gray('   • Send ') + chalk.white('SOL') + chalk.gray(' or ') + chalk.white('USDC') + chalk.gray(' to the address above'));
    console.log(chalk.gray('   • Network: ') + chalk.white('Solana'));
    console.log(chalk.gray('   • Make sure to use the Solana network (not Ethereum!)'));
    console.log();

    console.log(chalk.cyan('3. Recommended Amounts:'));
    console.log(chalk.gray('   • Minimum: ') + chalk.white('0.01 SOL') + chalk.gray(' (~$1-2)'));
    console.log(chalk.gray('   • Test run: ') + chalk.white('0.1 SOL') + chalk.gray(' (~$10-20)'));
    console.log(chalk.gray('   • Serious mining: ') + chalk.white('0.5-1 SOL') + chalk.gray(' (~$50-100)'));
    console.log();

    successMessage('After depositing, check your balance with: ' + chalk.white('refinore balance'));
    console.log();

    // Show current balance if available
    try {
      const balances = await api.getBalances(walletAddress);
      if (balances.sol > 0) {
        console.log(chalk.green('✓ ') + chalk.gray('Current balance: ') + chalk.white(`${balances.sol.toFixed(6)} SOL`));
        console.log();
      }
    } catch (err) {
      // Ignore balance fetch errors
    }

  } catch (error: any) {
    spinner.fail('Failed to fetch deposit info');
    errorMessage(error.message);
    process.exit(1);
  }
}

import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { createTable, header, errorMessage } from '../utils';

export async function whoamiCommand(): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  const spinner = ora('Fetching account info...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const accountInfo = await api.getAccountInfo();

    spinner.succeed('Account info loaded');

    header('👤 Account Info');

    const table = createTable(['Property', 'Value']);

    if (accountInfo.email) {
      table.push(['Email', chalk.white(accountInfo.email)]);
    }

    if (accountInfo.wallet_address || accountInfo.walletAddress) {
      const wallet = accountInfo.wallet_address || accountInfo.walletAddress;
      table.push(['Wallet', chalk.cyan(wallet)]);
    }

    if (accountInfo.user_id || accountInfo.userId) {
      const userId = accountInfo.user_id || accountInfo.userId;
      table.push(['User ID', chalk.gray(userId)]);
    }

    if (accountInfo.created_at || accountInfo.createdAt) {
      const created = accountInfo.created_at || accountInfo.createdAt;
      const date = new Date(created);
      table.push(['Member Since', chalk.white(date.toLocaleDateString())]);
    }

    console.log(table.toString());
    console.log();

    // Show API URL
    console.log(chalk.gray('API: ') + chalk.white(getApiUrl(config)));
    console.log(chalk.gray('Config: ') + chalk.white('~/.refinore/config.json'));
    console.log();

  } catch (error: any) {
    spinner.fail('Failed to fetch account info');
    errorMessage(error.message);
    process.exit(1);
  }
}

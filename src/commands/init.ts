import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { saveConfig, getApiUrl } from '../config';
import { RefinoreAPI } from '../api';
import { successMessage, errorMessage, header, infoMessage } from '../utils';

export async function initCommand(): Promise<void> {
  header('⛏️  refinORE CLI Setup');

  console.log('Welcome to refinORE — autonomous ORE mining on Solana!');
  console.log();
  console.log('To get started, you need an API key from refinORE:');
  console.log(chalk.cyan('  1. Visit https://automine.refinore.com'));
  console.log(chalk.cyan('  2. Sign in with your email'));
  console.log(chalk.cyan('  3. Go to Settings → API Keys → Create Key'));
  console.log(chalk.cyan('  4. Copy your API key (starts with rsk_)'));
  console.log();

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'apiKey',
      message: 'Enter your refinORE API key:',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'API key is required';
        }
        if (!input.startsWith('rsk_')) {
          return 'API key should start with rsk_';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'apiUrl',
      message: 'API URL (press Enter for default):',
      default: 'https://automine.refinore.com/api',
    },
    {
      type: 'confirm',
      name: 'setThresholds',
      message: 'Set default mining thresholds? (optional)',
      default: false,
    },
  ]);

  const spinner = ora('Validating API key...').start();

  try {
    const api = new RefinoreAPI(answers.apiUrl, answers.apiKey);
    const accountInfo = await api.getAccountInfo();

    spinner.succeed('API key validated!');

    const walletAddress = accountInfo.wallet_address || accountInfo.walletAddress;

    if (walletAddress) {
      successMessage(`Connected to wallet: ${chalk.bold(walletAddress)}`);
    }

    let evMin: number | undefined;
    let motherlodeMin: number | undefined;
    let solDeployedMax: number | undefined;

    // Ask for thresholds if user wants them
    if (answers.setThresholds) {
      const thresholdAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'evMin',
          message: 'Minimum EV% to mine (leave blank for none):',
          default: '',
          validate: (input: string) => {
            if (input === '') return true;
            const num = parseFloat(input);
            if (isNaN(num)) return 'Must be a number or blank';
            return true;
          },
        },
        {
          type: 'input',
          name: 'motherlodeMin',
          message: 'Minimum motherlode ORE to mine (leave blank for none):',
          default: '',
          validate: (input: string) => {
            if (input === '') return true;
            const num = parseFloat(input);
            if (isNaN(num)) return 'Must be a number or blank';
            return true;
          },
        },
        {
          type: 'input',
          name: 'solDeployedMax',
          message: 'Maximum total SOL deployed (leave blank for none):',
          default: '',
          validate: (input: string) => {
            if (input === '') return true;
            const num = parseFloat(input);
            if (isNaN(num)) return 'Must be a number or blank';
            return true;
          },
        },
      ]);

      evMin = thresholdAnswers.evMin ? parseFloat(thresholdAnswers.evMin) : undefined;
      motherlodeMin = thresholdAnswers.motherlodeMin ? parseFloat(thresholdAnswers.motherlodeMin) : undefined;
      solDeployedMax = thresholdAnswers.solDeployedMax ? parseFloat(thresholdAnswers.solDeployedMax) : undefined;
    }

    saveConfig({
      apiKey: answers.apiKey,
      apiUrl: answers.apiUrl,
      walletAddress: walletAddress,
      evMin,
      motherlodeMin,
      solDeployedMax,
    });

    successMessage('Configuration saved to ~/.refinore/config.json');
    console.log();
    infoMessage('Next steps:');
    console.log(chalk.gray('  • Check your balance: ') + chalk.white('refinore balance'));
    console.log(chalk.gray('  • Start mining: ') + chalk.white('refinore mine'));
    console.log(chalk.gray('  • Check status: ') + chalk.white('refinore status'));
    console.log();

    if (walletAddress) {
      console.log(chalk.yellow('💰 Fund your wallet:'));
      console.log(chalk.gray('  Send SOL to: ') + chalk.white(walletAddress));
      console.log(chalk.gray('  Or use the refinORE app to buy with card/Apple Pay'));
      console.log();
    }
  } catch (error: any) {
    spinner.fail('Failed to validate API key');
    errorMessage(error.message);
    process.exit(1);
  }
}

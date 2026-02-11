import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { successMessage, errorMessage, header, infoMessage, warningMessage } from '../utils';

interface MineOptions {
  amount?: string;
  tiles?: string;
  token?: string;
  mode?: string;
  autoRestart?: boolean;
  evMin?: string;
  motherlodeMin?: string;
  solDeployedMax?: string;
}

export async function mineCommand(options: MineOptions): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  header('⛏️  Start Mining');

  const api = new RefinoreAPI(getApiUrl(config), apiKey);

  // Check for active session
  const spinner = ora('Checking for active session...').start();
  try {
    const session = await api.getMiningSession();
    if (session.hasActiveSession || session.session) {
      spinner.stop();
      warningMessage('You already have an active mining session!');
      console.log();
      console.log(chalk.gray('Stop it first with: ') + chalk.white('refinore stop'));
      console.log(chalk.gray('Or check status with: ') + chalk.white('refinore status'));
      console.log();
      process.exit(1);
    }
    spinner.stop();
  } catch (err) {
    spinner.stop();
    // Continue if session check fails (might mean no active session)
  }

  // Get wallet address
  let walletAddress = config?.walletAddress;
  if (!walletAddress) {
    const spinner2 = ora('Fetching wallet address...').start();
    try {
      const accountInfo = await api.getAccountInfo();
      walletAddress = accountInfo.wallet_address || accountInfo.walletAddress;
      spinner2.succeed();
    } catch (error: any) {
      spinner2.fail('Failed to get wallet address');
      errorMessage(error.message);
      process.exit(1);
    }
  }

  if (!walletAddress) {
    errorMessage('Could not determine wallet address');
    process.exit(1);
  }

  // Gather parameters (from options or prompt)
  let amount: number;
  let tiles: number;
  let token: string;
  let mode: string;
  let evMin: number | undefined;
  let motherlodeMin: number | undefined;
  let solDeployedMax: number | undefined;

  if (options.amount && options.tiles && options.token) {
    // Core options provided via CLI
    amount = parseFloat(options.amount);
    tiles = parseInt(options.tiles);
    token = options.token.toUpperCase();
    mode = options.mode || 'optimal';
    
    // Optional thresholds
    evMin = options.evMin ? parseFloat(options.evMin) : undefined;
    motherlodeMin = options.motherlodeMin ? parseFloat(options.motherlodeMin) : undefined;
    solDeployedMax = options.solDeployedMax ? parseFloat(options.solDeployedMax) : undefined;
  } else {
    // Interactive prompt
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'amount',
        message: 'Amount to deploy per round:',
        default: '0.01',
        validate: (input: string) => {
          const num = parseFloat(input);
          if (isNaN(num) || num <= 0) {
            return 'Amount must be a positive number';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'tiles',
        message: 'Number of tiles (1-25):',
        default: '15',
        validate: (input: string) => {
          const num = parseInt(input);
          if (isNaN(num) || num < 1 || num > 25) {
            return 'Tiles must be between 1 and 25';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'token',
        message: 'Mining token:',
        choices: ['SOL', 'USDC', 'ORE', 'stORE', 'SKR'],
        default: 'SOL',
      },
      {
        type: 'list',
        name: 'mode',
        message: 'Tile selection mode:',
        choices: ['optimal', 'random', 'custom'],
        default: 'optimal',
      },
      {
        type: 'confirm',
        name: 'useThresholds',
        message: 'Set advanced thresholds? (EV%, motherlode, SOL deployed)',
        default: false,
      },
    ]);

    amount = parseFloat(answers.amount);
    tiles = parseInt(answers.tiles);
    token = answers.token;
    mode = answers.mode;

    // Ask for thresholds if user wants them
    if (answers.useThresholds) {
      const thresholdAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'evMin',
          message: 'Minimum EV% to mine (leave blank for no minimum):',
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
          message: 'Minimum motherlode ORE to mine (leave blank for no minimum):',
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
          message: 'Maximum total SOL deployed (leave blank for no maximum):',
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
  }

  const startSpinner = ora('Starting mining session...').start();

  try {
    const result = await api.startMining({
      wallet_address: walletAddress,
      sol_amount: amount,
      num_squares: tiles,
      tile_selection_mode: mode,
      mining_token: token,
      auto_restart: options.autoRestart !== false,
      frequency: 'every_round',
      ev_threshold: evMin,
      motherlode_threshold: motherlodeMin,
      sol_deployed_max: solDeployedMax,
    });

    startSpinner.succeed('Mining session started!');
    console.log();
    successMessage('Configuration:');
    console.log(chalk.gray('  Amount: ') + chalk.white(`${amount} ${token}`));
    console.log(chalk.gray('  Tiles: ') + chalk.white(tiles));
    console.log(chalk.gray('  Strategy: ') + chalk.white(mode));
    console.log(chalk.gray('  Auto-restart: ') + chalk.white(options.autoRestart !== false ? 'Yes' : 'No'));
    
    if (evMin !== undefined) {
      console.log(chalk.gray('  Min EV: ') + chalk.white(`${evMin}%`));
    }
    if (motherlodeMin !== undefined) {
      console.log(chalk.gray('  Min Motherlode: ') + chalk.white(`${motherlodeMin} ORE`));
    }
    if (solDeployedMax !== undefined) {
      console.log(chalk.gray('  Max SOL Deployed: ') + chalk.white(`${solDeployedMax} SOL`));
    }
    
    console.log();
    infoMessage('Monitor progress with: ' + chalk.white('refinore status'));
    console.log();

  } catch (error: any) {
    startSpinner.fail('Failed to start mining');
    errorMessage(error.message);
    
    if (error.message.includes('insufficient')) {
      console.log();
      warningMessage('Your wallet may not have enough funds.');
      console.log(chalk.gray('Check balance: ') + chalk.white('refinore balance'));
    }
    
    process.exit(1);
  }
}

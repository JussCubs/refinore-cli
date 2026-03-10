import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { createTable, header, errorMessage, successMessage, infoMessage } from '../utils';

export async function strategyListCommand(): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  const spinner = ora('Fetching strategies...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const data = await api.listStrategies();

    spinner.succeed('Strategies loaded');

    const strategies = data.strategies || [];
    if (strategies.length === 0) {
      header('📋 Strategies');
      infoMessage('No strategies found');
      console.log();
      console.log(chalk.gray('Create one with: ') + chalk.white('refinore strategy create'));
      console.log();
      return;
    }

    header(`📋 Strategies (${strategies.length})`);

    const table = createTable(['Name', 'ID', 'SOL', 'Tiles', 'Mode', 'Token', 'Type']);

    for (const s of strategies) {
      table.push([
        chalk.white(s.name || 'Unnamed'),
        chalk.gray(s.id.substring(0, 8) + '...'),
        chalk.white(Number(s.sol_amount || 0).toFixed(4)),
        chalk.white(s.num_squares || '-'),
        chalk.gray(s.tile_selection_mode || 'optimal'),
        chalk.cyan(s.mining_token || 'SOL'),
        s.is_advanced ? chalk.yellow('advanced') : chalk.gray('simple'),
      ]);
    }

    console.log(table.toString());
    console.log();
    console.log(chalk.gray('  Start a strategy: ') + chalk.white('refinore strategy start <id>'));
    console.log(chalk.gray('  Live-edit:         ') + chalk.white('refinore strategy edit <id> --sol-amount 0.02'));
    console.log(chalk.gray('  Delete:            ') + chalk.white('refinore strategy delete <id>'));
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to fetch strategies');
    errorMessage(error.message);
    process.exit(1);
  }
}

export async function strategyStartCommand(strategyId: string): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  if (!strategyId) {
    errorMessage('Strategy ID is required. Run: refinore strategy list');
    process.exit(1);
  }

  const spinner = ora('Starting strategy...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const result = await api.startStrategy(strategyId);

    spinner.succeed('Strategy started');

    if (result.session) {
      console.log();
      console.log(chalk.gray('  Session ID: ') + chalk.white(result.session.id));
      console.log(chalk.gray('  Status: ') + chalk.green(result.session.status));
      console.log();
    }
  } catch (error: any) {
    spinner.fail('Failed to start strategy');
    errorMessage(error.message);
    process.exit(1);
  }
}

interface EditOptions {
  solAmount?: string;
  numSquares?: string;
  mode?: string;
  tiles?: string;
  skipLast?: boolean;
  token?: string;
  timing?: string;
  motherlodeMin?: string;
  solDeployedMax?: string;
}

export async function strategyEditCommand(strategyId: string, options: EditOptions): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  if (!strategyId) {
    errorMessage('Strategy ID is required. Run: refinore strategy list');
    process.exit(1);
  }

  const updates: Record<string, unknown> = {};

  if (options.solAmount) updates.sol_amount = parseFloat(options.solAmount);
  if (options.numSquares) updates.num_squares = parseInt(options.numSquares);
  if (options.mode) updates.tile_selection_mode = options.mode;
  if (options.tiles) updates.custom_tiles = options.tiles.split(',').map(t => parseInt(t.trim()));
  if (options.skipLast !== undefined) updates.skip_last_winning_square = options.skipLast;
  if (options.token) updates.mining_token = options.token;
  if (options.timing) updates.deployment_timing = parseInt(options.timing);
  if (options.motherlodeMin) updates.motherlode_threshold = parseFloat(options.motherlodeMin);
  if (options.solDeployedMax) updates.max_sol_deployed_threshold = parseFloat(options.solDeployedMax);

  if (Object.keys(updates).length === 0) {
    errorMessage('No fields to update. Use options like --sol-amount, --num-squares, --mode, etc.');
    process.exit(1);
  }

  const spinner = ora('Updating strategy...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const result = await api.liveEditStrategy(strategyId, updates);

    spinner.succeed('Strategy updated');

    console.log();
    if (result.changedFields) {
      console.log(chalk.gray('  Changed: ') + chalk.white(result.changedFields.join(', ')));
    }
    if (result.activeSession) {
      console.log(chalk.green('  Active session detected — changes apply next round'));
    } else {
      console.log(chalk.gray('  No active session — changes saved for next start'));
    }
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to update strategy');
    errorMessage(error.message);
    process.exit(1);
  }
}

export async function strategyDeleteCommand(strategyId: string): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  if (!strategyId) {
    errorMessage('Strategy ID is required. Run: refinore strategy list');
    process.exit(1);
  }

  const spinner = ora('Deleting strategy...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    await api.deleteStrategy(strategyId);

    spinner.succeed('Strategy deleted');
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to delete strategy');
    errorMessage(error.message);
    process.exit(1);
  }
}

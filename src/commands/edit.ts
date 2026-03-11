import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { errorMessage } from '../utils';

interface EditOptions {
  solAmount?: string;
  numSquares?: string;
  mode?: string;
  tiles?: string;
  skipLast?: boolean;
  token?: string;
  timing?: string;
  risk?: string;
  evThreshold?: string;
  motherlodeMin?: string;
  solDeployedMax?: string;
}

export async function editCommand(options: EditOptions): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  const updates: Record<string, unknown> = {};

  if (options.solAmount) updates.sol_amount = parseFloat(options.solAmount);
  if (options.numSquares) updates.num_squares = parseInt(options.numSquares);
  if (options.mode) updates.tile_selection_mode = options.mode;
  if (options.tiles) updates.custom_tiles = options.tiles.split(',').map(t => parseInt(t.trim()));
  if (options.skipLast !== undefined) updates.skip_last_winning_square = options.skipLast;
  if (options.token) updates.mining_token = options.token;
  if (options.timing) updates.deployment_timing_seconds = parseInt(options.timing);
  if (options.risk) updates.risk_tolerance = options.risk;
  if (options.evThreshold) updates.custom_ev_threshold = parseFloat(options.evThreshold);
  if (options.motherlodeMin) updates.motherlode_threshold = parseFloat(options.motherlodeMin);
  if (options.solDeployedMax) updates.max_sol_deployed_threshold = parseFloat(options.solDeployedMax);

  if (Object.keys(updates).length === 0) {
    errorMessage('No fields to update. Use options like --sol-amount, --num-squares, --mode, etc.');
    process.exit(1);
  }

  const spinner = ora('Updating session...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const result = await api.editSession(updates);

    spinner.succeed('Session updated');
    console.log();
    if (result.changedFields) {
      console.log(chalk.gray('  Changed: ') + chalk.white(result.changedFields.join(', ')));
    }
    console.log(chalk.green('  Changes will take effect on the next deployment round.'));
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to update session');
    errorMessage(error.message);
    process.exit(1);
  }
}

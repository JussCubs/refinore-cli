import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { createTable, header, errorMessage, infoMessage } from '../utils';

interface RoundsOptions {
  limit?: string;
  offset?: string;
  session?: string;
}

export async function roundsCommand(options: RoundsOptions): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  const limit = options.limit ? parseInt(options.limit) : 50;
  const offset = options.offset ? parseInt(options.offset) : 0;

  const spinner = ora('Fetching round history...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const data = await api.getRoundHistory(limit, offset, options.session);

    spinner.succeed('Round history loaded');

    if (!data || !data.rounds || data.rounds.length === 0) {
      header('📋 Round History');
      infoMessage('No round history found');
      console.log();
      console.log(chalk.gray('Start mining with: ') + chalk.white('refinore mine'));
      console.log();
      return;
    }

    header(`📋 Round History (${data.rounds.length} of ${data.total})`);

    const table = createTable(['Round', 'Result', 'Tiles', 'Mode', 'Deployed', 'Won', 'ORE', 'EV%']);

    let totalDeployed = 0;
    let totalSolWon = 0;
    let totalOreWon = 0;
    let wins = 0;

    for (const round of data.rounds) {
      if (round.skipped) continue;

      const roundNum = round.round_number || '-';
      const result = round.user_won ? chalk.green('WIN') : chalk.red('LOSS');
      const tiles = round.num_squares || '-';
      const mode = round.used_tile_selection_mode || '-';
      const deployed = round.sol_amount || 0;
      const solWon = round.sol_won || 0;
      const oreWon = round.ore_won || 0;
      const ev = round.ev_percent != null ? `${round.ev_percent > 0 ? '+' : ''}${Number(round.ev_percent).toFixed(1)}%` : '-';

      totalDeployed += deployed;
      totalSolWon += solWon;
      totalOreWon += oreWon;
      if (round.user_won) wins++;

      table.push([
        chalk.gray(roundNum.toString()),
        result,
        chalk.white(tiles.toString()),
        chalk.gray(mode),
        chalk.white(Number(deployed).toFixed(4)),
        solWon > 0 ? chalk.green(Number(solWon).toFixed(4)) : chalk.gray('0.0000'),
        oreWon > 0 ? chalk.yellow(Number(oreWon).toFixed(4)) : chalk.gray('0.0000'),
        ev === '-' ? chalk.gray(ev) : (round.ev_percent >= 0 ? chalk.green(ev) : chalk.red(ev)),
      ]);
    }

    console.log(table.toString());
    console.log();

    const deployedRounds = data.rounds.filter((r: any) => !r.skipped).length;
    const winRate = deployedRounds > 0 ? (wins / deployedRounds * 100).toFixed(1) : '0.0';
    const netPnl = totalSolWon - totalDeployed;
    const netColor = netPnl >= 0 ? chalk.green : chalk.red;
    const netSign = netPnl >= 0 ? '+' : '';

    console.log(chalk.bold('Summary:'));
    console.log(chalk.gray('  Rounds: ') + chalk.white(deployedRounds));
    console.log(chalk.gray('  Win Rate: ') + chalk.cyan(`${winRate}%`));
    console.log(chalk.gray('  Total Deployed: ') + chalk.white(`${totalDeployed.toFixed(4)} SOL`));
    console.log(chalk.gray('  Total SOL Won: ') + chalk.green(`${totalSolWon.toFixed(4)} SOL`));
    console.log(chalk.gray('  Total ORE Won: ') + chalk.yellow(`${totalOreWon.toFixed(4)} ORE`));
    console.log(chalk.gray('  Net P&L: ') + netColor.bold(`${netSign}${netPnl.toFixed(4)} SOL`));

    if (data.total > offset + limit) {
      console.log();
      console.log(chalk.gray(`  Showing ${offset + 1}-${offset + data.rounds.length} of ${data.total}. Use --offset ${offset + limit} for next page.`));
    }
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to fetch round history');
    errorMessage(error.message);
    process.exit(1);
  }
}

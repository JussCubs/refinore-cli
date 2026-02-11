import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { createTable, header, errorMessage, infoMessage } from '../utils';

interface HistoryOptions {
  limit?: string;
}

export async function historyCommand(options: HistoryOptions): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  const limit = options.limit ? parseInt(options.limit) : 20;

  const spinner = ora('Fetching mining history...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const history = await api.getMiningHistory(limit);

    spinner.succeed('History loaded');

    if (!history || !history.rounds || history.rounds.length === 0) {
      header('📊 Mining History');
      infoMessage('No mining history found');
      console.log();
      console.log(chalk.gray('Start mining with: ') + chalk.white('refinore mine'));
      console.log();
      return;
    }

    header('📊 Mining History');

    const table = createTable(['Round', 'Result', 'Deployed', 'Won', 'ORE', 'P&L']);

    let totalDeployed = 0;
    let totalWon = 0;
    let totalOre = 0;

    history.rounds.forEach((round: any) => {
      const roundNum = round.round_number || round.roundNumber || '-';
      const result = round.won ? chalk.green('WIN') : chalk.red('LOSS');
      const deployed = round.sol_deployed || round.solDeployed || 0;
      const won = round.sol_won || round.solWon || 0;
      const ore = round.ore_earned || round.oreEarned || 0;
      const pnl = won - deployed;

      totalDeployed += deployed;
      totalWon += won;
      totalOre += ore;

      const pnlColor = pnl >= 0 ? chalk.green : chalk.red;
      const pnlSign = pnl >= 0 ? '+' : '';

      table.push([
        chalk.gray(roundNum.toString()),
        result,
        chalk.white(deployed.toFixed(4)),
        won > 0 ? chalk.green(won.toFixed(4)) : chalk.gray('0.0000'),
        ore > 0 ? chalk.yellow(ore.toFixed(4)) : chalk.gray('0.0000'),
        pnlColor(`${pnlSign}${pnl.toFixed(4)}`),
      ]);
    });

    console.log(table.toString());
    console.log();

    // Summary
    const netPnl = totalWon - totalDeployed;
    const winRate = history.rounds.length > 0
      ? (history.rounds.filter((r: any) => r.won).length / history.rounds.length * 100).toFixed(1)
      : '0.0';

    console.log(chalk.bold('Summary:'));
    console.log(chalk.gray('  Rounds: ') + chalk.white(history.rounds.length));
    console.log(chalk.gray('  Win Rate: ') + chalk.cyan(`${winRate}%`));
    console.log(chalk.gray('  Total Deployed: ') + chalk.white(`${totalDeployed.toFixed(4)} SOL`));
    console.log(chalk.gray('  Total Won: ') + chalk.green(`${totalWon.toFixed(4)} SOL`));
    console.log(chalk.gray('  Total ORE: ') + chalk.yellow(`${totalOre.toFixed(4)} ORE`));
    
    const netColor = netPnl >= 0 ? chalk.green : chalk.red;
    const netSign = netPnl >= 0 ? '+' : '';
    console.log(chalk.gray('  Net P&L: ') + netColor.bold(`${netSign}${netPnl.toFixed(4)} SOL`));
    console.log();

  } catch (error: any) {
    spinner.fail('Failed to fetch history');
    errorMessage(error.message);
    process.exit(1);
  }
}

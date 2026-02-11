import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { createTable, header, errorMessage, infoMessage, section } from '../utils';

export async function statusCommand(): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  const spinner = ora('Fetching mining status...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const session = await api.getMiningSession();

    spinner.succeed('Status loaded');

    if (!session.hasActiveSession && !session.session) {
      header('⛏️  Mining Status');
      infoMessage('No active mining session');
      console.log();
      console.log(chalk.gray('Start mining with: ') + chalk.white('refinore mine'));
      console.log();
      return;
    }

    const sessionData = session.session || session;

    header('⛏️  Active Mining Session');

    // Session info
    const infoTable = createTable(['Property', 'Value']);
    
    if (sessionData.id) {
      infoTable.push(['Session ID', chalk.gray(sessionData.id)]);
    }
    
    if (sessionData.sol_amount || sessionData.solAmount) {
      const amount = sessionData.sol_amount || sessionData.solAmount;
      const token = sessionData.mining_token || sessionData.miningToken || 'SOL';
      infoTable.push(['Amount/Round', chalk.green(`${amount} ${token}`)]);
    }
    
    if (sessionData.num_squares || sessionData.numSquares) {
      const tiles = sessionData.num_squares || sessionData.numSquares;
      infoTable.push(['Tiles', chalk.cyan(tiles.toString())]);
    }
    
    if (sessionData.tile_selection_mode || sessionData.tileSelectionMode) {
      const mode = sessionData.tile_selection_mode || sessionData.tileSelectionMode;
      infoTable.push(['Strategy', chalk.white(mode)]);
    }
    
    if (sessionData.risk_tolerance || sessionData.riskTolerance) {
      const risk = sessionData.risk_tolerance || sessionData.riskTolerance;
      infoTable.push(['Risk', chalk.white(risk)]);
    }

    // Stats
    if (sessionData.rounds_played !== undefined) {
      infoTable.push(['Rounds Played', chalk.white(sessionData.rounds_played.toString())]);
    }
    
    if (sessionData.rounds_won !== undefined) {
      const winRate = sessionData.rounds_played > 0 
        ? ((sessionData.rounds_won / sessionData.rounds_played) * 100).toFixed(1)
        : '0.0';
      infoTable.push([
        'Rounds Won',
        chalk.green(`${sessionData.rounds_won} (${winRate}%)`)
      ]);
    }
    
    if (sessionData.total_ore_earned !== undefined) {
      infoTable.push([
        'ORE Earned',
        chalk.yellow(`${sessionData.total_ore_earned.toFixed(4)} ORE`)
      ]);
    }

    console.log(infoTable.toString());
    console.log();

    // Current round info
    try {
      const round = await api.getCurrentRound();
      
      section('🎲 Current Round');
      
      const roundTable = createTable(['Property', 'Value']);
      
      if (round.round_number) {
        roundTable.push(['Round #', chalk.bold(round.round_number.toString())]);
      }
      
      if (round.time_remaining) {
        roundTable.push(['Time Left', chalk.cyan(`${round.time_remaining}s`)]);
      }
      
      if (round.total_deployed !== undefined) {
        roundTable.push(['Total Deployed', chalk.green(`${round.total_deployed.toFixed(4)} SOL`)]);
      }
      
      if (round.motherlode !== undefined) {
        const mlColor = round.motherlode > 100 ? chalk.red.bold : chalk.yellow;
        roundTable.push(['Motherlode', mlColor(`${round.motherlode.toFixed(2)} ORE`)]);
      }
      
      if (round.expected_value !== undefined) {
        const ev = round.expected_value;
        const evColor = ev > 0 ? chalk.green : ev < -5 ? chalk.red : chalk.yellow;
        const evStr = `${ev >= 0 ? '+' : ''}${ev.toFixed(2)}%`;
        roundTable.push(['Expected Value', evColor(evStr)]);
      }
      
      if (round.total_miners !== undefined) {
        roundTable.push(['Active Miners', chalk.white(round.total_miners.toString())]);
      }

      console.log(roundTable.toString());
      console.log();

    } catch (err) {
      // Round info not available, skip
    }

    infoMessage('Commands:');
    console.log(chalk.gray('  • Stop mining: ') + chalk.white('refinore stop'));
    console.log(chalk.gray('  • View history: ') + chalk.white('refinore history'));
    console.log();

  } catch (error: any) {
    spinner.fail('Failed to fetch status');
    errorMessage(error.message);
    process.exit(1);
  }
}

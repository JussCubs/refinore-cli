import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { successMessage, errorMessage, header, infoMessage } from '../utils';

export async function stopCommand(): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  header('⛏️  Stop Mining');

  const api = new RefinoreAPI(getApiUrl(config), apiKey);

  // Check if there's an active session
  const checkSpinner = ora('Checking for active session...').start();
  
  try {
    const session = await api.getMiningSession();
    
    if (!session.hasActiveSession && !session.session) {
      checkSpinner.info('No active mining session');
      console.log();
      infoMessage('Nothing to stop. Start mining with: ' + chalk.white('refinore mine'));
      console.log();
      return;
    }
    
    checkSpinner.succeed('Active session found');

    const sessionData = session.session || session;
    
    // Show session info before stopping
    if (sessionData.rounds_played !== undefined) {
      console.log(chalk.gray('  Rounds played: ') + chalk.white(sessionData.rounds_played));
    }
    if (sessionData.rounds_won !== undefined) {
      console.log(chalk.gray('  Rounds won: ') + chalk.white(sessionData.rounds_won));
    }
    if (sessionData.total_ore_earned !== undefined) {
      console.log(chalk.gray('  ORE earned: ') + chalk.yellow(`${sessionData.total_ore_earned.toFixed(4)} ORE`));
    }
    console.log();

    const stopSpinner = ora('Stopping mining session...').start();

    const result = await api.stopMining(sessionData.id);

    stopSpinner.succeed('Mining session stopped');
    console.log();
    successMessage('Session ended successfully');
    
    // Show final stats if available
    if (result.final_stats || result.stats) {
      const stats = result.final_stats || result.stats;
      console.log();
      console.log(chalk.bold('Final Stats:'));
      if (stats.total_ore_earned !== undefined) {
        console.log(chalk.gray('  Total ORE: ') + chalk.yellow(`${stats.total_ore_earned.toFixed(4)} ORE`));
      }
      if (stats.net_sol_pnl !== undefined) {
        const pnlColor = stats.net_sol_pnl >= 0 ? chalk.green : chalk.red;
        const pnlSign = stats.net_sol_pnl >= 0 ? '+' : '';
        console.log(chalk.gray('  Net SOL P&L: ') + pnlColor(`${pnlSign}${stats.net_sol_pnl.toFixed(4)} SOL`));
      }
    }

    console.log();
    infoMessage('Start mining again with: ' + chalk.white('refinore mine'));
    console.log();

  } catch (error: any) {
    checkSpinner.stop();
    errorMessage(error.message);
    process.exit(1);
  }
}

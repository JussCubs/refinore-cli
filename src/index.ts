#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { mineCommand } from './commands/mine';
import { statusCommand } from './commands/status';
import { balanceCommand } from './commands/balance';
import { stopCommand } from './commands/stop';
import { historyCommand } from './commands/history';
import { depositCommand } from './commands/deposit';
import { whoamiCommand } from './commands/whoami';
import { tilesCommand } from './commands/tiles';
import { roundsCommand } from './commands/rounds';
import { strategyListCommand, strategyStartCommand, strategyCreateCommand, strategyValidateScriptCommand, strategyEditCommand, strategyDeleteCommand } from './commands/strategy';
import { swapListCommand, swapCreateCommand, swapDeleteCommand, swapHistoryCommand } from './commands/swap';
import { editCommand } from './commands/edit';

const program = new Command();

program
  .name('refinore')
  .description('CLI tool for ORE mining on Solana via refinORE')
  .version('1.3.0');

// Init command
program
  .command('init')
  .description('Set up refinORE CLI with your API key')
  .action(async () => {
    try {
      await initCommand();
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Mine command
program
  .command('mine')
  .description('Start a new mining session')
  .option('-a, --amount <amount>', 'Amount to deploy per round')
  .option('-t, --tiles <tiles>', 'Number of tiles (1-25)')
  .option('--token <token>', 'Mining token (SOL, USDC, ORE, stORE, SKR)')
  .option('-m, --mode <mode>', 'Tile selection mode (optimal, random, custom, odd, even, hot, cold)')
  .option('--ev-min <number>', 'Minimum EV% to mine (e.g., 5 = only mine if EV > 5%)')
  .option('--motherlode-min <number>', 'Minimum motherlode ORE to mine')
  .option('--sol-deployed-max <number>', 'Maximum total SOL deployed to mine')
  .option('--no-auto-restart', 'Disable auto-restart')
  .action(async (options) => {
    try {
      await mineCommand(options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Show current mining session status')
  .action(async () => {
    try {
      await statusCommand();
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Balance command
program
  .command('balance')
  .description('Show wallet token balances')
  .action(async () => {
    try {
      await balanceCommand();
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Stop command
program
  .command('stop')
  .description('Stop the active mining session')
  .action(async () => {
    try {
      await stopCommand();
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// History command
program
  .command('history')
  .description('Show mining history')
  .option('-l, --limit <limit>', 'Number of rounds to show', '20')
  .action(async (options) => {
    try {
      await historyCommand(options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Tiles command (hot/cold tile stats)
program
  .command('tiles')
  .description('Show hot/cold tile statistics')
  .option('-l, --limit <limit>', 'Number of rounds to analyze (10-500)', '100')
  .action(async (options) => {
    try {
      await tilesCommand(options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Rounds command (personal round history)
program
  .command('rounds')
  .description('Show your personal round-by-round deployment history')
  .option('-l, --limit <limit>', 'Number of rounds to show', '50')
  .option('--offset <offset>', 'Pagination offset', '0')
  .option('-s, --session <session_id>', 'Filter to a specific session')
  .action(async (options) => {
    try {
      await roundsCommand(options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Strategy command group
const strategy = program
  .command('strategy')
  .description('Manage mining strategies');

strategy
  .command('list')
  .description('List all saved strategies')
  .action(async () => {
    try {
      await strategyListCommand();
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

strategy
  .command('create')
  .description('Create a simple or script-backed strategy')
  .requiredOption('--name <name>', 'Strategy name')
  .option('--sol-amount <amount>', 'Default total amount per round')
  .option('--num-squares <n>', 'Default number of tiles')
  .option('--mode <mode>', 'Tile selection mode (optimal, random, custom, odd, even, hot, cold)')
  .option('--tiles <tiles>', 'Custom tile indices 0-24, comma-separated (0=tile 1 in UI, 24=tile 25)')
  .option('--skip-last', 'Skip the tile that won last round')
  .option('--token <token>', 'Mining token (SOL, USDC, ORE, stORE, SKR)')
  .option('--timing <seconds>', 'Deployment timing in seconds')
  .option('--risk <risk>', 'Risk tolerance (degen, risky, less-risky, positive-ev)')
  .option('--ev-threshold <number>', 'Custom EV threshold')
  .option('--motherlode-min <ore>', 'Minimum motherlode ORE to deploy')
  .option('--sol-deployed-max <sol>', 'Max total SOL deployed before skipping')
  .option('--script-file <path>', 'Path to a custom strategy script JSON file')
  .option('--enable-script', 'Enable the script immediately when saving')
  .action(async (options) => {
    try {
      await strategyCreateCommand(options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

strategy
  .command('validate-script <file>')
  .description('Validate a custom strategy script JSON file')
  .action(async (file) => {
    try {
      await strategyValidateScriptCommand(file);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

strategy
  .command('start <id>')
  .description('Start mining with a saved strategy')
  .action(async (id) => {
    try {
      await strategyStartCommand(id);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

strategy
  .command('edit <id>')
  .description('Live-edit a strategy (changes apply next round, no restart needed)')
  .option('--sol-amount <amount>', 'New SOL amount per round')
  .option('--num-squares <n>', 'New number of tiles')
  .option('--mode <mode>', 'Tile selection mode (optimal, random, custom, odd, even, hot, cold)')
  .option('--tiles <tiles>', 'Custom tile indices 0-24, comma-separated (0=tile 1 in UI, 24=tile 25)')
  .option('--skip-last', 'Skip the tile that won last round')
  .option('--token <token>', 'Mining token (SOL, USDC, ORE, stORE, SKR)')
  .option('--timing <seconds>', 'Deployment timing in seconds')
  .option('--motherlode-min <ore>', 'Minimum motherlode ORE to deploy')
  .option('--sol-deployed-max <sol>', 'Max total SOL deployed before skipping')
  .option('--script-file <path>', 'Path to a custom strategy script JSON file')
  .option('--enable-script', 'Enable custom strategy script execution')
  .option('--disable-script', 'Disable custom strategy script execution')
  .action(async (id, options) => {
    try {
      await strategyEditCommand(id, options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

strategy
  .command('delete <id>')
  .description('Delete a saved strategy')
  .action(async (id) => {
    try {
      await strategyDeleteCommand(id);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Swap command group
const swap = program
  .command('swap')
  .description('Manage DCA and limit swap orders');

swap
  .command('list')
  .description('List all swap orders')
  .action(async () => {
    try {
      await swapListCommand();
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

swap
  .command('create')
  .description('Create a DCA or limit swap order')
  .requiredOption('--name <name>', 'Order name')
  .requiredOption('--type <type>', 'Order type (dca, limit)')
  .requiredOption('--swap-type <swapType>', 'Swap direction (buy, sell)')
  .requiredOption('--trigger-field <field>', 'Trigger field (ore_price, time)')
  .requiredOption('--trigger-operator <op>', 'Trigger operator (gt, gte, lt, lte, eq)')
  .requiredOption('--ore-amount <amount>', 'ORE amount per execution')
  .option('--trigger-value <value>', 'Trigger value')
  .option('--timing <seconds>', 'Execution timing in seconds (0-60)', '30')
  .option('--repeat', 'Enable recurring execution')
  .option('--interval <rounds>', 'Rounds between executions', '1')
  .option('--max-executions <n>', 'Maximum total executions')
  .action(async (options) => {
    try {
      await swapCreateCommand(options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

swap
  .command('delete <id>')
  .description('Delete a swap order')
  .action(async (id) => {
    try {
      await swapDeleteCommand(id);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

swap
  .command('history')
  .description('Show swap operation history')
  .option('-l, --limit <limit>', 'Number of operations to show', '10')
  .option('--offset <offset>', 'Pagination offset', '0')
  .action(async (options) => {
    try {
      await swapHistoryCommand(options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Edit command (live-edit active session)
program
  .command('edit')
  .description('Live-edit the active mining session (changes apply next round)')
  .option('--sol-amount <amount>', 'New SOL amount per round')
  .option('--num-squares <n>', 'New number of tiles')
  .option('-m, --mode <mode>', 'Tile selection mode (optimal, random, custom, odd, even, hot, cold)')
  .option('--tiles <tiles>', 'Custom tile indices 0-24, comma-separated (0=tile 1 in UI, 24=tile 25)')
  .option('--skip-last', 'Skip the tile that won last round')
  .option('--token <token>', 'Mining token (SOL, USDC, ORE, stORE, SKR)')
  .option('--timing <seconds>', 'Deployment timing in seconds')
  .option('--risk <risk>', 'Risk tolerance (degen, risky, less-risky, positive-ev)')
  .option('--ev-threshold <number>', 'Custom EV threshold percentage')
  .option('--motherlode-min <ore>', 'Minimum motherlode ORE to deploy')
  .option('--sol-deployed-max <sol>', 'Max total SOL deployed before skipping')
  .action(async (options) => {
    try {
      await editCommand(options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Deposit command
program
  .command('deposit')
  .description('Show deposit instructions')
  .action(async () => {
    try {
      await depositCommand();
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Whoami command
program
  .command('whoami')
  .description('Show account information')
  .action(async () => {
    try {
      await whoamiCommand();
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Auto-mine shortcut (for npx -y refinore-cli --auto-mine)
program
  .option('--auto-mine', 'Quick start: init and start mining with defaults')
  .action(async (options) => {
    if (options.autoMine) {
      console.log(chalk.cyan.bold('⛏️  refinORE Quick Start'));
      console.log();

      const { loadConfig } = await import('./config');
      const config = loadConfig();

      if (!config || !config.apiKey) {
        console.log(chalk.yellow('First time setup required!'));
        console.log();
        await initCommand();
        console.log();
      }

      console.log(chalk.cyan('Starting mining with default settings...'));
      console.log();

      await mineCommand({
        amount: '0.01',
        tiles: '15',
        token: 'SOL',
        mode: 'optimal',
        autoRestart: true,
      });
    }
  });

program.parse();

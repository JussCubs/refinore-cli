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

const program = new Command();

program
  .name('refinore')
  .description('CLI tool for ORE mining on Solana via refinORE')
  .version('1.1.0');

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
  .option('-m, --mode <mode>', 'Tile selection mode (optimal, random, custom)')
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

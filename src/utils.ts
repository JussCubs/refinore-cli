import chalk from 'chalk';
import Table from 'cli-table3';

export function formatBalance(value: number): string {
  return value.toFixed(6);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatSOL(value: number): string {
  return `${value.toFixed(4)} SOL`;
}

export function formatORE(value: number): string {
  return `${value.toFixed(4)} ORE`;
}

export function createTable(head: string[]): Table.Table {
  return new Table({
    head: head.map(h => chalk.cyan.bold(h)),
    style: {
      head: [],
      border: ['gray'],
    },
  });
}

export function successMessage(msg: string): void {
  console.log(chalk.green('✓') + ' ' + msg);
}

export function errorMessage(msg: string): void {
  console.log(chalk.red('✗') + ' ' + msg);
}

export function infoMessage(msg: string): void {
  console.log(chalk.blue('ℹ') + ' ' + msg);
}

export function warningMessage(msg: string): void {
  console.log(chalk.yellow('⚠') + ' ' + msg);
}

export function header(msg: string): void {
  console.log();
  console.log(chalk.bold.cyan('━'.repeat(60)));
  console.log(chalk.bold.cyan(msg));
  console.log(chalk.bold.cyan('━'.repeat(60)));
  console.log();
}

export function section(msg: string): void {
  console.log();
  console.log(chalk.bold.white(msg));
  console.log(chalk.gray('─'.repeat(60)));
}

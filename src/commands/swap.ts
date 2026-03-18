import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { createTable, header, errorMessage, successMessage, infoMessage } from '../utils';

interface DirectSwapOptions {
  from: string;
  to: string;
  amount: string;
  slippage?: string;
}

export async function swapQuoteCommand(options: DirectSwapOptions): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  if (!options.from || !options.to || !options.amount) {
    errorMessage('Missing required options. Use --from, --to, and --amount');
    process.exit(1);
  }

  const spinner = ora('Fetching direct swap quote...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const result = await api.quoteSwap({
      input_token: options.from,
      output_token: options.to,
      amount: parseFloat(options.amount),
      max_slippage_bps: options.slippage ? parseInt(options.slippage, 10) : 300,
    });

    spinner.succeed('Swap quote loaded');

    const quote = result.quote;
    header(`🔁 Quote: ${quote.input_token} → ${quote.output_token}`);
    console.log();
    console.log(chalk.gray('  Input:        ') + chalk.white(`${quote.input_amount} ${quote.input_token}`));
    console.log(chalk.gray('  Expected Out: ') + chalk.white(`${quote.expected_output_amount} ${quote.output_token}`));
    console.log(chalk.gray('  Price Impact: ') + chalk.white(`${Number(quote.price_impact_pct || 0).toFixed(4)}%`));
    console.log(chalk.gray('  Slippage:     ') + chalk.white(`${quote.max_slippage_bps} bps`));
    console.log(chalk.gray('  Wallet:       ') + chalk.white(quote.wallet_address));
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to fetch swap quote');
    errorMessage(error.message);
    process.exit(1);
  }
}

export async function swapExecuteCommand(options: DirectSwapOptions): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  if (!options.from || !options.to || !options.amount) {
    errorMessage('Missing required options. Use --from, --to, and --amount');
    process.exit(1);
  }

  const spinner = ora(`Swapping ${options.amount} ${options.from} → ${options.to}...`).start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const result = await api.executeSwap({
      input_token: options.from,
      output_token: options.to,
      amount: parseFloat(options.amount),
      max_slippage_bps: options.slippage ? parseInt(options.slippage, 10) : 300,
    });

    spinner.succeed('Swap executed');

    const swap = result.swap;
    console.log();
    console.log(chalk.gray('  Input:        ') + chalk.white(`${swap.input_amount} ${swap.input_token}`));
    console.log(chalk.gray('  Quoted Out:   ') + chalk.white(`${swap.quoted_output_amount} ${swap.output_token}`));
    console.log(chalk.gray('  Actual Out:   ') + chalk.white(`${swap.actual_output_amount} ${swap.output_token}`));
    console.log(chalk.gray('  Price Impact: ') + chalk.white(`${Number(swap.price_impact_pct || 0).toFixed(4)}%`));
    console.log(chalk.gray('  Signature:    ') + chalk.white(swap.signature || 'n/a'));
    if (swap.solscan_url) {
      console.log(chalk.gray('  Solscan:      ') + chalk.cyan(swap.solscan_url));
    }
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to execute swap');
    errorMessage(error.message);
    process.exit(1);
  }
}

export async function swapListCommand(): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  const spinner = ora('Fetching swap orders...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const data = await api.listSwapOrders();

    spinner.succeed('Swap orders loaded');

    const orders = data.orders || [];
    if (orders.length === 0) {
      header('📋 Swap Orders');
      infoMessage('No swap orders found');
      console.log();
      console.log(chalk.gray('Create one with: ') + chalk.white('refinore swap create'));
      console.log();
      return;
    }

    header(`📋 Swap Orders (${orders.length})`);

    const table = createTable(['Name', 'ID', 'Type', 'Swap', 'ORE Amt', 'Trigger', 'Repeat', 'Active']);

    for (const o of orders) {
      table.push([
        chalk.white(o.name || 'Unnamed'),
        chalk.gray((o.id || '').substring(0, 8) + '...'),
        chalk.cyan(o.order_type || '-'),
        o.swap_type === 'buy' ? chalk.green('BUY') : chalk.red('SELL'),
        chalk.white(Number(o.ore_amount || 0).toFixed(2)),
        chalk.gray(`${o.trigger_field} ${o.trigger_operator} ${o.trigger_value}`),
        o.repeat_enabled ? chalk.cyan(`every ${o.repeat_interval_rounds}r`) : chalk.gray('once'),
        o.is_active ? chalk.green('yes') : chalk.red('no'),
      ]);
    }

    console.log(table.toString());
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to fetch swap orders');
    errorMessage(error.message);
    process.exit(1);
  }
}

interface SwapCreateOptions {
  name: string;
  type: string;
  swapType: string;
  triggerField: string;
  triggerOperator: string;
  triggerValue?: string;
  oreAmount: string;
  timing?: string;
  repeat?: boolean;
  interval?: string;
  maxExecutions?: string;
}

export async function swapCreateCommand(options: SwapCreateOptions): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  if (!options.name || !options.type || !options.swapType || !options.triggerField || !options.triggerOperator || !options.oreAmount) {
    errorMessage('Missing required options. Use --name, --type, --swap-type, --trigger-field, --trigger-operator, --ore-amount');
    process.exit(1);
  }

  const spinner = ora('Creating swap order...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const result = await api.createSwapOrder({
      name: options.name,
      order_type: options.type,
      swap_type: options.swapType,
      trigger_field: options.triggerField,
      trigger_operator: options.triggerOperator,
      trigger_value: options.triggerValue ? parseFloat(options.triggerValue) : 0,
      ore_amount: parseFloat(options.oreAmount),
      execution_timing: options.timing ? parseInt(options.timing) : 30,
      repeat_enabled: options.repeat || false,
      repeat_interval_rounds: options.interval ? parseInt(options.interval) : 1,
      max_executions: options.maxExecutions ? parseInt(options.maxExecutions) : null,
    });

    spinner.succeed('Swap order created');

    console.log();
    if (result.order) {
      console.log(chalk.gray('  Order ID: ') + chalk.white(result.order.id));
      console.log(chalk.gray('  Name: ') + chalk.white(result.order.name));
      console.log(chalk.gray('  Type: ') + chalk.cyan(result.order.order_type));
    }
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to create swap order');
    errorMessage(error.message);
    process.exit(1);
  }
}

export async function swapDeleteCommand(orderId: string): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  if (!orderId) {
    errorMessage('Order ID is required. Run: refinore swap list');
    process.exit(1);
  }

  const spinner = ora('Deleting swap order...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    await api.deleteSwapOrder(orderId);

    spinner.succeed('Swap order deleted');
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to delete swap order');
    errorMessage(error.message);
    process.exit(1);
  }
}

interface SwapHistoryOptions {
  limit?: string;
  offset?: string;
}

export async function swapHistoryCommand(options: SwapHistoryOptions): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  const limit = options.limit ? parseInt(options.limit) : 10;
  const offset = options.offset ? parseInt(options.offset) : 0;

  const spinner = ora('Fetching swap history...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const data = await api.getSwapHistory(limit, offset);

    spinner.succeed('Swap history loaded');

    const ops = data.operations || [];
    if (ops.length === 0) {
      header('📋 Swap History');
      infoMessage('No swap operations found');
      console.log();
      return;
    }

    header(`📋 Swap History (${ops.length} of ${data.total})`);

    const table = createTable(['Round', 'Source', 'Status', 'Swap', 'Tx']);

    for (const op of ops) {
      table.push([
        chalk.gray(op.round_number || '-'),
        chalk.cyan(op.matched_rule_name || 'Direct swap'),
        op.swap_executed ? chalk.green('OK') : chalk.red('FAIL'),
        chalk.white(op.swap_summary || op.skip_reason || '-'),
        chalk.gray(op.signature ? `${String(op.signature).slice(0, 8)}...` : '-'),
      ]);
    }

    console.log(table.toString());
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to fetch swap history');
    errorMessage(error.message);
    process.exit(1);
  }
}

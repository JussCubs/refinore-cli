import ora from 'ora';
import chalk from 'chalk';
import { loadConfig, getApiUrl, getApiKey } from '../config';
import { RefinoreAPI } from '../api';
import { createTable, header, errorMessage } from '../utils';

interface TilesOptions {
  limit?: string;
}

export async function tilesCommand(options: TilesOptions): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);

  if (!apiKey) {
    errorMessage('Not configured. Run: refinore init');
    process.exit(1);
  }

  const limit = options.limit ? parseInt(options.limit) : 100;
  const spinner = ora('Fetching tile statistics...').start();

  try {
    const api = new RefinoreAPI(getApiUrl(config), apiKey);
    const stats = await api.getTileStats(limit);

    spinner.succeed('Tile stats loaded');

    header(`🔥 Tile Statistics (last ${stats.roundsAnalyzed} rounds)`);

    // Hot tiles
    console.log(chalk.bold.red('  HOT tiles (most wins):'));
    if (stats.hotTiles && stats.hotTiles.length > 0) {
      for (const tile of stats.hotTiles) {
        const bar = '█'.repeat(Math.min(tile.wins, 30));
        console.log(chalk.red(`    Tile ${String(tile.tile).padStart(2)} │ ${String(tile.wins).padStart(3)} wins │ ${bar}`));
      }
    }

    console.log();

    // Cold tiles
    console.log(chalk.bold.blue('  COLD tiles (fewest wins):'));
    if (stats.coldTiles && stats.coldTiles.length > 0) {
      for (const tile of stats.coldTiles) {
        const bar = '█'.repeat(Math.min(tile.wins, 30));
        console.log(chalk.blue(`    Tile ${String(tile.tile).padStart(2)} │ ${String(tile.wins).padStart(3)} wins │ ${bar}`));
      }
    }

    console.log();

    // Full grid
    console.log(chalk.bold('  Full Grid (5×5):'));
    const tileStats = stats.tileStats || [];
    const avg = stats.avgWinsPerTile || 0;

    for (let row = 0; row < 5; row++) {
      let line = '    ';
      for (let col = 0; col < 5; col++) {
        const idx = row * 5 + col;
        const tile = tileStats[idx];
        const wins = tile ? tile.wins : 0;
        const label = `${String(idx).padStart(2)}:${String(wins).padStart(2)}`;
        if (wins > avg * 1.3) {
          line += chalk.red.bold(label) + '  ';
        } else if (wins < avg * 0.7) {
          line += chalk.blue(label) + '  ';
        } else {
          line += chalk.gray(label) + '  ';
        }
      }
      console.log(line);
    }

    console.log();
    console.log(chalk.gray(`  Average: ${avg.toFixed(1)} wins/tile`));
    console.log();
  } catch (error: any) {
    spinner.fail('Failed to fetch tile stats');
    errorMessage(error.message);
    process.exit(1);
  }
}

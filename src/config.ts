import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface Config {
  apiKey: string;
  apiUrl?: string;
  walletAddress?: string;
  evMin?: number;
  motherlodeMin?: number;
  solDeployedMax?: number;
}

const CONFIG_DIR = path.join(os.homedir(), '.refinore');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function loadConfig(): Config | undefined {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return undefined;
    }
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return undefined;
  }
}

export function saveConfig(config: Config): void {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function getApiUrl(config?: Config): string {
  return config?.apiUrl || process.env.REFINORE_API_URL || 'https://automine.refinore.com/api';
}

export function getApiKey(config?: Config): string | null {
  return config?.apiKey || process.env.REFINORE_API_KEY || null;
}

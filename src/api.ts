export class RefinoreAPI {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const url = `${this.apiUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'User-Agent': 'refinore-cli/1.0.0',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method === 'POST') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  async getAccountInfo(): Promise<any> {
    return this.request('GET', '/account/me');
  }

  async getBalances(walletAddress: string): Promise<any> {
    return this.request('GET', `/wallet/balances?wallet=${encodeURIComponent(walletAddress)}`);
  }

  async getRewards(walletAddress: string): Promise<any> {
    return this.request('GET', `/rewards?wallet=${encodeURIComponent(walletAddress)}`);
  }

  async getMiningSession(): Promise<any> {
    return this.request('GET', '/mining/session');
  }

  async getSessionRounds(sessionId: string): Promise<any> {
    return this.request('GET', `/mining/session-rounds?session_id=${encodeURIComponent(sessionId)}`);
  }

  async getMiningHistory(limit: number = 20): Promise<any> {
    return this.request('GET', `/mining/history?limit=${limit}`);
  }

  async getCurrentRound(): Promise<any> {
    // Public endpoint - but we'll still send the key
    return this.request('GET', '/rounds/current');
  }

  async startMining(params: {
    wallet_address: string;
    sol_amount: number;
    num_squares: number;
    tile_selection_mode?: string;
    risk_tolerance?: string;
    mining_token?: string;
    auto_restart?: boolean;
    frequency?: string;
  }): Promise<any> {
    return this.request('POST', '/mining/start', params);
  }

  async stopMining(sessionId?: string): Promise<any> {
    const body: Record<string, unknown> = {};
    if (sessionId) {
      body.session_id = sessionId;
    }
    return this.request('POST', '/mining/stop', body);
  }

  async getLastConfig(): Promise<any> {
    return this.request('GET', '/mining/last-config');
  }
}

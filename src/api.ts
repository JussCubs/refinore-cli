export class RefinoreAPI {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    path: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const url = `${this.apiUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'User-Agent': 'refinore-cli/1.3.0',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
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
    return this.request('GET', '/rounds/current');
  }

  async getTileStats(limit: number = 100): Promise<any> {
    return this.request('GET', `/rounds/tile-stats?limit=${limit}`);
  }

  async getRoundHistory(limit: number = 50, offset: number = 0, sessionId?: string): Promise<any> {
    let path = `/rounds/my-history?limit=${limit}&offset=${offset}`;
    if (sessionId) {
      path += `&session_id=${encodeURIComponent(sessionId)}`;
    }
    return this.request('GET', path);
  }

  async startMining(params: {
    wallet_address: string;
    sol_amount: number;
    num_squares: number;
    tile_selection_mode?: string;
    mining_token?: string;
    auto_restart?: boolean;
    frequency?: string;
    ev_threshold?: number;
    motherlode_threshold?: number;
    sol_deployed_max?: number;
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

  // Strategy management

  async listStrategies(): Promise<any> {
    return this.request('GET', '/auto-strategies');
  }

  async createStrategy(params: Record<string, unknown>): Promise<any> {
    return this.request('POST', '/auto-strategies', params);
  }

  async liveEditStrategy(strategyId: string, updates: Record<string, unknown>): Promise<any> {
    return this.request('PATCH', `/auto-strategies/${encodeURIComponent(strategyId)}/live`, updates);
  }

  async deleteStrategy(strategyId: string): Promise<any> {
    return this.request('DELETE', `/auto-strategies/${encodeURIComponent(strategyId)}`);
  }

  async startStrategy(strategyId: string): Promise<any> {
    return this.request('POST', '/mining/start-strategy', { strategy_id: strategyId });
  }

  // Swap order management

  async listSwapOrders(): Promise<any> {
    return this.request('GET', '/auto-swap-orders');
  }

  async createSwapOrder(params: Record<string, unknown>): Promise<any> {
    return this.request('POST', '/auto-swap-orders', params);
  }

  async deleteSwapOrder(orderId: string): Promise<any> {
    return this.request('DELETE', `/auto-swap-orders/${encodeURIComponent(orderId)}`);
  }

  async getSwapHistory(limit: number = 10, offset: number = 0): Promise<any> {
    return this.request('GET', `/auto-swap-orders/history?limit=${limit}&offset=${offset}`);
  }

  // Live session editing

  async editSession(updates: Record<string, unknown>): Promise<any> {
    return this.request('PATCH', '/mining/session/edit', updates);
  }
}

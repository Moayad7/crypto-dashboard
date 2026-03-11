import { Ticker24hData, MarketSymbol, CandleData } from '../types/market';
import { Time } from 'lightweight-charts';

const BASE_URL = 'https://data-api.binance.vision/api/v3';
const WS_BASE_URL = 'wss://stream.binance.com:9443';

export const SUPPORTED_SYMBOLS: MarketSymbol[] = [
  { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', pair: 'BTC/USDT' },
  { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', pair: 'ETH/USDT' },
  { symbol: 'BNBUSDT', baseAsset: 'BNB', quoteAsset: 'USDT', pair: 'BNB/USDT' },
  { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT', pair: 'SOL/USDT' },
  { symbol: 'XRPUSDT', baseAsset: 'XRP', quoteAsset: 'USDT', pair: 'XRP/USDT' },
  { symbol: 'ADAUSDT', baseAsset: 'ADA', quoteAsset: 'USDT', pair: 'ADA/USDT' },
  { symbol: 'DOGEUSDT', baseAsset: 'DOGE', quoteAsset: 'USDT', pair: 'DOGE/USDT' },
  { symbol: 'MATICUSDT', baseAsset: 'MATIC', quoteAsset: 'USDT', pair: 'MATIC/USDT' },
  { symbol: 'DOTUSDT', baseAsset: 'DOT', quoteAsset: 'USDT', pair: 'DOT/USDT' },
  { symbol: 'LINKUSDT', baseAsset: 'LINK', quoteAsset: 'USDT', pair: 'LINK/USDT' },
  { symbol: 'AVAXUSDT', baseAsset: 'AVAX', quoteAsset: 'USDT', pair: 'AVAX/USDT' },
  { symbol: 'UNIUSDT', baseAsset: 'UNI', quoteAsset: 'USDT', pair: 'UNI/USDT' },
];

export class BinanceApi {
  static async get24hTicker(symbol?: string): Promise<Ticker24hData | Ticker24hData[]> {
    const endpoint = symbol 
      ? `${BASE_URL}/ticker/24hr?symbol=${symbol}`
      : `${BASE_URL}/ticker/24hr`;
    
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch 24hr ticker: ${response.statusText}`);
    }
    return response.json();
  }

  static async get24hTickerForSymbol(symbol: string): Promise<Ticker24hData> {
    const data = await this.get24hTicker(symbol);
    return data as Ticker24hData;
  }

  static async getAll24hTickers(): Promise<Ticker24hData[]> {
    const data = await this.get24hTicker();
    return data as Ticker24hData[];
  }

  static async getKlines(
    symbol: string, 
    interval: string = '1m', 
    limit: number = 100
  ): Promise<CandleData[]> {
    const endpoint = `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch klines: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data
  }

  static getWebSocketUrl(symbols: string[], isCombined: boolean = true): string {
    if (isCombined) {
      const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
      return `${WS_BASE_URL}/stream?streams=${streams}`;
    }
    return `${WS_BASE_URL}/ws/${symbols[0].toLowerCase()}@ticker`;
  }
}
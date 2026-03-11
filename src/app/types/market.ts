import { Time } from 'lightweight-charts';

export interface MarketSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  pair: string;
}

export interface TickerData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  high24h: string;
  low24h: string;
  volume: string;
  quoteVolume: string;
  bidPrice: string;
  askPrice: string;
  lastUpdate: number;
}

export interface Ticker24hData {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  prevClosePrice: string;
  count: number;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface CandleData {
  time: Time;  // Use the library's Time type
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

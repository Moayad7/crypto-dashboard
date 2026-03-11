'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { MarketStats } from '../../components/MarketStats';
import { ConnectionStatus } from '../../components/ConnectionStatus';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useWebSocket } from '../../hooks/useWebSocket';
import { BinanceApi, SUPPORTED_SYMBOLS } from '../../services/binanceApi';
import { TickerData, Ticker24hData } from '../../types/market';
import { Time } from 'lightweight-charts';

export default function MarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;

  const [marketData, setMarketData] = useState<TickerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState('1m');

  const marketSymbol = SUPPORTED_SYMBOLS.find(s => s.symbol === symbol);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!symbol) return;
      
      try {
        setIsLoading(true);
        setIsChartLoading(true);
        
        const [tickerData, klinesData] = await Promise.all([
          BinanceApi.get24hTickerForSymbol(symbol),
          BinanceApi.getKlines(symbol, selectedInterval, 100),
        ]);
        
        setMarketData({
          symbol: tickerData.symbol,
          price: tickerData.lastPrice,
          priceChange: tickerData.priceChange,
          priceChangePercent: tickerData.priceChangePercent,
          high24h: tickerData.highPrice,
          low24h: tickerData.lowPrice,
          volume: tickerData.volume,
          quoteVolume: tickerData.quoteVolume,
          bidPrice: tickerData.bidPrice,
          askPrice: tickerData.askPrice,
          lastUpdate: Date.now(),
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load market data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [symbol, selectedInterval]);

  // WebSocket connection for real-time updates
  const wsUrl = BinanceApi.getWebSocketUrl([symbol], false);

  const handleWebSocketMessage = useCallback((message: any) => {
    try {
      const data = message.data || message;
      if (data.e === '24hrTicker') {
        setMarketData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            symbol: data.s,
            price: data.c,
            priceChange: data.p,
            priceChangePercent: data.P,
            high24h: data.h,
            low24h: data.l,
            volume: data.v,
            quoteVolume: data.q,
            bidPrice: data.b,
            askPrice: data.a,
            lastUpdate: Date.now(),
          };
        });
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [selectedInterval]);

  const { status } = useWebSocket({
    url: wsUrl,
    onMessage: handleWebSocketMessage,
  });

  if (!marketSymbol) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Market not found</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-400">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back</span>
            </button>
            <ConnectionStatus status={status} />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {marketSymbol.pair}
            </h1>
            <p className="text-gray-400">{marketSymbol.symbol}</p>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-red-200 underline hover:text-red-100"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="animate-pulse">
              <div className="h-20 bg-gray-800 rounded-lg mb-6"></div>
              <div className="h-96 bg-gray-800 rounded-lg"></div>
            </div>
          )}

          {/* Market Data */}
          {!isLoading && marketData && (
            <>
              {/* Current Price */}
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-sm text-gray-400">Latest Price</span>
                    <div className="text-4xl font-bold text-white">
                      ${parseFloat(marketData.price).toLocaleString(undefined, { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 8 
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400">Last Update</span>
                    <div className="text-sm text-white">
                      {new Date(marketData.lastUpdate).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              
              {/* Market Statistics */}
              <div className="mt-6">
                <MarketStats data={marketData} />
              </div>
            </>
          )}
        </div>
      </main>
    </ErrorBoundary>
  );
}
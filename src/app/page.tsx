'use client';

import { useEffect, useState } from 'react';
import { MarketCard } from './components/MarketCard';
import { ConnectionStatus } from './components/ConnectionStatus';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useWebSocket } from './hooks/useWebSocket';
import { useFavorites } from './hooks/useFavorites';
import { BinanceApi, SUPPORTED_SYMBOLS } from './services/binanceApi';
import { TickerData, Ticker24hData } from './types/market';

export default function Home() {
  const [marketData, setMarketData] = useState<Record<string, TickerData>>({});
  const [initialData, setInitialData] = useState<Record<string, Ticker24hData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const { favorites, toggleFavorite, isFavorite, isInitialized } = useFavorites();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await BinanceApi.getAll24hTickers();
        const dataMap = data.reduce((acc, item) => {
          acc[item.symbol] = item;
          return acc;
        }, {} as Record<string, Ticker24hData>);
        setInitialData(dataMap);
        setError(null);
      } catch (err) {
        setError('Failed to load initial market data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // WebSocket connection for real-time updates
  const symbols = SUPPORTED_SYMBOLS.map(s => s.symbol);
  const wsUrl = BinanceApi.getWebSocketUrl(symbols, true);

  const handleWebSocketMessage = (message: any) => {
    try {
      // Handle combined streams format
      const streamData = message.data || message;
      if (streamData.e === '24hrTicker') {
        setMarketData(prev => ({
          ...prev,
          [streamData.s]: {
            symbol: streamData.s,
            price: streamData.c,
            priceChange: streamData.p,
            priceChangePercent: streamData.P,
            high24h: streamData.h,
            low24h: streamData.l,
            volume: streamData.v,
            quoteVolume: streamData.q,
            bidPrice: streamData.b,
            askPrice: streamData.a,
            lastUpdate: Date.now(),
          },
        }));
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };

  const { status } = useWebSocket({
    url: wsUrl,
    onMessage: handleWebSocketMessage,
  });

  // Combine initial and real-time data
  const getDisplayData = (symbol: string): TickerData | undefined => {
    const realtime = marketData[symbol];
    const initial = initialData[symbol];
    
    if (realtime) return realtime;
    
    if (initial) {
      return {
        symbol: initial.symbol,
        price: initial.lastPrice,
        priceChange: initial.priceChange,
        priceChangePercent: initial.priceChangePercent,
        high24h: initial.highPrice,
        low24h: initial.lowPrice,
        volume: initial.volume,
        quoteVolume: initial.quoteVolume,
        bidPrice: initial.bidPrice,
        askPrice: initial.askPrice,
        lastUpdate: Date.now(),
      };
    }
    
    return undefined;
  };

  const filteredSymbols = showFavoritesOnly
    ? SUPPORTED_SYMBOLS.filter(s => isFavorite(s.symbol))
    : SUPPORTED_SYMBOLS;

  // Don't render favorites UI until initialized to prevent hydration mismatch
  if (!isInitialized) {
    return (
      <main className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-800 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Crypto Market Dashboard
              </h1>
              <p className="text-gray-400">
                Real-time cryptocurrency prices from Binance
              </p>
            </div>
            <ConnectionStatus status={status} />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !showFavoritesOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              All Markets
            </button>
            <button
              onClick={() => setShowFavoritesOnly(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showFavoritesOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Favorites ({favorites.length})
            </button>
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

          {/* Empty State */}
          {!isLoading && filteredSymbols.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                {showFavoritesOnly 
                  ? "You haven't added any favorites yet" 
                  : "No markets available"}
              </p>
              {showFavoritesOnly && (
                <button
                  onClick={() => setShowFavoritesOnly(false)}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Browse all markets
                </button>
              )}
            </div>
          )}

          {/* Markets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSymbols.map((symbol) => (
              <MarketCard
                key={symbol.symbol}
                symbol={symbol}
                data={getDisplayData(symbol.symbol)}
                isFavorite={isFavorite(symbol.symbol)}
                onToggleFavorite={() => toggleFavorite(symbol.symbol)}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}
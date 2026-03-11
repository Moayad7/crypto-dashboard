import React from 'react';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { TickerData, MarketSymbol } from '../types/market';

interface Props {
  symbol: MarketSymbol;
  data?: TickerData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isLoading?: boolean;
}

export const MarketCard: React.FC<Props> = ({
  symbol,
  data,
  isFavorite,
  onToggleFavorite,
  isLoading,
}) => {
  const priceChange = data ? parseFloat(data.priceChange) : 0;
  const priceChangePercent = data ? parseFloat(data.priceChangePercent) : 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{symbol.pair}</h3>
          <p className="text-sm text-gray-400">{symbol.symbol}</p>
        </div>
        <button
          onClick={onToggleFavorite}
          className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <StarIcon className="w-5 h-5 text-yellow-500" />
          ) : (
            <StarOutlineIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-32"></div>
        </div>
      ) : data ? (
        <>
          <div className="mb-2">
            <span className="text-2xl font-bold text-white">
              ${parseFloat(data.price).toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 8 
              })}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </span>
            <span className="text-sm text-gray-400">
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
            <div>
              <span className="block">24h High</span>
              <span className="text-white">${parseFloat(data.high24h).toLocaleString()}</span>
            </div>
            <div>
              <span className="block">24h Low</span>
              <span className="text-white">${parseFloat(data.low24h).toLocaleString()}</span>
            </div>
            <div>
              <span className="block">Volume</span>
              <span className="text-white">{parseFloat(data.volume).toFixed(2)}</span>
            </div>
            <div>
              <span className="block">Quote Vol</span>
              <span className="text-white">${parseFloat(data.quoteVolume).toFixed(2)}</span>
            </div>
          </div>

          <Link
            href={`/market/${symbol.symbol}`}
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            View Details
          </Link>
        </>
      ) : (
        <div className="text-gray-400 py-4 text-center">No data available</div>
      )}
    </div>
  );
};
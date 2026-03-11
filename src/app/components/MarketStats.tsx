import React from 'react';
import { TickerData } from '../types/market';

interface Props {
  data: TickerData;
}

export const MarketStats: React.FC<Props> = ({ data }) => {
  const stats = [
    { label: '24h High', value: `$${parseFloat(data.high24h).toLocaleString()}` },
    { label: '24h Low', value: `$${parseFloat(data.low24h).toLocaleString()}` },
    { label: '24h Volume', value: parseFloat(data.volume).toFixed(2) },
    { label: '24h Quote Volume', value: `$${parseFloat(data.quoteVolume).toFixed(2)}` },
    { label: 'Bid Price', value: `$${parseFloat(data.bidPrice).toLocaleString()}` },
    { label: 'Ask Price', value: `$${parseFloat(data.askPrice).toLocaleString()}` },
    { label: 'Price Change', value: parseFloat(data.priceChange).toFixed(2) },
    { label: 'Change %', value: `${parseFloat(data.priceChangePercent).toFixed(2)}%` },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Market Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
            <div className="text-lg font-semibold text-white">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
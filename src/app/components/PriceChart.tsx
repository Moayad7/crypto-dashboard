// app/components/PriceChart.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ColorType, CandlestickData, Time } from 'lightweight-charts';
import { CandleData } from '../types/market';

interface Props {
  data: CandleData[];
  symbol: string;
  isLoading?: boolean;
}

export const PriceChart: React.FC<Props> = ({ data, symbol, isLoading }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
console.log(data)
  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0 || chartError) return;

    try {
      // Clean up previous chart safely
      if (chartRef.current) {
        try {
          chartRef.current.removeSeries();
        } catch (error) {
          console.warn('Error removing previous chart:', error);
        } finally {
          chartRef.current = null;
        }
      }

      // Create new chart
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#1f2937' },
          textColor: '#9ca3af',
        },
        grid: {
          vertLines: { color: '#374151' },
          horzLines: { color: '#374151' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: '#374151',
        },
        rightPriceScale: {
          borderColor: '#374151',
        },
        crosshair: {
          mode: 0, // CrosshairMode.Normal
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      });

      // Add candlestick series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
        borderColor: '#10b981',
      });

      // Transform data to match library expectations
      const chartData: CandlestickData<Time>[] = data.map(candle => ({
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));

      candlestickSeries.setData(chartData);

      // Fit content
      chart.timeScale().fitContent();

      chartRef.current = chart;
      setChartError(null);

    } catch (error) {
      console.error('Error creating chart:', error);
      setChartError('Failed to initialize chart');
    }

    // Handle resize
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        try {
          chartRef.current.applyOptions({ 
            width: chartContainerRef.current.clientWidth 
          });
        } catch (error) {
          console.warn('Error resizing chart:', error);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up chart on unmount
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (error) {
          console.warn('Error removing chart on unmount:', error);
        } finally {
          chartRef.current = null;
        }
      }
    };
  }, [data, chartError]); // Re-run when data changes

  // Update chart when data changes (without recreating the whole chart)
  useEffect(() => {
    if (!chartRef.current || data.length === 0 || chartError) return;

    try {
      const candlestickSeries = chartRef.current.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
        borderColor: '#10b981',
      });

      const chartData: CandlestickData<Time>[] = data.map(candle => ({
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));

      candlestickSeries.setData(chartData);
      chartRef.current.timeScale().fitContent();
    } catch (error) {
      console.error('Error updating chart data:', error);
    }
  }, [data, chartError]);

  if (chartError) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">{chartError}</p>
          <button
            onClick={() => setChartError(null)}
            className="text-blue-500 hover:text-blue-400 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-[400px] flex items-center justify-center">
        <div className="text-gray-400">No chart data available</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">{symbol} Price Chart</h3>
      <div ref={chartContainerRef} />
    </div>
  );
};
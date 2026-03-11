// app/hooks/useChart.ts
import { useRef, useEffect, MutableRefObject } from 'react';
import { IChartApi, createChart, ColorType, ChartOptions } from 'lightweight-charts';

interface UseChartProps {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  options?: Partial<ChartOptions>;
  height?: number;
}

export const useChart = ({ containerRef, options = {}, height = 400 }: UseChartProps) => {
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous chart
    const cleanup = () => {
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (error) {
          console.warn('Error removing chart:', error);
        } finally {
          chartRef.current = null;
        }
      }
    };

    // Create new chart
    try {
      cleanup();

      const chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height,
        layout: {
          background: { type: ColorType.Solid, color: '#1f2937' },
          textColor: '#9ca3af',
          ...options.layout,
        },
        grid: {
          vertLines: { color: '#374151' },
          horzLines: { color: '#374151' },
          ...options.grid,
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: '#374151',
          ...options.timeScale,
        },
        rightPriceScale: {
          borderColor: '#374151',
          ...options.rightPriceScale,
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
        ...options,
      });

      chartRef.current = chart;
    } catch (error) {
      console.error('Error creating chart:', error);
    }

    // Handle resize
    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        try {
          chartRef.current.applyOptions({ 
            width: containerRef.current.clientWidth 
          });
        } catch (error) {
          console.warn('Error resizing chart:', error);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup();
    };
  }, [containerRef, height, options]);

  return chartRef;
};
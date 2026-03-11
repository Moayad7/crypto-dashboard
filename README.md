# Real-Time Crypto Market Dashboard

A real-time cryptocurrency market dashboard built with Next.js, TypeScript, and Binance WebSocket streams. Track live prices, manage favorites, and monitor market movements with automatic reconnection handling.

## Features

### Core Features
- **Real-Time Market Data**: Live price updates via Binance WebSocket streams
- **Market List View**: Browse 12+ cryptocurrency pairs with current prices and 24h stats
- **Detailed Market View**: Dedicated page for each trading pair with comprehensive market data
- **Favorites System**: Mark/unmark markets as favorites with localStorage persistence
- **Connection Status**: Visual indicator for WebSocket connection state with auto-reconnection
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- WebSocket integration with automatic reconnection (up to 5 attempts)
- REST API fallback for initial data loading
- Type-safe development with TypeScript
- State management with React hooks
- Error boundaries for graceful failure handling
- Loading states and skeleton animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **API**: Binance Public Market Data API
- **WebSocket**: Binance WebSocket Streams

import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'crypto-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse favorites:', error);
        setFavorites([]);
      }
    }
    setIsInitialized(true);
  }, []);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol];
      
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (symbol: string) => favorites.includes(symbol);

  return { favorites, toggleFavorite, isFavorite, isInitialized };
};
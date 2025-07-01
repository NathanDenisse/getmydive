import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // État initial
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key} dans localStorage:`, error);
      return initialValue;
    }
  });

  // Mise à jour du localStorage quand la valeur change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Erreur lors de l'écriture de ${key} dans localStorage:`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
} 
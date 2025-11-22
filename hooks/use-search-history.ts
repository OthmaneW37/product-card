import { useState, useCallback, useMemo } from 'react';
import { SearchHistoryStorage } from '@/services/storage-service';

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  frequency?: number;
}

/**
 * Hook pour gérer l'historique de recherche
 * Stocke les recherches les plus récentes et les plus fréquentes
 */
export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Charger l'historique au montage
  const loadHistory = useCallback(async () => {
    const loaded = await SearchHistoryStorage.load();
    setHistory(loaded);
  }, []);

  // Ajouter une recherche
  const addSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      const normalizedQuery = query.toLowerCase().trim();

      // Mettre à jour l'état local
      setHistory(prev => {
        const filtered = prev.filter(h => h.query !== normalizedQuery);
        return [
          {
            query: normalizedQuery,
            timestamp: Date.now(),
            frequency: (prev.find(h => h.query === normalizedQuery)?.frequency || 0) + 1,
          },
          ...filtered,
        ].slice(0, 20);
      });

      // Sauvegarder dans le storage
      await SearchHistoryStorage.addSearch(normalizedQuery);
    },
    []
  );

  // Supprimer une recherche
  const removeSearch = useCallback((query: string) => {
    setHistory(prev => prev.filter(h => h.query !== query));
  }, []);

  // Vider l'historique
  const clearHistory = useCallback(async () => {
    setHistory([]);
    await SearchHistoryStorage.clear();
  }, []);

  // Récent (5 derniers)
  const recent = useMemo(() => history.slice(0, 5), [history]);

  // Populaire (triés par fréquence)
  const popular = useMemo(
    () =>
      [...history]
        .sort((a, b) => (b.frequency || 1) - (a.frequency || 1))
        .slice(0, 5),
    [history]
  );

  // Suggestions (pour autocomplete)
  const getSuggestions = useCallback(
    (input: string) => {
      const normalized = input.toLowerCase().trim();
      if (!normalized) return recent;

      return history.filter(h =>
        h.query.includes(normalized)
      );
    },
    [history, recent]
  );

  return {
    history,
    loadHistory,
    addSearch,
    removeSearch,
    clearHistory,
    recent,
    popular,
    getSuggestions,
  };
};

import { CartItem, FavoriteItem } from '@/types/product';

// Simulated storage - En production, utilisez @react-native-async-storage/async-storage
// npm install @react-native-async-storage/async-storage
const storageData: Record<string, string> = {};

const CART_KEY = '@ecommerce_cart';
const FAVORITES_KEY = '@ecommerce_favorites';
const SEARCH_HISTORY_KEY = '@ecommerce_search_history';
const USER_PREFERENCES_KEY = '@ecommerce_preferences';

/**
 * Service de persistance (simulated storage)
 * Sauvegarde et récupère le panier, favoris, historique
 * 
 * Pour une vraie persistance, installez:
 * npm install @react-native-async-storage/async-storage
 */

// ===== CART =====
export const CartStorage = {
  async save(cart: CartItem[]): Promise<void> {
    try {
      storageData[CART_KEY] = JSON.stringify(cart);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  async load(): Promise<CartItem[]> {
    try {
      const data = storageData[CART_KEY];
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  },

  async clear(): Promise<void> {
    try {
      delete storageData[CART_KEY];
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  },
};

// ===== FAVORITES =====
export const FavoritesStorage = {
  async save(favorites: FavoriteItem[]): Promise<void> {
    try {
      storageData[FAVORITES_KEY] = JSON.stringify(favorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },

  async load(): Promise<FavoriteItem[]> {
    try {
      const data = storageData[FAVORITES_KEY];
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  },

  async clear(): Promise<void> {
    try {
      delete storageData[FAVORITES_KEY];
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  },
};

// ===== SEARCH HISTORY =====
export type SearchHistoryItem = { query: string; timestamp: number };

export const SearchHistoryStorage = {
  async addSearch(query: string): Promise<void> {
    try {
      const history = await this.load();
      const updated = [
        { query, timestamp: Date.now() },
        ...history.filter(h => h.query !== query),
      ].slice(0, 20); // Limite à 20 recherches

      storageData[SEARCH_HISTORY_KEY] = JSON.stringify(updated);
    } catch (error) {
      console.error('Error adding search:', error);
    }
  },

  async load(): Promise<SearchHistoryItem[]> {
    try {
      const data = storageData[SEARCH_HISTORY_KEY];
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading search history:', error);
      return [];
    }
  },

  async clear(): Promise<void> {
    try {
      delete storageData[SEARCH_HISTORY_KEY];
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  },
};

// ===== USER PREFERENCES =====
export interface UserPreferences {
  darkMode?: boolean;
  sortBy?: string;
  filterCategory?: string;
  defaultCurrency?: string;
  notificationsEnabled?: boolean;
}

export const PreferencesStorage = {
  async save(preferences: UserPreferences): Promise<void> {
    try {
      storageData[USER_PREFERENCES_KEY] = JSON.stringify(preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  },

  async load(): Promise<UserPreferences> {
    try {
      const data = storageData[USER_PREFERENCES_KEY];
      return data
        ? JSON.parse(data)
        : {
            darkMode: false,
            sortBy: 'price-low',
            filterCategory: 'all',
            defaultCurrency: 'EUR',
            notificationsEnabled: true,
          };
    } catch (error) {
      console.error('Error loading preferences:', error);
      return {};
    }
  },

  async clear(): Promise<void> {
    try {
      delete storageData[USER_PREFERENCES_KEY];
    } catch (error) {
      console.error('Error clearing preferences:', error);
    }
  },
};

// ===== BULK OPERATIONS =====
export const StorageService = {
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        CartStorage.clear(),
        FavoritesStorage.clear(),
        SearchHistoryStorage.clear(),
      ]);
    } catch (error) {
      console.error('Error clearing all storage:', error);
    }
  },

  async getAppData() {
    try {
      const [cart, favorites, history, preferences] = await Promise.all([
        CartStorage.load(),
        FavoritesStorage.load(),
        SearchHistoryStorage.load(),
        PreferencesStorage.load(),
      ]);

      return { cart, favorites, history, preferences };
    } catch (error) {
      console.error('Error loading app data:', error);
      return {
        cart: [],
        favorites: [],
        history: [],
        preferences: {},
      };
    }
  },

  async getStorageSize(): Promise<string> {
    try {
      const data = await this.getAppData();
      const sizeInBytes = JSON.stringify(data).length;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      return `${sizeInKB} KB`;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 'Unknown';
    }
  },
};

/**
 * 📚 Index centralisé de tous les hooks personnalisés
 * Importe tous les hooks pour une réutilisation facile
 */

// Hooks de thème
export { useColorScheme } from './use-color-scheme';
export { useThemeColor } from './use-theme-color';

// Hooks de contexte
export { useShoppingContext } from '@/contexts/shopping-context';

// Hooks de produits
export { useProductsFilter } from './use-products-filter';

// Hooks d'animations
export { 
  useAnimatedEntrance,
  useAnimatedExit,
  useBouncingAnimation,
  useProgressAnimation,
  usePulsingAnimation,
  useShakeAnimation,
} from './use-animations';

// Hooks de notifications
export { useToast, useToastListener } from './use-toast';

// Hooks de recherche
export { useSearchHistory } from './use-search-history';

// Hooks d'optimisation images
export {
  useImageCache,
  useImageCacheManager,
  useLazyImageLoad,
  useResponsiveImage,
} from './use-image-cache';

// Types
export type { Toast, ToastType } from './use-toast';
export type { SearchHistoryItem } from './use-search-history';

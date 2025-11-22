import { useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Hook pour optimiser le chargement des images avec effet blur
 * Implémente un pattern progressive image loading
 */
export const useImageCache = (imageUrl?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const blurOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const handleImageLoad = () => {
    setIsLoading(false);

    // Animation: fade out du blur, fade in de l'image
    Animated.parallel([
      Animated.timing(blurOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleImageError = (err: Error) => {
    setIsLoading(false);
    setError(err);
  };

  // Reset animations pour les nouvelles images
  const resetAnimations = () => {
    blurOpacity.setValue(1);
    imageOpacity.setValue(0);
  };

  return {
    isLoading,
    error,
    blurOpacity,
    imageOpacity,
    handleImageLoad,
    handleImageError,
    resetAnimations,
  };
};

/**
 * Hook pour gérer un cache simple d'images
 * Stocke les URLs chargées pour éviter les rechargements
 */
export const useImageCacheManager = () => {
  const cache = useRef<Map<string, boolean>>(new Map()).current;

  const isCached = (url: string): boolean => {
    return cache.has(url);
  };

  const markAsLoaded = (url: string) => {
    cache.set(url, true);
  };

  const clearCache = () => {
    cache.clear();
  };

  const preloadImage = async (url: string): Promise<void> => {
    return new Promise((resolve) => {
      if (isCached(url)) {
        resolve();
        return;
      }

      // Simuler le préchargement
      setTimeout(() => {
        markAsLoaded(url);
        resolve();
      }, 100);
    });
  };

  const preloadImages = async (urls: string[]): Promise<void> => {
    await Promise.all(urls.map(url => preloadImage(url)));
  };

  return {
    isCached,
    markAsLoaded,
    clearCache,
    preloadImage,
    preloadImages,
  };
};

/**
 * Hook pour lazy loading d'images avec intersection observer
 * Charge les images uniquement quand elles sont visibles
 */
export const useLazyImageLoad = (
  urls: string[],
  onLoadComplete?: () => void
) => {
  const [visibleUrls, setVisibleUrls] = useState<Set<string>>(new Set());
  const { preloadImage } = useImageCacheManager();

  const markAsVisible = async (url: string) => {
    await preloadImage(url);
    setVisibleUrls(prev => new Set([...prev, url]));
  };

  const isVisible = (url: string): boolean => {
    return visibleUrls.has(url);
  };

  return {
    visibleUrls,
    markAsVisible,
    isVisible,
  };
};

/**
 * Hook pour gérer la taille des images adaptée au device
 * Retourne les bonnes dimensions en fonction de la densité de pixels
 */
export const useResponsiveImage = (baseWidth: number, baseHeight: number) => {
  // En React Native, les dimensions sont généralement en points (pt)
  // et s'adaptent automatiquement à la densité d'écran
  
  const dimensions = {
    width: baseWidth,
    height: baseHeight,
    aspectRatio: baseWidth / baseHeight,
  };

  // Variantes pour différentes densités (1x, 2x, 3x)
  const variants = {
    low: { width: baseWidth * 0.5, height: baseHeight * 0.5 },
    medium: { width: baseWidth, height: baseHeight },
    high: { width: baseWidth * 2, height: baseHeight * 2 },
  };

  return {
    dimensions,
    variants,
    aspectRatio: baseWidth / baseHeight,
  };
};

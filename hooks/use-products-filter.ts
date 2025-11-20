import { useState, useCallback, useMemo } from 'react';
import { Product, ProductCategory } from '@/types/product';

interface UseProductsFilterOptions {
  products: Product[];
  initialCategory?: ProductCategory | 'all';
}

export function useProductsFilter({
  products,
  initialCategory = 'all',
}: UseProductsFilterOptions) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating' | 'newest'>('price-low');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Trier
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const stats = useMemo(() => {
    const total = filteredAndSortedProducts.length;
    const avgRating =
      total > 0
        ? (filteredAndSortedProducts.reduce((sum, p) => sum + p.rating, 0) / total).toFixed(1)
        : 0;
    const avgPrice =
      total > 0
        ? (filteredAndSortedProducts.reduce((sum, p) => sum + p.price, 0) / total).toFixed(2)
        : 0;
    const inStock = filteredAndSortedProducts.filter((p) => p.stock > 0).length;

    return { total, avgRating, avgPrice, inStock };
  }, [filteredAndSortedProducts]);

  const resetFilters = useCallback(() => {
    setSelectedCategory(initialCategory);
    setSearchQuery('');
    setSortBy('price-low');
  }, [initialCategory]);

  return {
    products: filteredAndSortedProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    stats,
    resetFilters,
  };
}

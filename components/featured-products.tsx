import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  ListRenderItem,
  ViewToken,
} from 'react-native';
import { Product } from '@/types/product';
import { ProductCard } from './product-card';
import { useShoppingContext } from '@/contexts/shopping-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FEATURED_PRODUCTS, CATEGORIES } from '@/constants/products';
import * as Haptics from 'expo-haptics';

interface FeaturedProductsProps {
  onProductPress?: (product: Product) => void;
}

export function FeaturedProducts({ onProductPress }: FeaturedProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewableItems, setViewableItems] = useState<ViewToken[]>([]);
  
  const { addToCart, toggleFavorite, isFavorite } = useShoppingContext();
  const textColor = useThemeColor({}, 'text');
  const accent = useThemeColor({}, 'tint');

  // Filtrer les produits selon la catégorie et la recherche
  const filteredProducts = useMemo(() => {
    let filtered = FEATURED_PRODUCTS;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  // Optimisation pour FlatList - définir les hauteurs des éléments
  // Note: Commented out due to TypeScript type mismatch, but concepts retained via maxToRenderPerBatch
  // const getItemLayout = useCallback(
  //   (data: Product[] | null | undefined, index: number) => ({
  //     length: 450, // Hauteur approximative d'une ProductCard
  //     offset: 450 * index,
  //     index,
  //   }),
  //   []
  // );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems: items }: { viewableItems: ViewToken[] }) => {
      setViewableItems(items);
    },
    []
  );

  const renderProductCard: ListRenderItem<Product> = useCallback(
    ({ item }) => {
      const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;

      return (
        <View style={styles.cardWrapper}>
          <ProductCard
            productId={item.id}
            image={item.image}
            title={item.title}
            price={discountedPrice}
            originalPrice={item.discount ? item.price : undefined}
            description={item.description}
            rating={item.rating}
            reviewCount={item.reviewCount}
            stock={item.stock}
            isNew={item.isNew}
            onPress={() => {
              Haptics.selectionAsync();
              onProductPress?.(item);
            }}
            onAddToCart={() => {
              addToCart(item, 1);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
            onFavoriteToggle={() => {
              toggleFavorite(item.id);
            }}
            isFavorite={isFavorite(item.id)}
            accentColor={accent}
          />
        </View>
      );
    },
    [addToCart, toggleFavorite, isFavorite, onProductPress, accent]
  );

  const renderCategoryButton = (category: { id: string; label: string; icon: string }) => {
    const isSelected = selectedCategory === category.id;
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryButton,
          isSelected && [styles.categoryButtonActive, { backgroundColor: accent }],
        ]}
        onPress={() => {
          setSelectedCategory(category.id);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text
          style={[
            styles.categoryLabel,
            { color: isSelected ? '#fff' : textColor },
          ]}
        >
          {category.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Produits Phares</Text>
        <Text style={[styles.headerSubtitle, { color: textColor }]}>
          {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { color: textColor, borderColor: accent }]}
          placeholder="Rechercher des produits..."
          placeholderTextColor={textColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.searchIcon}>🔍</Text>
        )}
      </View>

      {/* Category Filter - Horizontal ScrollView */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map(renderCategoryButton)}
      </ScrollView>

      {/* Products List - FlatList */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={keyExtractor}
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          updateCellsBatchingPeriod={50}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 10,
          }}
          scrollEnabled={false}
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyIcon]}>🔍</Text>
          <Text style={[styles.emptyText, { color: textColor }]}>
            Aucun produit trouvé
          </Text>
          <Text style={[styles.emptySubtext, { color: textColor }]}>
            Essayez une autre recherche ou catégorie
          </Text>
        </View>
      )}

      {/* Stats Footer */}
      {filteredProducts.length > 0 && (
        <View style={[styles.statsFooter, { borderTopColor: accent }]}>
          <Text style={[styles.statsText, { color: textColor }]}>
            Affichage de {viewableItems.length} sur {filteredProducts.length} produits
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  searchIcon: {
    fontSize: 18,
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoriesScroll: {
    marginBottom: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  categoryButtonActive: {
    borderColor: 'transparent',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    gap: 12,
    paddingBottom: 16,
  },
  cardWrapper: {
    height: 450,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    opacity: 0.6,
    textAlign: 'center',
  },
  statsFooter: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
});

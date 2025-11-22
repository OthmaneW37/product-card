import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Share,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useShoppingContext } from '@/contexts/shopping-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ProductCard } from './product-card';
import { FavoriteItem } from '@/types/product';

interface WishlistScreenProps {
  onProductPress?: (productId: string) => void;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({
  onProductPress,
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const { favorites, removeFavorite } = useShoppingContext();

  const stats = useMemo(() => {
    return {
      count: favorites.length,
      totalValue: favorites.reduce((sum, f) => sum + (f.price * (1 - (f.discount || 0) / 100)), 0),
      avgRating: favorites.length
        ? (favorites.reduce((sum, f) => sum + (f.rating || 0), 0) / favorites.length).toFixed(1)
        : 0,
    };
  }, [favorites]);

  const handleShare = async () => {
    try {
      const message = `Check out my wishlist! ${favorites.length} amazing items: ${favorites
        .map(f => f.name)
        .join(', ')}`;
      await Share.share({
        message,
        title: 'Mon Wishlist',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleMoveToCart = (productId: string) => {
    // À implémenter avec contexte shopping
    removeFavorite(productId);
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor }]}
      >
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon]}>💔</Text>
          <Text style={[styles.emptyTitle, { color: textColor }]}>
            Wishlist vide
          </Text>
          <Text style={[styles.emptyText, { color: textColor }]}>
            Ajoutez des produits à votre wishlist pour les retrouver facilement
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
    >
      {/* Header Stats */}
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: tintColor }]}>
              {stats.count}
            </Text>
            <Text style={[styles.statLabel, { color: textColor }]}>
              Produits
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: tintColor }]}>
              €{stats.totalValue.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: textColor }]}>
              Valeur
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: tintColor }]}>
              {stats.avgRating}⭐
            </Text>
            <Text style={[styles.statLabel, { color: textColor }]}>
              Moyenne
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: tintColor }]}
          onPress={handleShare}
        >
          <Text style={styles.shareButtonText}>📤 Partager</Text>
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <WishlistItemCard
            item={item}
            onRemove={() => removeFavorite(item.id)}
            onPress={() => onProductPress?.(item.id)}
            tintColor={tintColor}
            textColor={textColor}
            backgroundColor={backgroundColor}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

interface WishlistItemCardProps {
  item: FavoriteItem;
  onRemove: () => void;
  onPress: () => void;
  tintColor: string;
  textColor: string;
  backgroundColor: string;
}

const WishlistItemCard: React.FC<WishlistItemCardProps> = ({
  item,
  onRemove,
  onPress,
  tintColor,
  textColor,
  backgroundColor,
}) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={[
          styles.itemCard,
          { backgroundColor: '#f5f5f5' },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Image Placeholder */}
        <View style={[styles.imageContainer, { backgroundColor: '#e0e0e0' }]}>
          <Text style={styles.imageEmoji}>📦</Text>
        </View>

        {/* Info */}
        <View style={styles.itemInfo}>
          <Text
            style={[styles.itemName, { color: textColor }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {item.rating || 0}</Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={[styles.priceOriginal, { color: '#999' }]}>
              ${item.price}
            </Text>
            <Text style={[styles.priceCurrent, { color: tintColor }]}>
              €{(item.price * (1 - (item.discount || 0) / 100)).toFixed(2)}
            </Text>
          </View>

          {item.discount && (
            <View style={[styles.discountBadge, { backgroundColor: tintColor }]}>
              <Text style={styles.discountText}>-{item.discount}%</Text>
            </View>
          )}
        </View>

        {/* Remove Button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.7}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ddd',
  },
  shareButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  itemContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  itemCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageEmoji: {
    fontSize: 40,
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  ratingRow: {
    marginBottom: 6,
  },
  rating: {
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  priceOriginal: {
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  priceCurrent: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  discountBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

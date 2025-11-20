import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';

interface ProductCardProps {
  productId?: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  isNew?: boolean;
  onPress?: () => void;
  onAddToCart?: () => void;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  accentColor?: string;
}

export function ProductCard({
  productId,
  image,
  title,
  price,
  originalPrice,
  description,
  rating = 0,
  reviewCount = 0,
  stock = 0,
  isNew = false,
  onPress,
  onAddToCart,
  onFavoriteToggle,
  isFavorite = false,
  accentColor,
}: ProductCardProps) {
  const accentTheme = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const accent = accentColor || accentTheme;
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAddToCart?.();
  };

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onFavoriteToggle?.();
  };

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const inStock = stock > 0;

  return (
    <Animated.View style={[styles.container, { backgroundColor, transform: [{ scale: scaleAnim }] }]}>
      {/* Image Container */}
      <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />

          {/* Badges */}
          {isNew && (
            <View style={[styles.badge, styles.newBadge]}>
              <Text style={styles.badgeText}>NOUVEAU</Text>
            </View>
          )}

          {discount > 0 && (
            <View style={[styles.badge, { backgroundColor: accent }]}>
              <Text style={styles.badgeText}>-{discount}%</Text>
            </View>
          )}

          {!inStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Rupture de stock</Text>
            </View>
          )}

          {/* Favorite Button */}
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: isFavorite ? accent : 'rgba(255,255,255,0.9)' }]}
            onPress={handleFavorite}
          >
            <Text style={{ fontSize: 18 }}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
          {title}
        </Text>

        {/* Rating and Reviews */}
        {rating > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>⭐ {rating.toFixed(1)}</Text>
            <Text style={[styles.reviewCount, { color: textColor }]}>({reviewCount})</Text>
          </View>
        )}

        {/* Description */}
        <Text style={[styles.description, { color: textColor }]} numberOfLines={2}>
          {description}
        </Text>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: accent }]}>{price.toFixed(2)} €</Text>
          {originalPrice && (
            <Text style={[styles.originalPrice]}>
              {originalPrice.toFixed(2)} €
            </Text>
          )}
        </View>

        {/* Stock Info */}
        {stock >= 0 && (
          <Text style={[styles.stock, { color: inStock ? 'green' : 'red' }]}>
            {inStock ? `${stock} en stock` : 'Rupture de stock'}
          </Text>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: accent, opacity: inStock ? 1 : 0.5 }]}
            onPress={handleAddToCart}
            disabled={!inStock}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>🛒 Ajouter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
  },
  newBadge: {
    backgroundColor: '#4ECDC4',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stars: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 11,
    opacity: 0.6,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.7,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  stock: {
    fontSize: 11,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

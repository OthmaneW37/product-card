import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Product } from '@/types/product';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useShoppingContext } from '@/contexts/shopping-context';
import * as Haptics from 'expo-haptics';

interface ProductDetailProps {
  product: Product;
  onClose?: () => void;
  onAddToCart?: () => void;
}

export function ProductDetail({ product, onClose, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'tint');
  
  const { addToCart, toggleFavorite, isFavorite } = useShoppingContext();

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
      Haptics.selectionAsync();
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
      Haptics.selectionAsync();
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAddToCart?.();
  };

  const handleFavorite = () => {
    toggleFavorite(product.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Détails Produit</Text>
          <TouchableOpacity onPress={handleFavorite} style={styles.favoriteHeaderButton}>
            <Text style={{ fontSize: 24 }}>
              {isFavorite(product.id) ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          {product.discount && (
            <View style={[styles.discountBadge, { backgroundColor: accent }]}>
              <Text style={styles.discountText}>-{product.discount}%</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.title, { color: textColor }]}>{product.title}</Text>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <Text style={styles.stars}>⭐ {product.rating.toFixed(1)}</Text>
            <Text style={[styles.reviewsText, { color: textColor }]}>
              ({product.reviewCount} avis)
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={[styles.currentPrice, { color: accent }]}>
              {discountedPrice.toFixed(2)} €
            </Text>
            {product.discount && (
              <Text style={styles.originalPrice}>
                {product.price.toFixed(2)} €
              </Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Description</Text>
            <Text style={[styles.description, { color: textColor }]}>
              {product.description}
            </Text>
          </View>

          {/* Stock Info */}
          <View style={styles.stockSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Disponibilité
            </Text>
            <View style={styles.stockInfo}>
              <View
                style={[
                  styles.stockIndicator,
                  {
                    backgroundColor: product.stock > 0 ? '#4CAF50' : '#FF5252',
                  },
                ]}
              />
              <Text style={[styles.stockText, { color: textColor }]}>
                {product.stock > 0
                  ? `${product.stock} exemplaire${product.stock !== 1 ? 's' : ''} en stock`
                  : 'Rupture de stock'}
              </Text>
            </View>
          </View>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Caractéristiques
              </Text>
              <View style={styles.tagsList}>
                {product.tags.map((tag, index) => (
                  <View key={index} style={[styles.tag, { borderColor: accent }]}>
                    <Text style={[styles.tagText, { color: accent }]}>
                      # {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer with Add to Cart */}
      <View style={[styles.footer, { borderTopColor: accent }]}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            onPress={handleDecreaseQuantity}
            disabled={quantity <= 1}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={[styles.quantityText, { color: textColor }]}>
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={handleIncreaseQuantity}
            disabled={quantity >= product.stock}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            {
              backgroundColor: accent,
              opacity: product.stock > 0 ? 1 : 0.5,
            },
          ]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Text style={styles.addToCartText}>
            🛒 Ajouter au panier
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoSection: {
    paddingHorizontal: 16,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsText: {
    fontSize: 13,
    opacity: 0.6,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  descriptionSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.7,
  },
  stockSection: {
    gap: 8,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stockIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tagsSection: {
    gap: 8,
    marginBottom: 16,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

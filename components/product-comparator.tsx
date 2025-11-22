import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { Product } from '@/types/product';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ProductComparatorProps {
  visible: boolean;
  onClose: () => void;
  products: Product[];
}

/**
 * Comparateur de produits côte à côte
 * Affiche 2-3 produits avec toutes leurs caractéristiques
 */
export const ProductComparator: React.FC<ProductComparatorProps> = ({
  visible,
  onClose,
  products,
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const animRef = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(animRef, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animRef, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animRef]);

  const overlayOpacity = animRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const translateY = animRef.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  if (products.length < 2) {
    return null;
  }

  const specs = getComparisonSpecs(products);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
    >
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
            backgroundColor: '#000',
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Modal */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor,
            transform: [{ translateY }],
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>
              Comparaison
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: textColor }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Comparison Table */}
          <ScrollView
            style={styles.content}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.table}>
              {/* First Column - Specs */}
              <View style={styles.specColumn}>
                <View style={[styles.specHeader, { backgroundColor: '#f5f5f5' }]}>
                  <Text
                    style={[styles.specHeaderText, { color: textColor }]}
                  >
                    Caractéristiques
                  </Text>
                </View>
                {specs.map((spec, idx) => (
                  <View
                    key={spec.label}
                    style={[
                      styles.specCell,
                      { borderBottomColor: '#eee', borderBottomWidth: 1 },
                      idx % 2 === 0 && { backgroundColor: '#fafafa' },
                    ]}
                  >
                    <Text
                      style={[styles.specLabel, { color: textColor }]}
                      numberOfLines={1}
                    >
                      {spec.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Product Columns */}
              {products.map((product, colIdx) => (
                <View key={product.id} style={styles.productColumn}>
                  {/* Header with Product Info */}
                  <View style={[styles.productHeader, { backgroundColor: '#f5f5f5' }]}>
                    <Text
                      style={[styles.productName, { color: textColor }]}
                      numberOfLines={2}
                    >
                      {product.name}
                    </Text>
                    <Text
                      style={[styles.productPrice, { color: tintColor }]}
                    >
                      €{product.price}
                    </Text>
                    <Text style={[styles.productRating]}>
                      ⭐ {product.rating || 0}
                    </Text>
                  </View>

                  {/* Values */}
                  {specs.map((spec, idx) => (
                    <View
                      key={`${product.id}-${spec.key}`}
                      style={[
                        styles.valueCell,
                        { borderBottomColor: '#eee', borderBottomWidth: 1 },
                        idx % 2 === 0 && { backgroundColor: '#fafafa' },
                      ]}
                    >
                      <ComparisonValue
                        value={spec.getValue(product)}
                        key={spec.key}
                        textColor={textColor}
                        tintColor={tintColor}
                      />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: tintColor }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

interface ComparisonValueProps {
  value: any;
  textColor: string;
  tintColor: string;
}

const ComparisonValue: React.FC<ComparisonValueProps> = ({
  value,
  textColor,
  tintColor,
}) => {
  if (value === null || value === undefined) {
    return <Text style={[styles.value, { color: '#999' }]}>—</Text>;
  }

  if (typeof value === 'boolean') {
    return (
      <Text style={[styles.value, { color: value ? tintColor : '#999' }]}>
        {value ? '✓' : '✕'}
      </Text>
    );
  }

  if (Array.isArray(value)) {
    return (
      <Text style={[styles.value, { color: textColor }]} numberOfLines={2}>
        {value.join(', ')}
      </Text>
    );
  }

  return (
    <Text style={[styles.value, { color: textColor }]} numberOfLines={2}>
      {String(value)}
    </Text>
  );
};

// Helper function to define comparison specs
function getComparisonSpecs(
  products: Product[]
): Array<{ label: string; key: string; getValue: (p: Product) => any }> {
  return [
    { label: 'Prix', key: 'price', getValue: p => `€${p.price}` },
    {
      label: 'Remise',
      key: 'discount',
      getValue: p => (p.discount ? `-${p.discount}%` : 'Aucune'),
    },
    {
      label: 'Prix final',
      key: 'finalPrice',
      getValue: p =>
        `€${(p.price * (1 - (p.discount || 0) / 100)).toFixed(2)}`,
    },
    { label: 'Note', key: 'rating', getValue: p => `${p.rating || 0}/5` },
    {
      label: 'En stock',
      key: 'inStock',
      getValue: p => p.inStock ? 'Oui' : 'Non',
    },
    {
      label: 'Catégorie',
      key: 'category',
      getValue: p => getCategoryLabel(p.category),
    },
    {
      label: 'Tags',
      key: 'tags',
      getValue: p => p.tags?.join(', ') || 'Aucun',
    },
    {
      label: 'Nouveau',
      key: 'isNew',
      getValue: p => p.isNew ? 'Oui' : 'Non',
    },
    { label: 'Marque', key: 'brand', getValue: p => p.brand || '—' },
    {
      label: 'Description',
      key: 'description',
      getValue: p => p.description || '—',
    },
  ];
}

function getCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    footwear: '👟 Chaussures',
    accessories: '🎒 Accessoires',
    apparel: '👕 Vêtements',
    sports: '⚽ Sports',
  };
  return labels[cat] || cat;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    zIndex: 2,
  },
  safeArea: {
    flex: 1,
    display: 'flex',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  table: {
    flexDirection: 'row',
  },
  specColumn: {
    minWidth: 120,
  },
  productColumn: {
    minWidth: 140,
    paddingHorizontal: 8,
  },
  specHeader: {
    height: 80,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  specHeaderText: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  productHeader: {
    height: 80,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productRating: {
    fontSize: 11,
  },
  specCell: {
    minHeight: 50,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  specLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  valueCell: {
    minHeight: 50,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

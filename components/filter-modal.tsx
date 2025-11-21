import React, { useCallback, useMemo, useState } from 'react';
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
import { useThemeColor } from '@/hooks/use-theme-color';
import { ProductCategory } from '@/types/product';

export interface FilterOptions {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  categories: ProductCategory[];
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'newest';
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: Partial<FilterOptions>;
  maxPrice?: number;
}

const PRICE_STEP = 10;
const RATING_STEPS = [1, 2, 3, 4, 5];
const SORT_OPTIONS = [
  { key: 'price-low', label: 'Prix: bas → haut' },
  { key: 'price-high', label: 'Prix: haut → bas' },
  { key: 'rating', label: 'Meilleure note' },
  { key: 'newest', label: 'Nouveautés' },
] as const;

const CATEGORIES: ProductCategory[] = [
  'footwear',
  'accessories',
  'apparel',
  'sports',
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
  maxPrice = 500,
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || 0);
  const [maxPriceLocal, setMaxPriceLocal] = useState(
    currentFilters.maxPrice || maxPrice
  );
  const [minRating, setMinRating] = useState(currentFilters.minRating || 0);
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >(currentFilters.categories || []);
  const [selectedSort, setSelectedSort] = useState<string>(
    currentFilters.sortBy || 'newest'
  );

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

  const toggleCategory = useCallback((cat: ProductCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }, []);

  const handleReset = useCallback(() => {
    setMinPrice(0);
    setMaxPriceLocal(maxPrice);
    setMinRating(0);
    setSelectedCategories([]);
    setSelectedSort('newest');
  }, [maxPrice]);

  const handleApply = useCallback(() => {
    onApply({
      minPrice,
      maxPrice: maxPriceLocal,
      minRating,
      categories: selectedCategories,
      sortBy: selectedSort as any,
    });
    onClose();
  }, [minPrice, maxPriceLocal, minRating, selectedCategories, selectedSort, onApply, onClose]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (minPrice > 0) count++;
    if (maxPriceLocal < maxPrice) count++;
    if (minRating > 0) count++;
    if (selectedCategories.length > 0) count++;
    if (selectedSort !== 'newest') count++;
    return count;
  }, [minPrice, maxPriceLocal, minRating, selectedCategories, selectedSort, maxPrice]);

  const overlayOpacity = animRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const translateY = animRef.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

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

      {/* Modal Content */}
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
              Filtres avancés
            </Text>
            {activeFiltersCount > 0 && (
              <View style={[styles.badge, { backgroundColor: tintColor }]}>
                <Text style={styles.badgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* PRICE RANGE */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Prix: €{minPrice} - €{maxPriceLocal}
              </Text>
              <View style={styles.priceSliders}>
                <View style={styles.sliderGroup}>
                  <Text style={[styles.label, { color: textColor }]}>Min</Text>
                  <View style={styles.priceInputContainer}>
                    <TouchableOpacity
                      style={[
                        styles.priceButton,
                        { borderColor: tintColor, borderWidth: 1 },
                      ]}
                      onPress={() => setMinPrice(Math.max(0, minPrice - PRICE_STEP))}
                    >
                      <Text style={[styles.buttonText, { color: tintColor }]}>−</Text>
                    </TouchableOpacity>
                    <Text style={[styles.priceValue, { color: textColor }]}>
                      €{minPrice}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.priceButton,
                        { borderColor: tintColor, borderWidth: 1 },
                      ]}
                      onPress={() =>
                        setMinPrice(Math.min(maxPriceLocal - 10, minPrice + PRICE_STEP))
                      }
                    >
                      <Text style={[styles.buttonText, { color: tintColor }]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.sliderGroup}>
                  <Text style={[styles.label, { color: textColor }]}>Max</Text>
                  <View style={styles.priceInputContainer}>
                    <TouchableOpacity
                      style={[
                        styles.priceButton,
                        { borderColor: tintColor, borderWidth: 1 },
                      ]}
                      onPress={() =>
                        setMaxPriceLocal(Math.max(minPrice + 10, maxPriceLocal - PRICE_STEP))
                      }
                    >
                      <Text style={[styles.buttonText, { color: tintColor }]}>−</Text>
                    </TouchableOpacity>
                    <Text style={[styles.priceValue, { color: textColor }]}>
                      €{maxPriceLocal}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.priceButton,
                        { borderColor: tintColor, borderWidth: 1 },
                      ]}
                      onPress={() =>
                        setMaxPriceLocal(Math.min(maxPrice, maxPriceLocal + PRICE_STEP))
                      }
                    >
                      <Text style={[styles.buttonText, { color: tintColor }]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* RATING */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Note minimale
              </Text>
              <View style={styles.ratingButtons}>
                {RATING_STEPS.map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      {
                        backgroundColor:
                          minRating === rating
                            ? tintColor
                            : 'transparent',
                        borderColor: tintColor,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => setMinRating(minRating === rating ? 0 : rating)}
                  >
                    <Text
                      style={[
                        styles.ratingText,
                        {
                          color: minRating === rating ? '#fff' : textColor,
                        },
                      ]}
                    >
                      {rating}⭐
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* CATEGORIES */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Catégories
              </Text>
              <View style={styles.categoryButtons}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: selectedCategories.includes(cat)
                          ? tintColor
                          : 'transparent',
                        borderColor: tintColor,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => toggleCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        {
                          color: selectedCategories.includes(cat)
                            ? '#fff'
                            : textColor,
                        },
                      ]}
                    >
                      {cat === 'footwear' && '👟 Chaussures'}
                      {cat === 'accessories' && '🎒 Accessoires'}
                      {cat === 'apparel' && '👕 Vêtements'}
                      {cat === 'sports' && '⚽ Sports'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* SORT */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Trier par
              </Text>
              <View style={styles.sortButtons}>
                {SORT_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.sortButton,
                      {
                        backgroundColor:
                          selectedSort === opt.key
                            ? tintColor
                            : 'transparent',
                        borderColor: tintColor,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => setSelectedSort(opt.key)}
                  >
                    <Text
                      style={[
                        styles.sortText,
                        {
                          color: selectedSort === opt.key ? '#fff' : textColor,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.buttonSecondary,
                { borderColor: tintColor, borderWidth: 1 },
              ]}
              onPress={handleReset}
            >
              <Text style={[styles.buttonSecondaryText, { color: tintColor }]}>
                Réinitialiser
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonPrimary, { backgroundColor: tintColor }]}
              onPress={handleApply}
            >
              <Text style={styles.buttonPrimaryText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

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
    fontSize: 20,
    fontWeight: 'bold',
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  priceSliders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  sliderGroup: {
    flex: 1,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceValue: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    fontWeight: '600',
    fontSize: 12,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontWeight: '600',
    fontSize: 13,
  },
  sortButtons: {
    gap: 8,
  },
  sortButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortText: {
    fontWeight: '500',
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  buttonSecondary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    fontWeight: '600',
    fontSize: 14,
  },
  buttonPrimary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { CartScreen } from '@/components/cart-screen';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function TabTwoScreen() {
  const [activeTab, setActiveTab] = useState<'cart' | 'favorites'>('cart');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Tab Navigation */}
      <View style={[styles.tabHeader, { borderBottomColor: accent }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'cart' && [styles.tabActive, { borderBottomColor: accent }],
          ]}
          onPress={() => setActiveTab('cart')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'cart' ? accent : textColor }]}>
            🛒 Panier
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'favorites' && [styles.tabActive, { borderBottomColor: accent }],
          ]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text
            style={[styles.tabText, { color: activeTab === 'favorites' ? accent : textColor }]}
          >
            ❤️ Favoris
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'cart' ? (
          <CartScreen onCheckout={() => alert('Checkout process would start here')} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={[styles.placeholderIcon]}>❤️</Text>
            <Text style={[styles.placeholderText, { color: textColor }]}>
              Vos favoris
            </Text>
            <Text style={[styles.placeholderSubtext, { color: textColor }]}>
              Les produits que vous aimez particulièrement apparaîtront ici
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  placeholderIcon: {
    fontSize: 64,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholderSubtext: {
    fontSize: 13,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

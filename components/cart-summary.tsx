import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useShoppingContext } from '@/contexts/shopping-context';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CartSummaryProps {
  onPress?: () => void;
}

export function CartSummary({ onPress }: CartSummaryProps) {
  const { cartCount, cartTotal } = useShoppingContext();
  const accent = useThemeColor({}, 'tint');

  if (cartCount === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: accent }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.label}>Panier</Text>
        <Text style={styles.count}>{cartCount} article{cartCount !== 1 ? 's' : ''}</Text>
      </View>
      <Text style={styles.total}>{cartTotal.toFixed(2)} €</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  content: {
    gap: 2,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
  },
  count: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  total: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

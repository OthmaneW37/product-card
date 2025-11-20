import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ListRenderItem,
} from 'react-native';
import { CartItem } from '@/types/product';
import { useShoppingContext } from '@/contexts/shopping-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';

interface CartScreenProps {
  onCheckout?: () => void;
}

export function CartScreen({ onCheckout }: CartScreenProps) {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart } =
    useShoppingContext();
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'tint');

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateCartQuantity(productId, quantity);
    Haptics.selectionAsync();
  };

  const renderCartItem: ListRenderItem<CartItem> = ({ item }) => (
    <View style={[styles.cartItem, { borderColor: accent }]}>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, { color: textColor }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.itemPrice, { color: accent }]}>
          {(item.price * item.quantity).toFixed(2)} € (x{item.quantity})
        </Text>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={[styles.qtyText, { color: textColor }]}>
            {item.quantity}
          </Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <Text style={styles.removeIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const cartEmpty = cart.length === 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Mon Panier</Text>
        {!cartEmpty && (
          <Text style={[styles.itemCount, { color: textColor }]}>
            {cart.length} article{cart.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {cartEmpty ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={[styles.emptyText, { color: textColor }]}>
            Votre panier est vide
          </Text>
          <Text style={[styles.emptySubtext, { color: textColor }]}>
            Commencez à ajouter des produits !
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            scrollEnabled={true}
            style={styles.list}
          />

          {/* Summary */}
          <View style={[styles.summary, { borderTopColor: accent }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: textColor }]}>
                Sous-total
              </Text>
              <Text style={[styles.summaryValue, { color: textColor }]}>
                {cartTotal.toFixed(2)} €
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: textColor }]}>
                Frais de port
              </Text>
              <Text style={[styles.summaryValue, { color: textColor }]}>
                Gratuit
              </Text>
            </View>

            <View style={[styles.totalRow, { backgroundColor: accent }]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {cartTotal.toFixed(2)} €
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.checkoutButton, { backgroundColor: accent }]}
                onPress={onCheckout}
              >
                <Text style={styles.checkoutText}>💳 Passer la commande</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.clearButton, { borderColor: accent }]}
                onPress={() => {
                  clearCart();
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                }}
              >
                <Text style={[styles.clearButtonText, { color: accent }]}>
                  Vider le panier
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 6,
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  qtyButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  removeIcon: {
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 13,
    opacity: 0.6,
  },
  summary: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    gap: 8,
    marginTop: 8,
  },
  checkoutButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

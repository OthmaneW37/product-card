import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, FavoriteItem, Product } from '@/types/product';

interface ShoppingContextType {
  cart: CartItem[];
  favorites: FavoriteItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
}

export const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prevFavorites) => {
      const isFav = prevFavorites.some((fav) => fav.productId === productId);
      if (isFav) {
        return prevFavorites.filter((fav) => fav.productId !== productId);
      }
      return [...prevFavorites, { productId, addedAt: Date.now() }];
    });
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.some((fav) => fav.productId === productId),
    [favorites]
  );

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const value: ShoppingContextType = {
    cart,
    favorites,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleFavorite,
    isFavorite,
    cartTotal,
    cartCount,
  };

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>;
}

export function useShoppingContext() {
  const context = React.useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShoppingContext must be used within ShoppingProvider');
  }
  return context;
}

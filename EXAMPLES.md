# 💡 Exemples d'Utilisation - Application E-Commerce

## 1. Afficher la Liste des Produits Phares

```typescript
import { FeaturedProducts } from '@/components/featured-products';
import { Product } from '@/types/product';
import { useState } from 'react';

export default function HomeScreen() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductPress = (product: Product) => {
    console.log(`Selected: ${product.title}`);
    setSelectedProduct(product);
    // Afficher modal détail
  };

  return (
    <View style={{ flex: 1 }}>
      <FeaturedProducts onProductPress={handleProductPress} />
    </View>
  );
}
```

## 2. Utiliser le Shopping Context

```typescript
import { useShoppingContext } from '@/contexts/shopping-context';
import { Product } from '@/types/product';
import { TouchableOpacity, Text } from 'react-native';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, cart, cartTotal } = useShoppingContext();

  const handleAddToCart = () => {
    addToCart(product, 1);
    alert(`${product.title} ajouté au panier!`);
    console.log(`Cart total: ${cartTotal}€`);
    console.log(`Items in cart: ${cart.length}`);
  };

  return (
    <TouchableOpacity onPress={handleAddToCart}>
      <Text>Ajouter au panier</Text>
    </TouchableOpacity>
  );
}
```

## 3. Gestion des Favoris

```typescript
import { useShoppingContext } from '@/contexts/shopping-context';
import { TouchableOpacity, Text } from 'react-native';

export function FavoriteButton({ productId }: { productId: string }) {
  const { toggleFavorite, isFavorite } = useShoppingContext();
  const favorited = isFavorite(productId);

  return (
    <TouchableOpacity onPress={() => toggleFavorite(productId)}>
      <Text>{favorited ? '❤️' : '🤍'}</Text>
    </TouchableOpacity>
  );
}
```

## 4. Afficher le Panier avec Résumé

```typescript
import { CartScreen } from '@/components/cart-screen';
import { CartSummary } from '@/components/cart-summary';
import { View, Modal, useState } from 'react-native';

export default function ShoppingApp() {
  const [cartVisible, setCartVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* Main content */}
      <FeaturedProducts />

      {/* Cart summary bar */}
      <CartSummary onPress={() => setCartVisible(true)} />

      {/* Cart modal */}
      <Modal
        visible={cartVisible}
        animationType="slide"
        onRequestClose={() => setCartVisible(false)}
      >
        <CartScreen onCheckout={() => alert('Passer la commande')} />
      </Modal>
    </View>
  );
}
```

## 5. Personnaliser les Produits

```typescript
import { FEATURED_PRODUCTS } from '@/constants/products';
import { Product } from '@/types/product';

// Ajouter un nouveau produit
const newProduct: Product = {
  id: '11',
  title: 'Montre Connectée',
  price: 199.99,
  image: 'https://images.unsplash.com/...',
  description: 'Montre intelligente avec suivi fitness',
  category: 'accessories',
  rating: 4.7,
  reviewCount: 120,
  stock: 25,
  discount: 10,
  isNew: true,
  tags: ['smartwatch', 'fitness', 'tech'],
};

// Filtrer les produits en solde
const onSaleProducts = FEATURED_PRODUCTS.filter(p => p.discount && p.discount > 0);

// Trouver un produit par ID
const findProduct = (productId: string) => 
  FEATURED_PRODUCTS.find(p => p.id === productId);

// Obtenir les produits "Nouveau"
const newProducts = FEATURED_PRODUCTS.filter(p => p.isNew);

// Produits d'une catégorie spécifique
const shoes = FEATURED_PRODUCTS.filter(p => p.category === 'shoes');
```

## 6. Hook de Filtrage Personnalisé

```typescript
import { useProductsFilter } from '@/hooks/use-products-filter';
import { FEATURED_PRODUCTS } from '@/constants/products';

export function ProductFiltering() {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    stats,
    resetFilters,
  } = useProductsFilter({
    products: FEATURED_PRODUCTS,
    initialCategory: 'shoes',
  });

  return (
    <View>
      {/* Filter UI */}
      <TextInput
        placeholder="Rechercher..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Show stats */}
      <Text>
        {stats.total} produits | Note moyenne: {stats.avgRating} ⭐
      </Text>
      <Text>Prix moyen: {stats.avgPrice}€ | {stats.inStock} en stock</Text>

      {/* Display filtered products */}
      <FlatList
        data={products}
        keyExtractor={p => p.id}
        renderItem={({ item }) => <ProductCard {...item} />}
      />

      {/* Reset button */}
      <TouchableOpacity onPress={resetFilters}>
        <Text>Réinitialiser filtres</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 7. Gestion du Panier Avancée

```typescript
import { useShoppingContext } from '@/contexts/shopping-context';

export function AdvancedCartManagement() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal } =
    useShoppingContext();

  // Augmenter la quantité
  const increaseQuantity = (productId: string) => {
    const item = cart.find(p => p.id === productId);
    if (item) {
      updateCartQuantity(productId, item.quantity + 1);
    }
  };

  // Diminuer la quantité
  const decreaseQuantity = (productId: string) => {
    const item = cart.find(p => p.id === productId);
    if (item && item.quantity > 1) {
      updateCartQuantity(productId, item.quantity - 1);
    }
  };

  // Calculer les économies
  const calculateSavings = () => {
    return cart.reduce((total, item) => {
      const discount = item.discount || 0;
      return total + (item.price * (discount / 100) * item.quantity);
    }, 0);
  };

  // Obtenir le montant avant réduction
  const originalTotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  return (
    <View>
      <Text>Montant original: {originalTotal.toFixed(2)}€</Text>
      <Text>Économies: {calculateSavings().toFixed(2)}€</Text>
      <Text>Total à payer: {cartTotal.toFixed(2)}€</Text>
    </View>
  );
}
```

## 8. Modal Détail Produit

```typescript
import { ProductDetail } from '@/components/product-detail';
import { Product } from '@/types/product';
import { Modal, View, useState } from 'react-native';

export function ProductDetailExample() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleCloseDetail = () => {
    setModalVisible(false);
    // Attendre l'animation avant reset
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseDetail}
        presentationStyle="pageSheet"
      >
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={handleCloseDetail}
            onAddToCart={() => alert('Produit ajouté!')}
          />
        )}
      </Modal>
    </View>
  );
}
```

## 9. Haptic Feedback Custom

```typescript
import * as Haptics from 'expo-haptics';
import { TouchableOpacity } from 'react-native';

export function HapticExample() {
  const performHaptic = async (type: string) => {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        break;
      case 'warning':
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );
        break;
      case 'selection':
        await Haptics.selectionAsync();
        break;
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <TouchableOpacity onPress={() => performHaptic('light')}>
        <Text>Light Tap</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => performHaptic('success')}>
        <Text>Success Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 10. Recherche et Filtrage Dynamiques

```typescript
import { useState, useMemo } from 'react';
import { FEATURED_PRODUCTS, CATEGORIES } from '@/constants/products';
import { Product } from '@/types/product';

export function DynamicSearch() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);

  const filteredProducts = useMemo(() => {
    return FEATURED_PRODUCTS.filter(product => {
      // Filtrer par catégorie
      const categoryMatch =
        selectedCategories.includes('all') ||
        selectedCategories.includes(product.category);

      // Filtrer par recherche
      const searchMatch =
        searchText === '' ||
        product.title.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase());

      // Filtrer par prix
      const priceMatch = product.price >= minPrice && product.price <= maxPrice;

      return categoryMatch && searchMatch && priceMatch;
    });
  }, [searchText, selectedCategories, minPrice, maxPrice]);

  return (
    <View>
      <TextInput
        placeholder="Rechercher..."
        value={searchText}
        onChangeText={setSearchText}
      />
      
      {/* Category filters */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => {
              if (selectedCategories.includes(cat.id)) {
                setSelectedCategories(
                  selectedCategories.filter(c => c !== cat.id)
                );
              } else {
                setSelectedCategories([...selectedCategories, cat.id]);
              }
            }}
          >
            <Text>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results */}
      <Text>
        {filteredProducts.length} produits trouvés
      </Text>
      <FlatList
        data={filteredProducts}
        keyExtractor={p => p.id}
        renderItem={({ item }) => <ProductCard {...item} />}
      />
    </View>
  );
}
```

---

**Ces exemples couvrent les cas d'usage principaux de l'application E-Commerce. Adaptez-les à vos besoins!**

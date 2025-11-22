# 🐛 Troubleshooting Guide

## Problèmes Courants & Solutions

---

## 1. Erreurs React Hooks

### ❌ "React Hook useXxx called conditionally"

**Cause:** Hook appelé dans une condition ou boucle

```typescript
// ❌ MAUVAIS
if (condition) {
  const { data } = useProductsFilter();
}

// ✅ BON
const { data } = useProductsFilter();
if (condition) {
  // Utiliser data
}
```

**Solution:** Toujours appeler les hooks au top level du composant

---

### ❌ "Missing dependency" Warning

**Cause:** Dependency array incomplet dans useEffect/useMemo

```typescript
// ❌ MAUVAIS
const handler = () => {
  console.log(value); // value change mais pas en dépendance
};
useEffect(() => {
  listener.on('event', handler);
}, []); // Oubli handler dans dépendances

// ✅ BON
const handler = useCallback(() => {
  console.log(value);
}, [value]);
useEffect(() => {
  listener.on('event', handler);
}, [handler]);
```

**Solution:** Ajouter toutes les dépendances ou utiliser useCallback

---

## 2. Problèmes de Performance

### ❌ FlatList slow avec gros volumes

**Cause:** Trop de renders ou calculs lourds

```typescript
// ❌ MAUVAIS
<FlatList
  data={10000 items}
  renderItem={({ item }) => {
    const filtered = largeArray.filter(...); // Recalculé chaque render!
    return <ProductCard product={item} />;
  }}
/>

// ✅ BON
const filtered = useMemo(() => {
  return largeArray.filter(...);
}, [largeArray]);

<FlatList
  data={10000 items}
  renderItem={({ item }) => <ProductCard product={item} />}
  maxToRenderPerBatch={3}
  removeClippedSubviews={true}
  initialNumToRender={10}
/>
```

**Solution:** Utiliser maxToRenderPerBatch, removeClippedSubviews, useMemo

---

### ❌ Animations laggy/jank

**Cause:** useNativeDriver: false ou calculs lourds

```typescript
// ❌ MAUVAIS
Animated.timing(ref, {
  toValue: 1,
  duration: 300,
  useNativeDriver: false, // ❌ CPU render!
}).start();

// ✅ BON
Animated.timing(ref, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // ✅ GPU render!
}).start();
```

**Solution:** Toujours utiliser useNativeDriver: true pour animations principales

---

## 3. Problèmes de Navigation

### ❌ "Prevent default" warning

**Cause:** Navigation while rendering

```typescript
// ❌ MAUVAIS
const handlePress = () => {
  navigation.navigate('Details'); // Causé dans render
};

const [render, setRender] = useState(false);
useEffect(() => {
  if (shouldNavigate) {
    navigation.navigate('Details'); // ❌ Bad timing
  }
}, [shouldNavigate]);

// ✅ BON
const handlePress = () => {
  navigation.navigate('Details'); // OK
};

useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
    }
  });
  return unsubscribe;
}, [hasUnsavedChanges]);
```

**Solution:** Naviguer seulement dans handlers d'événements

---

### ❌ Modal not dismissing

**Cause:** State pas mis à jour ou layout cycle

```typescript
// ❌ MAUVAIS
<Modal visible={visible} onRequestClose={() => setVisible(false)}>
  {/* Peut ignorer onRequestClose sur certains devices */}
</Modal>

// ✅ BON
<Modal 
  visible={visible} 
  onRequestClose={() => setVisible(false)}
  animationType="slide"
  transparent={true}
>
  <TouchableOpacity 
    onPress={() => setVisible(false)}
    style={styles.backdrop}
  />
</Modal>
```

**Solution:** Ajouter backdrop touchable et onRequestClose

---

## 4. Problèmes TypeScript

### ❌ "Cannot find module" errors

**Cause:** Path aliases mal configurés

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],          // ❌ Si structure est différente
      "@/*": ["./*"],              // ✅ Correct pour root
      "@/components/*": ["./components/*"]
    }
  }
}

// ❌ MAUVAIS import
import { ProductCard } from 'components/product-card';

// ✅ BON import
import { ProductCard } from '@/components/product-card';
```

**Solution:** Vérifier tsconfig.json et paths exacts

---

### ❌ "Type 'never'" errors

**Cause:** État incomplet ou type narrow failed

```typescript
// ❌ MAUVAIS
const [state, setState] = useState(); // type: any
setState(null); // Sera type: never

// ✅ BON
const [state, setState] = useState<Product | null>(null);
setState(null); // OK

// ❌ MAUVAIS
const value = array[0]; // undefined?
const name = value.name; // 🔴 Peut planter

// ✅ BON
const value = array[0];
if (value) {
  const name = value.name; // OK
}
```

**Solution:** Toujours typer l'état initial et checker les nullables

---

## 5. Problèmes d'Affichage

### ❌ Text cutoff or wrapped incorrectly

**Cause:** Pas de numberOfLines ou flexShrink

```typescript
// ❌ MAUVAIS
<Text style={{ flex: 1 }}>
  Très long texte qui peut wrap weird
</Text>

// ✅ BON
<Text 
  numberOfLines={2}
  style={{ flex: 1 }}
  ellipsizeMode="tail"
>
  Très long texte qui sera coupé proprement
</Text>
```

**Solution:** Utiliser numberOfLines et ellipsizeMode

---

### ❌ Dark mode colors wrong

**Cause:** useColorScheme hook pas appelé en haut de composant

```typescript
// ❌ MAUVAIS
if (condition) {
  const color = useThemeColor({}, 'text'); // Conditional hook!
}

// ✅ BON
const textColor = useThemeColor({}, 'text');
if (condition) {
  // Utiliser textColor
}
```

**Solution:** Appeler useThemeColor au top level

---

## 6. Problèmes de Stockage

### ❌ AsyncStorage returns null

**Cause:** Données pas sauvegardées ou key différente

```typescript
// ❌ MAUVAIS
await AsyncStorage.setItem('cart', JSON.stringify(data));
const loaded = await AsyncStorage.getItem('CART'); // Key différente!

// ✅ BON
const CART_KEY = '@app_cart'; // Constante
await AsyncStorage.setItem(CART_KEY, JSON.stringify(data));
const loaded = await AsyncStorage.getItem(CART_KEY); // Same key!
```

**Solution:** Utiliser constantes pour les clés

---

### ❌ Storage persists but data corrupted

**Cause:** JSON.stringify/parse issues

```typescript
// ❌ MAUVAIS
const data = JSON.parse(JSON.stringify(obj)); // Perd les functions!

// ✅ BON
try {
  const serialized = JSON.stringify(data);
  await AsyncStorage.setItem(CART_KEY, serialized);
  
  const raw = await AsyncStorage.getItem(CART_KEY);
  const restored = raw ? JSON.parse(raw) : null;
} catch (error) {
  console.error('Storage error:', error);
}
```

**Solution:** Ajouter try/catch et validation

---

## 7. Problèmes d'API

### ❌ API calls fail silently

**Cause:** Pas d'error handling

```typescript
// ❌ MAUVAIS
const data = await fetch(url).then(r => r.json());

// ✅ BON
try {
  const response = await fetch(url, {
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  // Afficher toast error
  throw error;
}
```

**Solution:** Error handling et timeout approprié

---

## 8. Problèmes de Mémoire

### ❌ Memory leak warnings

**Cause:** Subscriptions pas nettoyées

```typescript
// ❌ MAUVAIS
useEffect(() => {
  const subscription = eventEmitter.subscribe(handler);
  // Oubli de cleanup!
}, []);

// ✅ BON
useEffect(() => {
  const subscription = eventEmitter.subscribe(handler);
  return () => subscription.unsubscribe(); // ✅ Cleanup!
}, []);
```

**Solution:** Retourner cleanup function

---

## 9. Problèmes Expo

### ❌ "Module not found" sur Expo

**Cause:** Module pas disponible sur Expo

```typescript
// ❌ MAUVAIS - pas sur Expo
import { NativeModules } from 'react-native';
const { CustomModule } = NativeModules;

// ✅ BON - utiliser expo module
import * as SecureStore from 'expo-secure-store';
```

**Solution:** Utiliser uniquement modules Expo supportés

---

### ❌ Build fails on EAS

**Cause:** package.json or app.json mal formé

```json
// app.json
{
  "expo": {
    "name": "product-card",
    "slug": "product-card",
    "version": "1.0.0",
    "plugins": [
      // ✅ Déclarer plugins utilisés
    ]
  }
}
```

**Solution:** Vérifier app.json syntax et version format

---

## 10. Problèmes de Déploiement

### ❌ "Bundle size too large"

**Cause:** Dépendances non utilisées ou code non optimisé

```bash
# Vérifier taille
expo export

# Optimizer
npm prune --production
npx expo-optimize

# Analyser bundle
npx react-native bundle --platform android/ios --dev false
```

**Solution:** Nettoyer dépendances, lazy load code

---

## 🆘 Debug Tips

### Console Logging
```typescript
console.log('Value:', value);
console.error('Error:', error);
console.warn('Warning:', issue);
console.time('operation');
// ... code
console.timeEnd('operation');
```

### React DevTools
```typescript
// Connecter depuis Expo Go
// Appuyer sur "?" dans Expo Go menu
// Choisir "Debug remote JS"
```

### Network Debugging
```typescript
// Voir requêtes réseau
// DevTools Network tab dans browser

// Ou utiliser:
import { InteractionManager } from 'react-native';
InteractionManager.runAfterInteractions(() => {
  // Code après interactions UI
});
```

### Performance Profiler
```typescript
// DevTools Profiler tab
// Recorder les rendus et voir les slow components
```

---

## 📋 Checklist Debugging

Avant de reporter un bug:
- [ ] Vérifier console.log pour errors
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Restart Expo/Emulator
- [ ] Vérifier TypeScript errors
- [ ] Vérifier Network tab
- [ ] Vérifier React DevTools
- [ ] Réduire au minimal reproducible case
- [ ] Vérifier sur device physique

---

## 🔗 Resources

- [React Debugging](https://react.dev/learn/react-developer-tools)
- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [Expo FAQ](https://docs.expo.dev/faq)
- [React Native Common Issues](https://reactnative.dev/docs/troubleshooting)

---

Dernière mise à jour: **22 November 2025**

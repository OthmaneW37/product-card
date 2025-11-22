# 📌 QUICK START GUIDE

## Fichiers Principaux

### 🏠 Composants Clés
| Fichier | Usage | Type |
|---------|-------|------|
| `ProductCard` | Affiche un produit | Component |
| `FeaturedProducts` | Liste + Filtrage | Component |
| `ProductDetail` | Modal détail produit | Component |
| `CartScreen` | Gestion panier | Component |
| `WishlistScreen` | Page favoris | Component |
| `FilterModal` | Filtres avancés | Component |
| `ProductComparator` | Comparaison produits | Component |
| `RatingModal` | Avis produits | Component |
| `ToastContainer` | Notifications | Component |

### 🪝 Hooks Essentiels
| Hook | Purpose |
|------|---------|
| `useShoppingContext()` | Accéder au panier global |
| `useProductsFilter()` | Filtrer/Trier produits |
| `useToast()` | Afficher notifications |
| `useThemeColor()` | Couleurs du thème |
| `useSearchHistory()` | Historique recherche |

---

## 🚀 Utilisation Rapide

### 1. Ajouter au Panier
```typescript
const { addToCart } = useShoppingContext();
addToCart(product, 1);
```

### 2. Afficher Toast
```typescript
const { add } = useToast();
add("Succès!", "success");
```

### 3. Filtrer Produits
```typescript
const { filtered, setCategory } = useProductsFilter();
setCategory('footwear');
```

### 4. Ouvrir Filter Modal
```typescript
const [filterVisible, setFilterVisible] = useState(false);
<FilterModal 
  visible={filterVisible}
  onApply={applyFilters}
  onClose={() => setFilterVisible(false)}
/>
```

---

## 📂 Structure de Dossiers

```
components/          ← Composants UI
hooks/              ← Hooks personnalisés
contexts/           ← État global (Context)
services/           ← Logique métier
types/              ← Interfaces TypeScript
constants/          ← Données + Config
```

---

## 🎨 Thème & Couleurs

```typescript
// Utiliser les couleurs du thème
const textColor = useThemeColor({}, 'text');
const tintColor = useThemeColor({}, 'tint');
const bgColor = useThemeColor({}, 'background');

<Text style={{ color: textColor }}>Texte</Text>
```

---

## ⚡ Performance Tips

```typescript
✅ Utiliser FlatList pour listes longues
✅ Ajouter useMemo pour calculs lourds
✅ useCallback pour handlers
✅ useNativeDriver: true pour animations
✅ React.memo pour composants purs
```

---

## 🐛 Debug

```bash
# Console errors
console.log('Debug:', value);

# React DevTools
expo start -> ? -> Debug remote JS

# Network requests
DevTools -> Network tab

# Performance
DevTools -> Profiler tab
```

---

## 📚 Documentation

| Fichier | Contenu |
|---------|---------|
| `NEW_FEATURES.md` | Détails des 7 features |
| `DEPLOYMENT_CHECKLIST.md` | Checklist avant production |
| `TROUBLESHOOTING.md` | Solutions aux problèmes |
| `ARCHITECTURE.md` | Patterns et structure |
| `SESSION_3_SUMMARY.md` | Résumé complet |

---

## ✅ Checklist de Départ

- [ ] Cloner le repo
- [ ] `npm install`
- [ ] `expo start`
- [ ] Tester sur iOS/Android
- [ ] Lire NEW_FEATURES.md
- [ ] Customiser les données
- [ ] Intégrer votre API
- [ ] Configurer environnement de prod

---

## 🎯 Points Clés à Retenir

1. **State Management:** Utiliser `useShoppingContext()`
2. **Notifications:** `useToast()` pour feedback
3. **Filtrage:** `useProductsFilter()` pour critères
4. **Animations:** Toujours `useNativeDriver: true`
5. **Performance:** FlatList + useMemo pour listes
6. **Thème:** `useThemeColor()` pour couleurs
7. **Erreurs:** Vérifier TROUBLESHOOTING.md

---

## 📞 Besoin d'Aide?

1. Vérifier `TROUBLESHOOTING.md`
2. Consulter `NEW_FEATURES.md` pour usage
3. Analyser console.log + DevTools
4. Relire le pattern dans le code
5. Check documentation officielle

---

## 🎁 Fichiers Gratuits Inclus

- ✅ 13 composants production-ready
- ✅ 8 hooks réutilisables
- ✅ 1 système de state (Context)
- ✅ 1 service de storage
- ✅ 6 fichiers de documentation
- ✅ 10 données de démo

---

## 🚀 Prêt à Déployer?

```bash
# Build
expo build:android
expo build:ios

# Submit
expo submit:android
expo submit:ios

# Voir DEPLOYMENT_CHECKLIST.md avant!
```

---

Version: 1.0.0
Status: ✨ Production Ready ✨
Date: 22 November 2025

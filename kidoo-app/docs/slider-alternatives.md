# Alternatives de bibliothèques pour jauge verticale de luminosité

Ce document présente différentes alternatives pour créer une jauge verticale similaire au réglage du flash.

## 📚 Bibliothèques recommandées

### 1. **rn-vertical-slider** ⭐ Recommandé
- **npm**: `npm install rn-vertical-slider`
- **GitHub**: https://github.com/jeanregisser/rn-vertical-slider
- **Avantages**:
  - ✅ Entièrement JavaScript (pas de code natif)
  - ✅ Spécialement conçu pour les sliders verticaux
  - ✅ Simple et léger
  - ✅ Personnalisable
- **Inconvénients**:
  - ⚠️ Moins maintenu récemment
- **Exemple d'utilisation**:
```tsx
import VerticalSlider from 'rn-vertical-slider';

<VerticalSlider
  value={brightness}
  disabled={false}
  min={0}
  max={100}
  onChange={(value: number) => setBrightness(value)}
  width={60}
  height={300}
  step={1}
/>
```

---

### 2. **@react-native-community/slider** (Déjà installé)
- **npm**: `npm install @react-native-community/slider`
- **GitHub**: https://github.com/callstack/react-native-slider
- **Avantages**:
  - ✅ Officiel (maintenu par la communauté React Native)
  - ✅ Support natif iOS/Android
  - ✅ Bien documenté
  - ✅ Peut être roté pour orientation verticale
- **Inconvénients**:
  - ⚠️ Principalement horizontal (nécessite rotation)
  - ⚠️ Moins intuitif pour vertical
- **Exemple d'utilisation**:
```tsx
import Slider from '@react-native-community/slider';

<View style={{ transform: [{ rotate: '-90deg' }] }}>
  <Slider
    value={brightness}
    minimumValue={0}
    maximumValue={100}
    onValueChange={setBrightness}
    style={{ width: 300, height: 60 }}
  />
</View>
```

---

### 3. **react-native-smooth-slider**
- **npm**: `npm install react-native-smooth-slider`
- **GitHub**: https://github.com/react-native-community/react-native-smooth-slider
- **Avantages**:
  - ✅ Support horizontal ET vertical natif
  - ✅ Utilise `react-native-gesture-handler` (déjà installé)
  - ✅ Animations fluides
  - ✅ Bonne performance
- **Inconvénients**:
  - ⚠️ Nécessite `react-native-gesture-handler`
- **Exemple d'utilisation**:
```tsx
import SmoothSlider from 'react-native-smooth-slider';

<SmoothSlider
  value={brightness}
  minimumValue={0}
  maximumValue={100}
  onValueChange={setBrightness}
  orientation="vertical"
  style={{ height: 300, width: 60 }}
/>
```

---

### 4. **react-native-fast-range-slider**
- **npm**: `npm install react-native-fast-range-slider`
- **GitHub**: https://github.com/amitpdev/react-native-fast-range-slider
- **Avantages**:
  - ✅ Haute performance (Reanimated + Gesture Handler)
  - ✅ TypeScript natif
  - ✅ Animations fluides
  - ✅ Pas de code natif requis
- **Inconvénients**:
  - ⚠️ Principalement pour range slider (deux poignées)
  - ⚠️ Plus complexe pour un slider simple
- **Exemple d'utilisation**:
```tsx
import FastRangeSlider from 'react-native-fast-range-slider';

<FastRangeSlider
  min={0}
  max={100}
  step={1}
  value={brightness}
  onValueChange={setBrightness}
  vertical={true}
/>
```

---

### 5. **react-native-multi-slider**
- **npm**: `npm install react-native-multi-slider`
- **GitHub**: https://github.com/ptomasroos/react-native-multi-slider
- **Avantages**:
  - ✅ Support vertical
  - ✅ Marqueurs personnalisables
  - ✅ Une ou deux poignées
  - ✅ Bien maintenu
- **Inconvénients**:
  - ⚠️ Plus complexe pour un slider simple
- **Exemple d'utilisation**:
```tsx
import MultiSlider from 'react-native-multi-slider';

<MultiSlider
  values={[brightness]}
  sliderLength={300}
  onValuesChange={(values) => setBrightness(values[0])}
  min={0}
  max={100}
  step={1}
  vertical={true}
/>
```

---

### 6. **Tamagui Slider**
- **npm**: `npm install @tamagui/slider`
- **GitHub**: https://github.com/tamagui/tamagui
- **Avantages**:
  - ✅ Très performant
  - ✅ Thématisable
  - ✅ Accessible
  - ✅ Support vertical
- **Inconvénients**:
  - ⚠️ Nécessite toute la suite Tamagui (plus lourd)
  - ⚠️ Courbe d'apprentissage plus élevée
- **Exemple d'utilisation**:
```tsx
import { Slider } from '@tamagui/slider';

<Slider
  orientation="vertical"
  value={[brightness]}
  onValueChange={(value) => setBrightness(value[0])}
  max={100}
  step={1}
  height={300}
/>
```

---

## 🎯 Comparaison rapide

| Bibliothèque | Vertical natif | Performance | Taille | Maintenance | Facilité |
|-------------|----------------|-------------|--------|------------|----------|
| **rn-vertical-slider** | ✅ Oui | ⭐⭐⭐ | 🟢 Léger | ⚠️ Moyen | ⭐⭐⭐⭐⭐ |
| **@react-native-community/slider** | ⚠️ Rotation | ⭐⭐⭐⭐ | 🟢 Léger | ✅ Excellent | ⭐⭐⭐ |
| **react-native-smooth-slider** | ✅ Oui | ⭐⭐⭐⭐ | 🟡 Moyen | ✅ Bon | ⭐⭐⭐⭐ |
| **react-native-fast-range-slider** | ✅ Oui | ⭐⭐⭐⭐⭐ | 🟡 Moyen | ✅ Bon | ⭐⭐⭐ |
| **react-native-multi-slider** | ✅ Oui | ⭐⭐⭐ | 🟢 Léger | ✅ Bon | ⭐⭐⭐ |
| **Tamagui Slider** | ✅ Oui | ⭐⭐⭐⭐⭐ | 🔴 Lourd | ✅ Excellent | ⭐⭐ |

---

## 💡 Recommandation

Pour votre cas d'usage (jauge verticale de luminosité similaire au flash), je recommande :

1. **rn-vertical-slider** - Le plus simple et adapté pour un slider vertical
2. **react-native-smooth-slider** - Si vous voulez plus de contrôle et de fluidité
3. **Solution actuelle (PanResponder)** - Si vous voulez un contrôle total et pas de dépendance supplémentaire

---

## 🔗 Liens utiles

- [rn-vertical-slider sur npm](https://www.npmjs.com/package/rn-vertical-slider)
- [react-native-smooth-slider sur npm](https://www.npmjs.com/package/react-native-smooth-slider)
- [react-native-fast-range-slider sur GitHub](https://github.com/amitpdev/react-native-fast-range-slider)
- [react-native-multi-slider sur GitHub](https://github.com/ptomasroos/react-native-multi-slider)

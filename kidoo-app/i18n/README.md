# Système d'internationalisation (i18n)

Ce projet utilise `react-i18next` et `i18next` pour la gestion des traductions.

## Structure

```
i18n/
├── config.ts          # Configuration i18n
├── types.d.ts         # Types TypeScript pour l'autocomplétion
├── locales/
│   ├── fr.json        # Traductions françaises
│   └── en.json        # Traductions anglaises
└── README.md          # Ce fichier
```

## Utilisation

### Hook `useTranslation`

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <Text>{t('common.welcome')}</Text>;
}
```

### Composant `Trans` pour les textes formatés

Pour les textes contenant des éléments React formatés :

```tsx
import { Trans } from 'react-i18next';
import { ThemedText } from '@/components/themed-text';

<ThemedText>
  <Trans
    i18nKey="home.step1.description"
    values={{ shortcut: 'cmd + d' }}
    components={{
      1: <ThemedText type="defaultSemiBold" />,
      2: <ThemedText type="defaultSemiBold" />,
    }}
  />
</ThemedText>
```

Dans le fichier JSON :
```json
{
  "home": {
    "step1": {
      "description": "Appuyez sur <1>app/(tabs)/index.tsx</1> et <2>{{shortcut}}</2> pour..."
    }
  }
}
```

## Ajout de nouvelles traductions

1. Ajoutez la clé dans `locales/fr.json` et `locales/en.json`
2. Utilisez `t('votre.cle.traduction')` dans vos composants
3. L'autocomplétion TypeScript devrait fonctionner grâce à `types.d.ts`

## Langue par défaut

La langue est détectée automatiquement depuis les paramètres de l'appareil via `expo-localization`. La langue de fallback est le français (`fr`).

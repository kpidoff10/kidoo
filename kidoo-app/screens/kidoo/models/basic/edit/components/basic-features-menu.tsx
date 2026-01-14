/**
 * Composant pour le menu des fonctionnalités du Kidoo Basic
 */

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { MenuList } from '@/components/ui/menu-list';
import { useAuth } from '@/contexts/AuthContext';

interface BasicFeaturesMenuProps {
  onBrightnessPress: () => void;
  onEffectsPress: () => void;
  onSleepPress: () => void;
  onColorsPress: () => void;
  onResetPress: () => void;
}

export function BasicFeaturesMenu({
  onBrightnessPress,
  onEffectsPress,
  onSleepPress,
  onColorsPress,
  onResetPress,
}: BasicFeaturesMenuProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isDeveloperMode } = useAuth();

  return (
    <View style={{
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      width: '100%',
    }}>
      <MenuList
        variant="dense"
        items={[
          {
            id: 'brightness',
            title: t('kidoos.edit.basic.menu.brightness.title', 'Luminosité'),
            subtitle: t('kidoos.edit.basic.menu.brightness.subtitle', 'Ajuster la luminosité des LEDs'),
            icon: 'sun.max.fill',
            onPress: onBrightnessPress,
          },
          // Effets LED - disponible seulement en mode dev
          ...(isDeveloperMode
            ? [
                {
                  id: 'effects',
                  title: t('kidoos.edit.basic.menu.effects.title', 'Effets LED'),
                  subtitle: t('kidoos.edit.basic.menu.effects.subtitle', 'Choisir un effet lumineux'),
                  icon: 'sparkles',
                  onPress: onEffectsPress,
                },
              ]
            : []),
          {
            id: 'sleep',
            title: t('kidoos.edit.basic.menu.sleep.title', 'Mode sommeil'),
            subtitle: t('kidoos.edit.basic.menu.sleep.subtitle', 'Configurer le mode sommeil'),
            icon: 'moon.fill',
            onPress: onSleepPress,
          },
          // Couleurs - disponible seulement en mode dev
          ...(isDeveloperMode
            ? [
                {
                  id: 'colors',
                  title: t('kidoos.edit.basic.menu.colors.title', 'Couleurs'),
                  subtitle: t('kidoos.edit.basic.menu.colors.subtitle', 'Personnaliser les couleurs'),
                  icon: 'paintpalette.fill',
                  onPress: onColorsPress,
                },
              ]
            : []),
          {
            id: 'reset',
            title: t('kidoos.edit.basic.menu.reset.title', 'Réinitialiser'),
            subtitle: t('kidoos.edit.basic.menu.reset.subtitle', 'Restaurer les paramètres par défaut'),
            icon: 'arrow.counterclockwise',
            destructive: true,
            onPress: onResetPress,
          },
        ]}
        showDividers={true}
      />
    </View>
  );
}

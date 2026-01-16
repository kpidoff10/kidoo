/**
 * Boutons d'action pour le renommage d'un Kidoo
 */

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';

interface RenameActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export function RenameActions({
  isSubmitting,
  onCancel,
  onSave,
}: RenameActionsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.xl }}>
      <Button
        label={t('common.cancel', 'Annuler')}
        variant="outline"
        onPress={onCancel}
        style={{ flex: 1 }}
        disabled={isSubmitting}
      />
      <Button
        label={t('common.save', 'Enregistrer')}
        variant="primary"
        onPress={onSave}
        style={{ flex: 1 }}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}

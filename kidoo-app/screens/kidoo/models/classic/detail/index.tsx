/**
 * Modale de détails pour le modèle Classic
 */

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { KidooProvider } from '@/contexts/KidooContext';
import { Kidoo } from '@/shared';

interface ClassicDetailModalProps {
  kidooId: Kidoo['id'];
}

function ClassicDetailContent(){
  const { t } = useTranslation();
  const theme = useTheme();


  return (
    <>
      {/* Badge du modèle */}
      <View style={{
        backgroundColor: theme.colors.tint + '20',
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        alignSelf: 'flex-start',
        marginBottom: theme.spacing.md,
      }}>
        <ThemedText style={{
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.tint,
          textTransform: 'uppercase',
        }}>
          {t('kidoos.models.classic', 'Classic')}
        </ThemedText>
      </View>
    </>
  );
}

export function ClassicDetailModal(props: ClassicDetailModalProps) {
  const { kidooId } = props;  // Envelopper le composant dans le provider Kidoo pour activer la connexion automatique
  return (
    <KidooProvider kidooId={kidooId} autoConnect={true}>
      <ClassicDetailContent />
    </KidooProvider>
  );
}

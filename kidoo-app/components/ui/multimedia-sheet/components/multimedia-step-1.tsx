/**
 * Étape 1 : Acceptation des conditions d'utilisation
 */

import { View, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { AlertCard } from '@/components/ui/alert-card';
import { Switch } from '@/components/ui/switch';
import { useMultimedia } from '../MultimediaContext';

export function MultimediaStep1() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { form } = useMultimedia();

  return (
    <View style={{ gap: theme.spacing.xl }}>
      <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
        <ThemedText type="title" style={{ textAlign: 'center', fontSize: 24 }}>
          {t('kidoos.multimedia.step1.title', 'Conditions d\'utilisation')}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', opacity: 0.7, fontSize: 15 }}>
          {t('kidoos.multimedia.step1.description', 'Avant de continuer, veuillez lire et accepter les conditions suivantes.')}
        </ThemedText>
      </View>

      <AlertCard
        type="warning"
        title={t('kidoos.multimedia.step1.terms', 'Je comprends et j\'accepte que :')}
        items={[
          t('kidoos.multimedia.step1.terms1', 'Je suis seul responsable des fichiers audio que j\'envoie sur le Kidoo'),
          t('kidoos.multimedia.step1.terms2', 'Les fichiers audio doivent être libres de droits ou j\'en détiens les droits'),
          t('kidoos.multimedia.step1.terms3', 'Je ne partagerai pas de contenu protégé par des droits d\'auteur sans autorisation'),
        ]}
        showIcon
      >
        <View style={[styles.switchContainer, { marginTop: theme.spacing.sm }]}>
          <Controller
            control={form.control}
            name="acceptTerms"
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchRow}>
                <ThemedText style={{ flex: 1, fontSize: 15, color: theme.colors.warning }}>
                  {t('kidoos.multimedia.step1.accept', 'J\'accepte ces conditions')}
                </ThemedText>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  type="warning"
                />
              </View>
            )}
          />
          {form.errors.acceptTerms && (
            <ThemedText style={{ color: theme.colors.error, fontSize: 12, marginTop: theme.spacing.xs }}>
              {form.errors.acceptTerms.message}
            </ThemedText>
          )}
        </View>
      </AlertCard>
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

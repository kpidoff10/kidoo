/**
 * Messages d'alerte pour la configuration WiFi
 */

import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { AlertMessage } from '@/components/ui/alert-message';

interface WifiConfigAlertsProps {
  isConnected: boolean;
  success: boolean;
  error: string | null;
}

export function WifiConfigAlerts({ isConnected, success, error }: WifiConfigAlertsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      {!isConnected && (
        <AlertMessage
          type="warning"
          message={t('kidoos.detail.wifi.warningNotConnected', 'Le Kidoo doit être connecté pour configurer le WiFi')}
          style={{ marginBottom: theme.spacing.md }}
        />
      )}

      {success && (
        <AlertMessage
          type="success"
          message={t('kidoos.detail.wifi.success', 'Configuration WiFi réussie !')}
          style={{ marginBottom: theme.spacing.md }}
        />
      )}

      {error && (
        <AlertMessage
          type="error"
          message={error}
          style={{ marginBottom: theme.spacing.md }}
        />
      )}
    </>
  );
}

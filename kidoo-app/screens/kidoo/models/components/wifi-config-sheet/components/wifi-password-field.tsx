/**
 * Champ de saisie pour le mot de passe WiFi
 */

import { useTranslation } from 'react-i18next';
import { PasswordField } from '@/screens/auth/components/PasswordField';

interface WifiPasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string | null;
  editable?: boolean;
}

export function WifiPasswordField({
  value,
  onChangeText,
  onFocus,
  onBlur,
  error,
  editable = true,
}: WifiPasswordFieldProps) {
  const { t } = useTranslation();

  return (
    <PasswordField
      label={t('kidoos.setup.step2.wifiPassword', 'Mot de passe WiFi')}
      value={value}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={t('kidoos.setup.step2.wifiPasswordPlaceholder', 'Mot de passe')}
      autoCapitalize="none"
      autoComplete="off"
      editable={editable}
      error={error || undefined}
    />
  );
}

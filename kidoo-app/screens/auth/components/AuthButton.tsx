/**
 * Composant de bouton pour les écrans d'authentification
 * Utilise le composant Button générique
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import { Button } from '@/components/ui/button';

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function AuthButton({ label, onPress, disabled = false, loading = false }: AuthButtonProps) {
  return (
    <Button
      label={label}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      variant="primary"
      size="md"
      fullWidth
      style={{ marginTop: 8, marginBottom: 0 } as ViewStyle}
    />
  );
}

/**
 * Hooks React Query pour l'authentification
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { registerUser, checkEmailAvailability, type RegisterInput, type RegisterResponse, type CheckEmailResponse } from '@/services/authService';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  emailCheck: (email: string) => ['auth', 'email-check', email] as const,
};

/**
 * Hook pour vérifier la disponibilité d'un email
 */
export function useCheckEmail(email: string, enabled: boolean = false) {
  return useQuery<CheckEmailResponse, Error>({
    queryKey: authKeys.emailCheck(email),
    queryFn: () => checkEmailAvailability(email),
    enabled: enabled && email.length > 0 && email.includes('@'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook pour l'inscription d'un nouvel utilisateur
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<RegisterResponse, { success: false; error: string; field?: string }, RegisterInput>({
    mutationFn: registerUser,
    onSuccess: () => {
      // Invalider les queries d'authentification après inscription réussie
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

/**
 * Kidoo Card Component
 */

import React, { useCallback, useState, useRef } from 'react';
import { Pressable, View, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Card, Text, Accordion, Button, ModelIcon } from '@/components/ui';
import { useTheme } from '@/theme';
import { Kidoo } from '@/api';
import { getKidooModelDisplayName } from '@/config';
import { useKidooContext } from '@/contexts';
import { RootStackParamList } from '@/navigation/types';
import { useControlDreamBedtime, useStopDreamRoutine } from '@/hooks';
import moment from 'moment';

interface KidooCardProps {
  kidoo: Kidoo;
  onPress: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function KidooCard({ kidoo, onPress }: KidooCardProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { getKidooModelHandler } = useKidooContext();
  const modelHandler = getKidooModelHandler(kidoo.id);

  const getLastSeenText = () => {
    if (!kidoo.lastConnected) return null;
    return t('kidoos.lastSeen', { time: moment(kidoo.lastConnected).fromNow() });
  };

  const controlBedtime = useControlDreamBedtime();
  const stopRoutine = useStopDreamRoutine();

  // Obtenir les actions personnalisées spécifiques au modèle
  const getCustomActions = useCallback(() => {
    if (!modelHandler || !modelHandler.getCustomActions) return [];

    const customActions = modelHandler.getCustomActions(kidoo, t, {
      onStartBedtime: () => {
        controlBedtime.mutate({
          id: kidoo.id,
          action: 'start',
        });
      },
      onStopBedtime: () => {
        controlBedtime.mutate({
          id: kidoo.id,
          action: 'stop',
        });
      },
      onStopRoutine: () => {
        stopRoutine.mutate(kidoo.id);
      },
    });

    return customActions;
  }, [modelHandler, kidoo, t, controlBedtime, stopRoutine]);

  const customActions = getCustomActions();
  const hasModelActions = customActions.length > 0;
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const accordionRotateAnim = useRef(new Animated.Value(0)).current;
  const accordionRef = useRef<{ toggle: () => void; isOpen: boolean } | null>(null);

  const handleAccordionToggle = useCallback((isOpen: boolean) => {
    setIsAccordionOpen(isOpen);
    Animated.timing(accordionRotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [accordionRotateAnim]);

  const handleAccordionButtonPress = useCallback(() => {
    accordionRef.current?.toggle();
  }, []);

  const rotateInterpolate = accordionRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Card variant="elevated" padding="sm" style={styles.card}>
      {/* Header principal - cliquable pour aller aux détails */}
      <View style={styles.headerContainer}>
        <Pressable
          onPress={onPress}
          android_ripple={{ color: 'transparent' }}
          style={({ pressed }) => [
            styles.header,
            pressed && { opacity: 0.7 },
          ]}
        >
          <View style={styles.iconContainer}>
            <ModelIcon
              model={kidoo.model}
              size={80}
            />
          </View>

          <View style={[styles.info, { marginLeft: spacing[4] }]}>
            <Text bold>{kidoo.name}</Text>
            <Text variant="caption" color="secondary">
              {t('kidoos.model')}: {getKidooModelDisplayName(kidoo.model)}
            </Text>
          </View>
        </Pressable>

        {/* Bouton accordéon à droite */}
        {hasModelActions && (
          <TouchableOpacity
            onPress={handleAccordionButtonPress}
            activeOpacity={0.7}
            style={styles.accordionButton}
          >
            <Animated.View
              style={{
                transform: [{ rotate: rotateInterpolate }],
              }}
            >
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.textSecondary}
              />
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>

      {!kidoo.isConnected && kidoo.lastConnected && (
        <Text
          variant="caption"
          color="tertiary"
          style={{ marginTop: spacing[2] }}
        >
          {getLastSeenText()}
        </Text>
      )}

      {/* Accordéon pour les actions spécifiques au modèle */}
      {hasModelActions && (
        <View style={[
          styles.accordionContainer,
          isAccordionOpen && {
            marginTop: spacing[2],
            paddingTop: spacing[2],
            borderTopWidth: 1,
            borderTopColor: colors.border,
          },
        ]}>
          <Accordion
            defaultOpen={false}
            onToggle={handleAccordionToggle}
            onRef={(ref) => {
              accordionRef.current = ref;
            }}
          >
            {/* Actions personnalisées (boutons) */}
            {customActions.map((action) => {
              // Déterminer la couleur selon le type d'action
              const getActionColor = () => {
                if (action.id === 'start-bedtime' || action.icon === 'play') {
                  return '#10B981'; // Vert pour play/start
                }
                if (action.icon === 'stop' || action.icon === 'pause') {
                  return '#EF4444'; // Rouge pour stop
                }
                return colors.primary; // Couleur par défaut
              };

              const actionColor = getActionColor();
              const isPending = controlBedtime.isPending || stopRoutine.isPending;
              const isDisabled = action.disabled || isPending;

              return (
                <View key={action.id} style={styles.customActionRow}>
                  <TouchableOpacity
                    onPress={action.onPress}
                    disabled={isDisabled}
                    activeOpacity={0.7}
                    style={[
                      styles.actionIconButton,
                      {
                        backgroundColor: isDisabled ? colors.border : actionColor,
                        opacity: isDisabled ? 0.5 : 1,
                      },
                    ]}
                  >
                    {isPending ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Ionicons
                        name={action.icon as any}
                        size={20}
                        color="#FFFFFF"
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={action.onPress}
                    disabled={isDisabled}
                    activeOpacity={0.7}
                    style={styles.actionLabelContainer}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.text, opacity: isDisabled ? 0.5 : 1 }]}>
                      {isPending ? 'Chargement...' : action.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </Accordion>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  accordionButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 32,
    minHeight: 32,
  },
  accordionContainer: {
    // Le divider sera ajouté conditionnellement via le style inline
  },
  customActionsContainer: {
    width: '100%',
  },
  customActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  actionIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionLabelContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 48, // Même hauteur que le bouton pour l'alignement vertical
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  actionItem: {
    // Pas de bordure, les actions sont déjà séparées visuellement
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

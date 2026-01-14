/**
 * Composant pour la zone de scan NFC avec animations
 */

import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export type NFCState = 'idle' | 'creating' | 'writing' | 'updating' | 'written' | 'error';

export interface NFCScanZoneProps {
  state: NFCState;
}

export function NFCScanZone({ state }: NFCScanZoneProps) {
  const theme = useTheme();
  
  // Animations pour l'effet de scan NFC
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim1 = useRef(new Animated.Value(0)).current;
  const rippleAnim2 = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(1)).current;

  // Animation de pulsation pour l'icône NFC
  useEffect(() => {
    if (state === 'creating' || state === 'writing' || state === 'updating') {
      // Animation de pulsation continue
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      
      // Animation des cercles concentriques (ripple)
      const rippleAnimation1 = Animated.loop(
        Animated.timing(rippleAnim1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      
      const rippleAnimation2 = Animated.loop(
        Animated.sequence([
          Animated.delay(1000),
          Animated.timing(rippleAnim2, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      
      pulseAnimation.start();
      rippleAnimation1.start();
      rippleAnimation2.start();
      
      return () => {
        pulseAnimation.stop();
        rippleAnimation1.stop();
        rippleAnimation2.stop();
      };
    } else {
      // Réinitialiser les animations
      pulseAnim.setValue(1);
      rippleAnim1.setValue(0);
      rippleAnim2.setValue(0);
    }
  }, [state, pulseAnim, rippleAnim1, rippleAnim2]);

  // Animation de succès quand le tag est écrit
  useEffect(() => {
    if (state === 'written') {
      Animated.sequence([
        Animated.timing(iconScaleAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(iconScaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [state, iconScaleAnim]);

  // Interpolations pour les animations
  const ripple1Scale = rippleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5],
  });
  
  const ripple1Opacity = rippleAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.3, 0],
  });
  
  const ripple2Scale = rippleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5],
  });
  
  const ripple2Opacity = rippleAnim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.3, 0],
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: theme.spacing.xl }}>
      {/* Cercles concentriques animés (ripple effect) */}
      {(state === 'creating' || state === 'writing') && (
        <>
          <Animated.View
            style={[
              styles.ripple,
              {
                transform: [{ scale: ripple1Scale }],
                opacity: ripple1Opacity,
                borderColor: theme.colors.tint,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.ripple,
              {
                transform: [{ scale: ripple2Scale }],
                opacity: ripple2Opacity,
                borderColor: theme.colors.tint,
              },
            ]}
          />
        </>
      )}
      
      {/* Icône NFC principale avec animation */}
      <Animated.View
        style={{
          transform: [
            { scale: (state === 'creating' || state === 'writing') ? pulseAnim : state === 'written' ? iconScaleAnim : 1 },
          ],
          alignItems: 'center',
          justifyContent: 'center',
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: state === 'written' 
            ? theme.colors.successBackground 
            : (state === 'creating' || state === 'writing')
              ? theme.colors.infoBackground 
              : theme.colors.surfaceSecondary,
          borderWidth: 3,
          borderColor: state === 'written' 
            ? theme.colors.success 
            : theme.colors.tint,
        }}
      >
        <IconSymbol 
          name="tag.fill" 
          size={64} 
          color={state === 'written' ? theme.colors.success : theme.colors.tint} 
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ripple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
});

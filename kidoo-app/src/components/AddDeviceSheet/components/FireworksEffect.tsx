/**
 * Effet de feu d'artifice pour célébrer le succès
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/theme';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#FFD93D'];

export function FireworksEffect() {
  const { colors } = useTheme();
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Créer plusieurs explosions de feu d'artifice
    const createFireworks = () => {
      const fireworkCount = 3; // 3 explosions
      const allAnimations: Animated.CompositeAnimation[] = [];

      for (let fw = 0; fw < fireworkCount; fw++) {
        const delay = fw * 300; // Délai entre chaque explosion
        const particleCount = 20;
        const newParticles: Particle[] = [];
        
        // Position de l'explosion (différente pour chaque feu d'artifice)
        const centerX = width / 2 + (Math.random() - 0.5) * 100;
        const centerY = height / 3 + (Math.random() - 0.5) * 80;
        
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount;
          const distance = 80 + Math.random() * 60;
          
          newParticles.push({
            id: fw * 1000 + i,
            x: new Animated.Value(centerX),
            y: new Animated.Value(centerY),
            opacity: new Animated.Value(1),
            scale: new Animated.Value(1),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          });
        }
        
        particles.current = [...particles.current, ...newParticles];

        // Animer les particules de cette explosion
        const animations = newParticles.map((particle, index) => {
          const angle = (Math.PI * 2 * index) / particleCount;
          const distance = 80 + Math.random() * 60;
          const endX = centerX + Math.cos(angle) * distance;
          const endY = centerY + Math.sin(angle) * distance;

          return Animated.parallel([
            Animated.sequence([
              Animated.delay(delay),
              Animated.timing(particle.x, {
                toValue: endX,
                duration: 800 + Math.random() * 400,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.delay(delay),
              Animated.timing(particle.y, {
                toValue: endY,
                duration: 800 + Math.random() * 400,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.delay(delay + 200),
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.delay(delay),
              Animated.timing(particle.scale, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),
          ]);
        });

        allAnimations.push(...animations);
      }

      animationRef.current = Animated.parallel(allAnimations);
      animationRef.current.start();
    };

    createFireworks();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.current.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

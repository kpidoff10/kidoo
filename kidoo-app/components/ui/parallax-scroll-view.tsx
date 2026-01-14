import type { PropsWithChildren } from 'react';
import { RefreshControl } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

type Props = PropsWithChildren & {
  refreshing?: boolean;
  onRefresh?: () => void;
};

export default function ParallaxScrollView({ children, refreshing = false, onRefresh }: Props) {
  const theme = useTheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor: theme.colors.background, flex: 1 }}
      scrollEventThrottle={16}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.tint}
            colors={[theme.colors.tint]}
          />
        ) : undefined
      }>
      <ThemedView style={theme.components.parallaxContent as any}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

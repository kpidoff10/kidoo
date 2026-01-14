import { Platform, View } from 'react-native';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Header } from '@/components/themes/header';

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  const shortcut = Platform.select({
    ios: t('home.step1.shortcuts.ios'),
    android: t('home.step1.shortcuts.android'),
    web: t('home.step1.shortcuts.web'),
  });

  return (
    <View style={theme.components.screenContainer}>
      <Header />
      <ParallaxScrollView>
      <ThemedView style={theme.components.screenTitleContainer}>
          <ThemedText type="title">{t('home.title')}</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={theme.components.screenStepContainer}>
          <ThemedText type="subtitle">{t('home.step1.title')}</ThemedText>
        <ThemedText>
            <Trans
              i18nKey="home.step1.description"
              values={{ shortcut }}
              components={{
                1: <ThemedText type="defaultSemiBold" />,
                2: <ThemedText type="defaultSemiBold" />,
              }}
            />
        </ThemedText>
      </ThemedView>
      <ThemedView style={theme.components.screenStepContainer}>
        <Link href="/modal">
          <Link.Trigger>
              <ThemedText type="subtitle">{t('home.step2.title')}</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
              <Link.MenuAction
                title={t('actions.action')}
                icon="cube"
                onPress={() => alert('Action pressed')}
              />
            <Link.MenuAction
                title={t('actions.share')}
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
              <Link.Menu title={t('actions.more')} icon="ellipsis">
              <Link.MenuAction
                  title={t('common.delete')}
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

          <ThemedText>{t('home.step2.description')}</ThemedText>
      </ThemedView>
      <ThemedView style={theme.components.screenStepContainer}>
          <ThemedText type="subtitle">{t('home.step3.title')}</ThemedText>
        <ThemedText>
            <Trans
              i18nKey="home.step3.description"
              components={{
                1: <ThemedText type="defaultSemiBold" />,
                2: <ThemedText type="defaultSemiBold" />,
              }}
            />
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
    </View>
  );
}

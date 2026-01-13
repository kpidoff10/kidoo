import { Image } from 'expo-image';
import { Platform, View } from 'react-native';
import { useTranslation, Trans } from 'react-i18next';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Header } from '@/components/themes/header';

export default function TabTwoScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={theme.components.screenContainer}>
      <Header />
      <ParallaxScrollView>
        <ThemedView style={theme.components.screenTitleContainer}>
          <ThemedText
            type="title"
            style={{
              fontFamily: theme.typography.fontFamily.rounded,
            }}>
            {t('explore.title')}
          </ThemedText>
        </ThemedView>
        <ThemedText>{t('explore.description')}</ThemedText>
        <Collapsible title={t('explore.sections.fileBasedRouting.title')}>
          <ThemedText>
            <Trans
              i18nKey="explore.sections.fileBasedRouting.content"
              components={{
                1: <ThemedText type="defaultSemiBold" />,
              }}
            />
          </ThemedText>
          <ThemedText>
            <Trans
              i18nKey="explore.sections.fileBasedRouting.note"
              components={{
                1: <ThemedText type="defaultSemiBold" />,
              }}
            />
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/router/introduction">
            <ThemedText type="link">{t('explore.sections.fileBasedRouting.learnMore')}</ThemedText>
          </ExternalLink>
        </Collapsible>
        <Collapsible title={t('explore.sections.platformSupport.title')}>
          <ThemedText>
            <Trans
              i18nKey="explore.sections.platformSupport.content"
              components={{
                1: <ThemedText type="defaultSemiBold" />,
              }}
            />
          </ThemedText>
        </Collapsible>
        <Collapsible title={t('explore.sections.images.title')}>
          <ThemedText>
            <Trans
              i18nKey="explore.sections.images.content"
              components={{
                1: <ThemedText type="defaultSemiBold" />,
              }}
            />
          </ThemedText>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={{ width: 100, height: 100, alignSelf: 'center' }}
          />
          <ExternalLink href="https://reactnative.dev/docs/images">
            <ThemedText type="link">{t('explore.sections.images.learnMore')}</ThemedText>
          </ExternalLink>
        </Collapsible>
        <Collapsible title={t('explore.sections.themes.title')}>
          <ThemedText>
            <Trans
              i18nKey="explore.sections.themes.content"
              components={{
                1: <ThemedText type="defaultSemiBold" />,
              }}
            />
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
            <ThemedText type="link">{t('explore.sections.themes.learnMore')}</ThemedText>
          </ExternalLink>
        </Collapsible>
        <Collapsible title={t('explore.sections.animations.title')}>
          <ThemedText>
            <Trans
              i18nKey="explore.sections.animations.content"
              components={{
                1: <ThemedText type="defaultSemiBold" />,
                2: <ThemedText type="defaultSemiBold" style={{ fontFamily: theme.typography.fontFamily.mono }} />,
              }}
            />
          </ThemedText>
          {Platform.select({
            ios: (
              <ThemedText>
                <Trans
                  i18nKey="explore.sections.animations.iosNote"
                  components={{
                    1: <ThemedText type="defaultSemiBold" />,
                  }}
                />
              </ThemedText>
            ),
          })}
        </Collapsible>
      </ParallaxScrollView>
    </View>
  );
}

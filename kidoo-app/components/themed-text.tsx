import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const textStyles = {
    default: theme.components.textDefault,
    defaultSemiBold: theme.components.textDefaultSemiBold,
    title: theme.components.textTitle,
    subtitle: theme.components.textSubtitle,
    link: theme.components.textLink,
  };

  return (
    <Text
      style={[
        { color },
        textStyles[type],
        style,
      ]}
      {...rest}
    />
  );
}

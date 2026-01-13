/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 * @deprecated Utilisez `useTheme()` hook à la place
 */

import { useTheme } from './use-theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ReturnType<typeof useTheme>['colors']
) {
  const theme = useTheme();
  const colorFromProps = theme.isDark ? props.dark : props.light;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme.colors[colorName];
  }
}

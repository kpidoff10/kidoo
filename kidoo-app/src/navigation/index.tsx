import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderButton, Text } from '@react-navigation/elements';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text as RNText } from 'react-native';
import { HomeScreen as Home } from '../screens';
import { ProfileSheet as Profile } from '../screens';

// Composants temporaires - TODO: Créer les vrais screens
const Settings = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <RNText>Settings</RNText>
  </View>
);

const Updates = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <RNText>Updates</RNText>
  </View>
);

const NotFound = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <RNText>404 - Not Found</RNText>
  </View>
);

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'Feed',
      },
    },
    Updates: {
      screen: Updates,
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
    Profile: {
      screen: Profile,
      linking: {
        path: ':user(@[a-zA-Z0-9-_]+)',
        parse: {
          user: (value) => value.replace(/^@/, ''),
        },
        stringify: {
          user: (value) => `@${value}`,
        },
      },
    },
    Settings: {
      screen: Settings,
      options: ({ navigation }) => ({
        presentation: 'modal',
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: '404',
      },
      linking: {
        path: '*',
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

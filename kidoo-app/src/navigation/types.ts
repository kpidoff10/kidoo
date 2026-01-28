/**
 * Navigation Types
 */

export type RootStackParamList = {
  // Auth screens
  Login: undefined;
  Register: undefined;
  
  // Main app
  MainTabs: undefined;
  
  // Modals
  KidooDetail: { kidooId: string };
  EditProfile: undefined;
  BedtimeConfig: { kidooId: string };
  WakeupConfig: { kidooId: string };
};

export type MainTabsParamList = {
  Home: undefined;
  Kidoos: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

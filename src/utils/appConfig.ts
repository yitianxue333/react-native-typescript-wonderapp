import { Platform } from 'react-native';
import WonderAppState from 'src/models/wonder-app-state';

export const IOS = Platform.OS === 'ios';
export const DEV: boolean = process.env.NODE_ENV === 'development';

if (DEV) {
  console.disableYellowBox = true;
}

// Redux store
export const PURGE = DEV ? false : false;
export const blacklist: Array<keyof WonderAppState> = ['apiAlert'];

export const BUGSNAG_TOKEN: string = '199ec7aaeda101e5fb2983f39ab5538a';
export const INITIAL_HOME_SCREEN: string = DEV ? 'User' : 'Home';
export const INITIAL_PROFILE_SCREEN: string = DEV
  ? 'ProfileView'
  : 'ProfileView';
export const INITIAL_PROFILE_NAV: string = DEV ? '' : '';

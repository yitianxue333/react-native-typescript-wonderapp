import React from 'react';
import { Dimensions, Platform, View } from 'react-native';
import Color from 'color';

export const IOS = Platform.OS === 'ios';
export const { width, height, scale, fontScale } = Dimensions.get('window');
export const colors = {
  white: '#FFF',
  black: '#000',
  primary: '#F68E56',
  // If this changes, don't forget to update /android/app/src/main/res/values/colors.xml
  primaryLight: '#fbdfc2',
  // primaryLight: '#FDE0C1',
  secondary: 'rgb(255, 238, 75)',
  backgroundPrimary: '#ECECEC',
  textColor: '#8E8EAA',
  textColorLight: Color('#8E8EAA')
    .lighten(0.5)
    .toString(),
  cottonCandyPink: '#E7A4CA',
  cottonCandyBlue: '#84CCF1',
  // NK below
  purple: '#8E8EAA',
  lightPeach: '#efb16e',
  primary50: 'rgba(246, 142, 86, 0.5)',
  lightPurple: '#cbc2fa',
  iconColor: '#fcdfc2',
  peach: '#ffdf95',
  lightGray: '#e5e3e3',
  iron: '#cbc9cb',
  red: 'rgb(230, 41, 33)',
  red50: 'rgba(230, 41, 33, 0.5)'
};

const transparentNavigationStyles = {
  headerStyle: {
    backgroundColor: colors.white,
    borderBottomWidth: 0,
    elevation: 0,
    width: '100%'
  },
  headerTintColor: colors.textColor,
  headerTitleStyle: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: 'normal',
    color: colors.textColor,
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1
  },
  headerBackTitle: null
};

export const Device = {
  WIDTH: width,
  HEIGHT: height,
  SCALE: scale,
  FONT_SCALE: fontScale
};

export default {
  colors,
  NavBar: {
    transparent: transparentNavigationStyles
  },
  fonts: {
    primary: 'Poppins'
  },
  borders: {
    radius: 15,
    color: colors.textColor,
    width: 2
  }
};

import React from 'react';
import { View } from 'react-native';
import theme from 'src/assets/styles/theme';
import { createStackNavigator } from 'react-navigation';
import {
  Login,
  Welcome,
  Register1,
  Register2,
  Register3,
  Register4,
  VerifyScreen,
  ProfileCamera,
  ProfileVideo
} from '../screens';

// Why Header Right is needed: https://github.com/react-navigation/react-navigation/issues/544#issuecomment-376443134

const RegistrationNavigator = createStackNavigator(
  {
    Welcome: {
      screen: Welcome,
      navigationOptions: {
        header: null
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        title: 'LOGIN',
        headerRight: (<View />),
        ...theme.NavBar.transparent
      },
    },
    Verify: {
      screen: VerifyScreen,
      navigationOptions: {
        title: 'VERIFY',
        headerRight: (<View />),
        ...theme.NavBar.transparent
      }
    },
    Register1: {
      screen: Register1,
      navigationOptions: {
        title: 'CREATE ACCOUNT',
        headerRight: (<View />),
        ...theme.NavBar.transparent
      }
    },
    Register2: {
      screen: Register2,
      navigationOptions: {
        title: 'CREATE ACCOUNT',
        headerRight: (<View />),
        ...theme.NavBar.transparent
      }
    },
    Register3: {
      screen: Register3,
      navigationOptions: {
        title: 'CREATE ACCOUNT',
        headerRight: (<View />),
        ...theme.NavBar.transparent
      }
    },
    Register4: {
      screen: Register4,
      navigationOptions: {
        title: 'YOUR WONDERS',
        headerRight: (<View />),
        ...theme.NavBar.transparent
      }
    },
    ProfileCamera: {
      screen: ProfileCamera,
      navigationOptions: {
        title: 'PROFILE SELFIE',
        headerRight: (<View />),
        ...theme.NavBar.transparent
      }
    },
    ProfileVideo: {
      screen: ProfileVideo,
      navigationOptions: {
        title: 'VIBE VIDEO',
        headerRight: (<View />),
        ...theme.NavBar.transparent
      }
    }
  },
  {
    initialRouteName: 'Welcome'
  }
);

export default RegistrationNavigator;

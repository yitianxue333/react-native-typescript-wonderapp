import React from 'react';
import { createStackNavigator } from 'react-navigation';
import {
  ChatList,
  ChatScreen,
  ActivityMap,
  AppointmentInvite,
  AppointmentConfirm,
  ActivitySchedule
} from '../screens';
import theme from 'src/assets/styles/theme';
import navigation from '../../services/navigation';
import {

  View,
  
} from 'react-native';

const ChatNavigator = createStackNavigator(
  {
    ChatList: {
      screen: ChatList,
      navigationOptions: {
        header: null,
      },
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: {
        ...theme.NavBar.transparent,
      },
    },
    WonderMap: {
      screen: ActivityMap,
      navigationOptions: {
        // header: null
        // header: {
        //   title: 'TITLE',
        //   titleStyle: {
        //     color: 'black',
        //     textAlign:'center',
          
        //     fontWeight: '500'
        //   }
        // },
       // headerTitleStyle :{textAlign: 'center',alignSelf:'center',justifyContent: 'space-between'},
        title: 'PICK A WONDER',
        ...theme.NavBar.transparent,
        headerRight:(<View></View>)
      }
    },
    WonderSchedule: {
      screen: ActivitySchedule,
      navigationOptions: {
        //header:null
        // header: navigation => ({
        //   titleStyle: {
        //     justifyContent: 'space-between',
        //     textAlign: 'center'
        //   }
        // }),
        //headerTitleStyle :{textAlign: 'center',alignSelf:'center',justifyContent: 'center'},
        title: 'SCHEDULE WONDER',
        ...theme.NavBar.transparent,
        headerRight:(<View></View>)
      }
    },
    AppointmentInvite: {
      screen: AppointmentInvite,
      navigationOptions: {
        ...theme.NavBar.transparent,
        headerRight:(<View></View>)
      },
    },
    AppointmentConfirm: {
      screen: AppointmentConfirm,
      navigationOptions: {
        title: 'CONFIRM YOUR WONDER',
        ...theme.NavBar.transparent,
        headerRight:(<View></View>)
      }
    }
  },
  {
    initialRouteName: 'ChatList'
  }
);

export default ChatNavigator;

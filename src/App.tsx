import '../ReactotronConfig';
import { Root } from 'native-base';
import NavigatorService from './services/navigation';
import React, { Component } from 'react';
import { SafeAreaView, Platform, Dimensions } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { AppLoader } from '@components';
import { store, persistor } from '@store';
import AppRouter from './views/router';
import { MenuProvider } from 'react-native-popup-menu';
import { ConnectedAlert } from '@components';
// import { loginAlertTexts } from '@texts';

// Allow access to navigation in sagas
export let navigatorRef: any;

const isIphoneX = () => {
  const { height, width } = Dimensions.get('window');
  return (
    // This has to be iOS duh
    Platform.OS === 'ios' &&
    // Accounting for the height in either orientation
    (height === 812 || width === 812)
  );
};

export default class App extends Component {
  renderContent = () => {
    if (isIphoneX()) {
      return (
        <SafeAreaView style={{ flex: 1, shadowOpacity: 0 }}>
          <AppRouter
            ref={(nav: any) => {
              NavigatorService.setContainer(nav);
            }}
          />
        </SafeAreaView>
      );
    }
    return (
      <AppRouter
        ref={(nav: any) => {
          NavigatorService.setContainer(nav);
        }}
      />
    );
  }

  render() {
    return (
      <MenuProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConnectedAlert />
            <AppLoader />
            <Root>{this.renderContent()}</Root>
          </PersistGate>
        </Provider>
      </MenuProvider>
    );
  }
}

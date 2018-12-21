// author: NK

import * as React from 'react';
import { NetInfo, ConnectionInfo } from 'react-native';
import { bugsnag } from '@utils';

interface IAppLoaderProps {}

interface IAppLoaderState {
  isOnline: boolean;
}

class AppLoader extends React.PureComponent<IAppLoaderProps, IAppLoaderState> {
  constructor(props: IAppLoaderProps) {
    super(props);
    this.state = {
      isOnline: false
    };
  }

  componentDidMount() {
    this.setupNetworkListener();
  }

  componentDidUpdate(prevProps: IAppLoaderProps) {
    const justLoggedIn = false;
    const justLoggedOut = false;

    // if (justLoggedIn) {
    //   bugsnag.setUser(uid, name, email);
    // }

    if (justLoggedOut) {
      bugsnag.clearUser();
    }
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
  }

  private initAppWithUserLoggedIn = (): void => {};

  private setupNetworkListener = async (): Promise<void> => {
    const networkStatus = await NetInfo.getConnectionInfo();

    console.log(`networkStatus:`, networkStatus);
    const isOnline = networkStatus.type !== 'none';

    this.setState({ isOnline });
    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
  }

  private handleConnectionChange = (
    connectionInfo: ConnectionInfo | string
  ): void => {
    console.log(`connectionInfo:`, connectionInfo);

    const isOnline =
      typeof connectionInfo === 'string'
        ? connectionInfo !== 'none'
        : connectionInfo.type !== 'none';

    this.setState({ isOnline });
  }

  public render() {
    return null;
  }
}

export { AppLoader };

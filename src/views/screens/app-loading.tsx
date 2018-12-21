import React from 'react';
import WonderAppState from '../../models/wonder-app-state';
import { NavigationActions, StackActions } from 'react-navigation';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { updateUser } from 'src/store/sagas/user';
import { selectCurrentUser } from 'src/store/selectors/user';
import { View, ActivityIndicator } from 'react-native';

const mapState = (state: WonderAppState) => ({
  token: state.user.auth.token,
  currentUser: selectCurrentUser(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: UserPushNotificationOptions) => dispatch(updateUser(data))
});

interface Props {
  navigation: any;
  token?: string | null;
  onSave: (data: UserPushNotificationOptions) => void;
}

interface UserPushNotificationOptions {
  push_device_id: string;
  push_device_type: string;
}

class AppLoadingScreen extends React.Component<Props> {
  componentDidMount() {
    if (this.props.token) {
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Main' })]
        })
      );
      return;
    }
    this.props.navigation.navigate('onboarding');
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(AppLoadingScreen);

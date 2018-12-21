import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { PrimaryButton, TextArea } from 'src/views/components/theme';
import Screen from 'src/views/components/screen';
import { MediaGrid } from 'src/views/components/theme/media-grid';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import {
  loginUser,
  forgotPassword,
  getVerification
} from 'src/store/sagas/user';
import validator from 'validator';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import WonderAppState from '../../../models/wonder-app-state';
import { persistRegistrationInfo } from '../../../store/reducers/registration';
import { Device } from 'src/assets/styles/theme';
import { KeyboardDismissView } from 'src/views/components/keyboard-dismiss-view';
import { setAlertModal } from '@actions';
import { twoPhotoMinimumAlertTexts } from '@texts';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  onSave: Function;
  setAlertModal: () => void;
}

interface State {
  images: any[];
  video: any[];
  about?: string;
  errors: StateErrors;
}

interface StateErrors {
  images?: string;
  video?: string;
  about?: string;
}

const mapState = (state: WonderAppState) => ({
  registration: state.registration
});
const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: State) => dispatch(persistRegistrationInfo(data)),
  onLogin: (data) => dispatch(loginUser(data)),
  onGetVerification: (data) => dispatch(getVerification(data)),
  setAlertModal: () => dispatch(setAlertModal(twoPhotoMinimumAlertTexts))
});

class Register3 extends React.Component<Props, State> {
  state: State = {
    images: [],
    video: [],
    about: '',
    errors: {}
  };

  private onAboutChangeText = (key: string) => {
    const { errors } = this.state;
    return (text: string) => {
      this.setState({
        about: text,
        errors: {
          ...errors,
          [key]: undefined
        }
      });
    };
  }

  private validate = () => {
    const { onSave, registration } = this.props;

    const { about, images } = this.state;

    if (images.length < 2) {
      return this.props.setAlertModal();
    }

    onSave({ about });
    this.props.onGetVerification(registration.phone);
  }

  render() {
    const { navigation } = this.props;

    return (
      <Screen horizontalPadding={20}>
        <KeyboardAvoidingView
          behavior='position'
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <KeyboardDismissView>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <MediaGrid
                width={Device.WIDTH - 80}
                gutter={2}
                onNewPicture={() => navigation.navigate('ProfileCamera')}
                onNewVideo={() => navigation.navigate('ProfileVideo')}
              />
            </View>
            <TextArea
              label='About Me'
              onChangeText={this.onAboutChangeText('about')}
              // tslint:disable-next-line
              placeholder="Take this time to describe yourself, life experience, hobbies, and anything else that makes you wonderful..."
              maxLength={200}
            />
          </KeyboardDismissView>
        </KeyboardAvoidingView>
        <View style={{ marginVertical: 10 }}>
          <PrimaryButton title='Finish' onPress={this.validate} />
        </View>
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(Register3);

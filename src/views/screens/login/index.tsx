import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  Text,
  RoundedTextInput,
  PrimaryButton
} from 'src/views/components/theme';
import theme from 'src/assets/styles/theme';
import Screen from 'src/views/components/screen';
import Images, { Logo } from 'src/assets/images';
import TextButton from 'src/views/components/theme/text-button';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import ForgotPasswordModal from '../../components/modals/forgot-password-modal';

import { Dispatch } from 'redux';
import {
  loginUser,
  forgotPassword,
  getVerification
} from 'src/store/sagas/user';

import validator from 'validator';
import WonderAppState from 'src/models/wonder-app-state';
import UserCredentials from 'src/models/user-credentials';

type Email = string;

const mapState = (state: WonderAppState) => ({});

const mapDispatch = (dispatch: Dispatch) => ({
  onLogin: (credentials: UserCredentials) => dispatch(loginUser(credentials)),
  onForgotPassword: (email: Email) =>
    dispatch(forgotPassword({ forgotEmail: email })),
  onGetVerification: (phone: string) => dispatch(getVerification(phone))
});

interface Props {
  onLogin: Function;
  onForgotPassword: Function;
  navigation: NavigationScreenProp<any, NavigationParams>;
  onGetVerification: (phone: string) => Promise<void>;
}

interface State {
  phone: string;
  password: string;
  errors: StateErrors;
  modalVisible: boolean;
  forgotEmail: string;
}

interface StateErrors {
  phone?: string;
  password?: string;
}

class LoginScreen extends React.Component<Props> {
  inputs: any = {};

  state: State = {
    phone: '',
    password: '',
    errors: {},
    modalVisible: false,
    forgotEmail: ''
  };

  private onChangeText = (key: string) => {
    const { errors } = this.state;
    return (text: string) => {
      this.setState({
        [key]: text,
        errors: {
          ...errors,
          [key]: undefined
        }
      });
    };
  }

  private submit = (): void => {
    const { phone } = this.state;

    this.props.onGetVerification(phone);
  }

  private submitForgotEmail = () => {
    const { forgotEmail } = this.state;
    const errors: StateErrors = {};

    if (!validator.isEmail(forgotEmail)) {
      errors.phone = 'Please enter a valid email';
    }
    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }
    // fire the action
    this.props.onForgotPassword(forgotEmail);
    this.setState({ modalVisible: false, errors: {} });
  }

  private assignInputRef = (input: RoundedTextInput) => {
    this.inputs.email = input;
  }

  private assignForgotEmailInputRef = (input: RoundedTextInput) => {
    this.inputs.forgotEmail = input;
  }

  private toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  render() {
    const { navigation } = this.props;
    const { errors, phone, modalVisible } = this.state;

    return (
      <Screen style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo} source={Logo.DARK} resizeMode='contain' />
        </View>
        <View style={styles.body}>
          <View style={styles.inputContainer}>
            <RoundedTextInput
              returnKeyType='next'
              getRef={this.assignInputRef}
              autoCapitalize='none'
              autoCorrect={false}
              errorHint={errors.phone}
              icon='phone'
              placeholder='Phone'
              onChangeText={this.onChangeText('phone')}
              style={styles.roundedTextButton}
            />
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonSubContainer}>
              <PrimaryButton
                disabled={!validator.isMobilePhone(phone, 'en-US')}
                title='Login'
                onPress={this.submit}
              />
              <TextButton
                style={styles.textButton}
                text='Contact Support'
                onPress={this.toggleModal}
              />
            </View>
            <View style={styles.noAccountContainer}>
              <Text>Don't have an account? </Text>
              <TextButton
                style={styles.registerButton}
                text='Register'
                onPress={() => navigation.goBack()}
              />
            </View>
          </View>
        </View>
        <ForgotPasswordModal
          getRef={this.assignForgotEmailInputRef}
          visible={modalVisible}
          onRequestClose={this.toggleModal}
          onChangeText={this.onChangeText('forgotEmail')}
          submit={this.submitForgotEmail}
          errorHint={errors.phone}
        />
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(LoginScreen);

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF' },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: { width: '80%' },
  inputContainer: { width: '80%' },
  buttonContainer: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonSubContainer: { marginTop: 20, width: '50%' },
  roundedTextButton: { height: 54 },
  textButton: {
    textAlign: 'center',
    color: theme.colors.textColor,
    marginTop: 30,
    fontSize: 13
  },
  noAccountContainer: { marginTop: 25, flexDirection: 'row' },
  registerButton: { textAlign: 'center', color: theme.colors.primary },
  body: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20
  }
});

import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  Alert
} from 'react-native';
import { RoundedTextInput, PrimaryButton } from 'src/views/components/theme';
import Screen from 'src/views/components/screen';
import { Logo } from 'src/assets/images';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import validator from 'validator';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import WonderAppState from '../../../models/wonder-app-state';
import {
  persistRegistrationInfo,
  resetRegistration
} from 'src/store/reducers/registration';

interface Props {
  onSave: Function;
  onReset: Function;
  navigation: NavigationScreenProp<any, NavigationParams>;
}

interface State {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  errors: StateErrors;
}

interface StateErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

const mapState = (state: WonderAppState) => ({});

const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: State) => dispatch(persistRegistrationInfo(data)),
  onReset: () => dispatch(resetRegistration())
});

class Register1 extends React.Component<Props, State> {
  inputs: any = {
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    password: null
  };

  state: State = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    errors: {}
  };

  componentWillMount() {
    this.props.onReset();
  }

  focusNext = (key: string) => () => {
    if (this.inputs[key]) {
      this.inputs[key].focus();
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <Screen>
        <ScrollView>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.select({ android: -40, ios: 0 })}
            behavior='position'
            contentContainerStyle={{ flex: 1 }}
            // style={styles.body}
            style={{ flex: 1 }}
          >
            {/* <KeyboardDismissView style={{ flex: 1 }}> */}
            <View style={styles.header}>
              <Image
                style={{ width: '80%', maxHeight: 100 }}
                source={Logo.DARK}
                resizeMode='contain'
              />
            </View>
            <View style={styles.body}>
              <View style={{ width: '100%' }}>
                <RoundedTextInput
                  getRef={(input: any) => {
                    this.inputs.first_name = input;
                  }}
                  onSubmitEditing={this.focusNext('last_name')}
                  returnKeyType='next'
                  onValidate={(text: string) =>
                    text && !validator.isEmpty(text)
                  }
                  autoCorrect={false}
                  autoCapitalize='words'
                  errorHint={errors.first_name}
                  icon='user'
                  placeholder='First Name'
                  onChangeText={this.onChangeText('first_name')}
                  fullWidth
                  maxLength={50}
                />
              </View>
              <View style={{ marginTop: 10, width: '100%' }}>
                <RoundedTextInput
                  getRef={(input: any) => {
                    this.inputs.last_name = input;
                  }}
                  onSubmitEditing={this.focusNext('email')}
                  returnKeyType='next'
                  onValidate={(text: string) =>
                    text && !validator.isEmpty(text)
                  }
                  autoCorrect={false}
                  autoCapitalize='words'
                  errorHint={errors.last_name}
                  icon='user'
                  placeholder='Last Name'
                  onChangeText={this.onChangeText('last_name')}
                  fullWidth
                  maxLength={50}
                />
              </View>
              <View style={{ marginTop: 10, width: '100%' }}>
                <RoundedTextInput
                  getRef={(input: any) => {
                    this.inputs.email = input;
                  }}
                  onSubmitEditing={this.focusNext('phone')}
                  returnKeyType='next'
                  onValidate={(text: string) => text && validator.isEmail(text)}
                  autoCapitalize='none'
                  autoCorrect={false}
                  errorHint={errors.email}
                  icon='envelope-o'
                  placeholder='Email'
                  onChangeText={this.onChangeText('email')}
                  fullWidth
                  maxLength={50}
                />
              </View>
              <View style={{ marginTop: 10, width: '100%' }}>
                <RoundedTextInput
                  getRef={(input: any) => {
                    this.inputs.phone = input;
                  }}
                  onSubmitEditing={this.focusNext('password')}
                  returnKeyType='next'
                  onValidate={(text: string) =>
                    text && validator.isMobilePhone(text, 'en-US')
                  }
                  keyboardType='phone-pad'
                  autoCapitalize='none'
                  autoCorrect={false}
                  errorHint={errors.phone}
                  icon='phone'
                  placeholder='Mobile Number'
                  onChangeText={this.onChangeText('phone')}
                  fullWidth
                  maxLength={10}
                />
              </View>
              <View style={{ marginTop: 10, width: '100%' }}>
                <RoundedTextInput
                  onValidate={(text: string) => text && text.length > 5}
                  returnKeyType='done'
                  autoCapitalize='none'
                  autoCorrect={false}
                  errorHint={errors.password}
                  icon='lock'
                  placeholder='Password'
                  onChangeText={this.onChangeText('password')}
                  fullWidth
                />
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  width: '50%',
                  alignSelf: 'center'
                }}
              >
                <PrimaryButton title='Next' onPress={this.validate} />
              </View>
            </View>
            {/* </KeyboardDismissView> */}
          </KeyboardAvoidingView>
        </ScrollView>
      </Screen>
    );
  }

  private validate = () => {
    const errors: StateErrors = {};
    const { navigation, onSave } = this.props;
    const { first_name, last_name, email, phone, password } = this.state;

    if (validator.isEmpty(first_name)) {
      errors.first_name = 'Please enter your first name';
    }

    if (validator.isEmpty(last_name)) {
      errors.last_name = 'Please enter your last name';
    }

    if (!validator.isEmail(email)) {
      errors.email = 'Please use a valid email address';
    }

    if (!validator.isMobilePhone(phone, 'en-US')) {
      errors.phone = 'Please enter your mobile phone number';
    }

    if (validator.isEmpty(password)) {
      errors.password = 'Please enter a password';
    } else if (password && password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }
    onSave({ first_name, last_name, email, phone, password });
    navigation.navigate('Register2');
  }

  private onChangeText = (key: string) => {
    const { errors } = this.state;
    return (text: string) => {
      this.setState({
        ...this.state,
        [key]: text,
        errors: {
          ...errors,
          [key]: undefined
        }
      });
    };
  }
}

export default connect(
  mapState,
  mapDispatch
)(Register1);

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    padding: 20
  },
  header: {
    maxHeight: 125,
    flex: 0,
    alignItems: 'center'
  }
});

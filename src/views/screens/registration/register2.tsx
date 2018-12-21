import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  TextInput,
  Text,
  GenderPicker,
  PrimaryButton,
  DatePicker,
  Title
} from 'src/views/components/theme';
import Screen from 'src/views/components/screen';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import Gender from '../../../models/gender';
import moment from 'moment-timezone';
import validator from 'validator';
import { connect } from 'react-redux';
import WonderAppState from '../../../models/wonder-app-state';
import { Dispatch } from 'redux';
import {
  persistRegistrationInfo,
  RegistrationState
} from '../../../store/reducers/registration';
import googleMaps, { GoogleGeoLocation } from '../../../services/google-maps';
import theme from 'src/assets/styles/theme';
import StateButton from 'src/views/components/theme/buttons/state-button';
import Color from 'color';
import { Label } from '../../components/theme';
import { setAlertModal, IAPIAlert } from '@actions';
import { LAZipCodeAlertTexts } from '@texts';

interface Props {
  registration: RegistrationState;
  onSave: Function;
  navigation: NavigationScreenProp<any, NavigationParams>;
  setAlertModal: () => void;
}

interface StateErrors {
  gender?: string;
  birthdate?: string;
  education?: string;
  occupation?: string;
  zipcode?: string;
}

interface State {
  gender: Gender;
  birthdate: Date;
  education: string;
  occupation: string;
  zipcode: string;
  geolocation: GoogleGeoLocation | null;
  errors: StateErrors;
  male_interest: boolean;
  female_interest: boolean;
}

const mapState = (state: WonderAppState) => ({
  registration: state.registration
});
const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: State) => dispatch(persistRegistrationInfo(data)),
  setAlertModal: () => dispatch(setAlertModal(LAZipCodeAlertTexts))
});

class Register2 extends React.Component<Props, State> {
  private eighteenYearsAgoToday = moment()
    .subtract(18, 'years')
    .startOf('day');

  state: State = {
    gender: Gender.male,
    birthdate: this.eighteenYearsAgoToday.toDate(),
    education: '',
    occupation: '',
    zipcode: '',
    geolocation: null,
    errors: {},
    male_interest: false,
    female_interest: true
  };

  lookupZipcode = async () => {
    const { zipcode } = this.state;
    if (!validator.isEmpty(zipcode) && validator.isPostalCode(zipcode, 'US')) {
      const geolocation: GoogleGeoLocation = await googleMaps.geocodeByZipCode(
        zipcode
      );
      this.setState({ geolocation });
    } else {
      this.setState({ geolocation: null });
    }
  }

  formattedGeo = () => {
    const { geolocation } = this.state;
    if (geolocation) {
      return ` (${geolocation.city}, ${geolocation.state})`;
    }
    return '';
  }

  setGenderPreference = (gender: string) => {
    if (gender === 'male') {
      this.setState({ male_interest: !this.state.male_interest });
    } else if (gender === 'female') {
      this.setState({ female_interest: !this.state.female_interest });
    }
  }

  public render() {
    const { errors, birthdate } = this.state;
    const { registration } = this.props;

    return (
      <Screen horizontalPadding={20}>
        <ScrollView>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.select({ android: -40, ios: 0 })}
            behavior='position'
            contentContainerStyle={{ flex: 1 }}
            // style={styles.body}
            style={{ flex: 1 }}
          >
            {/* <KeyboardDismissView style={{ flex: 1 }}> */}
            <Title style={styles.title}>Hello, {registration.first_name}</Title>
            <Text style={styles.welcome}>
              Tell us a little more about yourself
            </Text>
            <GenderPicker
              onChange={(gender: Gender) => this.onChangeText('gender')(gender)}
            />
            <View style={styles.genderBtns}>
              <Label>LOOKING FOR</Label>
              <View style={styles.genderBtnsContainer}>
                <StateButton
                  active={this.state.male_interest}
                  onPress={() => this.setGenderPreference('male')}
                  text='Men'
                />

                <StateButton
                  active={this.state.female_interest}
                  onPress={() => this.setGenderPreference('female')}
                  text='Women'
                />
              </View>
            </View>
            <DatePicker
              errorHint={errors.birthdate}
              label='BIRTHDAY'
              placeholder='Select Date'
              onChange={this.onDateChange}
              initialDate={birthdate}
              minDate={new Date('1950-01-01')}
              maxDate={this.eighteenYearsAgoToday.toDate()}
            />
            <TextInput
              label='EDUCATION'
              errorHint={errors.education}
              autoCorrect={false}
              autoCapitalize='words'
              onChangeText={this.onChangeText('education')}
            />
            <TextInput
              label='OCCUPATION'
              errorHint={errors.occupation}
              autoCorrect={false}
              autoCapitalize='words'
              onChangeText={this.onChangeText('occupation')}
            />
            <TextInput
              onValidate={(text: string) =>
                text && validator.isPostalCode(text, 'US')
              }
              keyboardType='number-pad'
              label={`ZIP CODE${this.formattedGeo()}`}
              errorHint={errors.zipcode}
              autoCorrect={false}
              autoCapitalize='words'
              onChangeText={this.onChangeText('zipcode')}
              onBlur={this.lookupZipcode}
            />
            <View style={{ marginVertical: 10 }}>
              <PrimaryButton title='Next' onPress={this.validate} />
            </View>
            {/* </KeyboardDismissView> */}
          </KeyboardAvoidingView>
        </ScrollView>
      </Screen>
    );
  }

  private onDateChange = (date: Date) => {
    this.setState({ birthdate: date });
  }

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

  private validate = () => {
    const errors: StateErrors = {};
    const { navigation, onSave } = this.props;
    // get gender preferences
    const {
      gender,
      education,
      occupation,
      birthdate,
      zipcode,
      male_interest,
      female_interest,
      geolocation
    } = this.state;

    if (GenderPicker.Genders.indexOf(gender) < 0) {
      errors.gender = 'Please select a gender';
    }

    if (!birthdate) {
      errors.birthdate = 'Please enter your birthday';
    } else if (moment(birthdate).isAfter(this.eighteenYearsAgoToday)) {
      errors.birthdate = 'You are not old enough to use this app';
    }

    if (validator.isEmpty(zipcode)) {
      errors.zipcode = 'Please enter a Postal Code';
    } else if (!validator.isPostalCode(zipcode, 'US')) {
      errors.zipcode = 'Please enter a valid Postal Code';
    } else if (!geolocation || geolocation.city !== 'Los Angeles') {
      this.props.setAlertModal();
      return;
    }

    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }

    onSave({
      gender,
      zipcode,
      school: education,
      occupation,
      birthdate: birthdate.toISOString().split('T')[0],
      male_interest,
      female_interest
    });

    navigation.navigate('Register4');
  }
}

export default connect(
  mapState,
  mapDispatch
)(Register2);

const styles = StyleSheet.create({
  welcome: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  genderBtns: {
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: Color(theme.colors.textColor).lighten(0.5)
  },
  genderBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  title: {
    color: theme.colors.primary,
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

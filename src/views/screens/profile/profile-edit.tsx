import React from 'react';
import Screen from 'src/views/components/screen';
import validator from 'validator';
import {
  PrimaryButton,
  TextInput,
  DatePicker
} from 'src/views/components/theme';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';

import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { updateUser } from 'src/store/sagas/user';
import { selectCurrentUser } from 'src/store/selectors/user';
import WonderAppState from 'src/models/wonder-app-state';
import User from 'src/models/user';

import StateButton from 'src/views/components/theme/buttons/state-button';
import { Label } from '../../components/theme';
import Color from 'color';
import theme from 'src/assets/styles/theme';
import moment from 'moment-timezone';

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: State) => dispatch(updateUser(data))
});

interface Props {
  navigation: NavigationScreenProp<NavigationParams>;
  currentUser: User;
  onSave: Function;
}

interface State {
  first_name: string;
  last_name: string;
  school: string;
  occupation: string;
  errors: StateErrors;
  birthdate: Date;
  male_interest?: boolean;
  female_interest?: boolean;
}

interface StateErrors {
  first_name?: string;
  last_name?: string;
  school?: string;
  occupation?: string;
  birthdate?: string;
}

class ProfileEditScreen extends React.Component<Props, State> {
  private eighteenYearsAgoToday = moment()
    .subtract(18, 'years')
    .startOf('day');

  state: State = {
    first_name: this.props.currentUser.first_name,
    last_name: this.props.currentUser.last_name,
    school: this.props.currentUser.school,
    occupation: this.props.currentUser.occupation,
    errors: {},
    birthdate: this.props.currentUser.birthdate,
    male_interest: this.props.currentUser.male_interest,
    female_interest: this.props.currentUser.female_interest
  };

  validate = () => {
    const errors: StateErrors = {};
    const { onSave, navigation } = this.props;
    const {
      first_name,
      last_name,
      school,
      occupation,
      birthdate,
      male_interest,
      female_interest
    } = this.state;

    if (validator.isEmpty(first_name)) {
      errors.first_name = 'First name is required';
    }

    if (validator.isEmpty(last_name)) {
      errors.last_name = 'Last name is required';
    }

    if (validator.isEmpty(school)) {
      errors.school = 'Please enter your education';
    }

    if (validator.isEmpty(occupation)) {
      errors.occupation = 'Please enter your occupation';
    }

    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }

    onSave({
      first_name,
      last_name,
      school,
      occupation,
      birthdate,
      male_interest,
      female_interest
    });
    navigation.goBack();
  }

  onChangeText = (key: string) => {
    return (text: string) => {
      this.setState({
        ...this.state,
        [key]: text
      });
    };
  }

  setGenderPreference = (gender: string) => {
    if (gender === 'male') {
      this.setState({ male_interest: !this.state.male_interest });
    } else if (gender === 'female') {
      this.setState({ female_interest: !this.state.female_interest });
    }
  }

  public render() {
    const { navigation, currentUser } = this.props;
    const { errors, birthdate } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.select({ android: -40, ios: 0 })}
            behavior='position'
            contentContainerStyle={{ flex: 1, justifyContent: 'space-around' }}
            // style={styles.body}
            style={{ flex: 1 }}
          >
            <View style={styles.row}>
              <View flex={1}>
                <TextInput
                  style={{ height: 40 }}
                  label='First Name'
                  defaultValue={currentUser.first_name}
                  onChangeText={this.onChangeText('first_name')}
                  errorHint={errors.first_name}
                />
              </View>
              <View flex={1}>
                <TextInput
                  style={{ height: 40 }}
                  label='Last Name'
                  defaultValue={currentUser.last_name}
                  onChangeText={this.onChangeText('last_name')}
                  errorHint={errors.last_name}
                />
              </View>
            </View>

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
              initialDate={new Date(birthdate)}
              minDate={new Date('1950-01-01')}
              maxDate={this.eighteenYearsAgoToday.toDate()}
            />

            <View>
              <TextInput
                style={{ height: 40 }}
                label='Education'
                onChangeText={this.onChangeText('education')}
                defaultValue={currentUser.school}
                errorHint={errors.school}
              />
              <TextInput
                style={{ height: 40 }}
                label='Occupation'
                onChangeText={this.onChangeText('occupation')}
                defaultValue={currentUser.occupation}
                errorHint={errors.occupation}
              />
              <TextInput
                style={{ height: 40 }}
                label='Activity Zip Code'
                disabled
                defaultValue={currentUser.zipcode}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <View>
          <PrimaryButton rounded={false} title='Save' onPress={this.validate} />
        </View>
      </View>
    );
  }

  private onDateChange = (date: Date) => {
    this.setState({ birthdate: date });
  }
}

export default connect(
  mapState,
  mapDispatch
)(ProfileEditScreen);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#FFF'
  },
  row: {
    flexDirection: 'row'
  },
  genderBtns: {
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: Color(theme.colors.textColor).lighten(0.5)
  },
  genderBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

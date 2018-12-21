import React from 'react';
import { connect } from 'react-redux';
import Screen from 'src/views/components/screen';
import { Text, Strong, PrimaryButton } from 'src/views/components/theme';
import { Dispatch } from 'redux';
import { Calendar } from 'react-native-calendars';
import moment from 'moment-timezone';
import CalendarDate, { DATE_STRING_FORMAT } from 'src/models/calendar-date';
import theme from 'src/assets/styles/theme';
import { View, StyleSheet } from 'react-native';
import WonderAppState from 'src/models/wonder-app-state';
import {
  AppointmentState,
  persistAppointmentData
} from 'src/store/reducers/appointment';
import TimePicker from 'src/views/components/theme/pickers/time-picker';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';

const mapState = (state: WonderAppState) => ({
  appointment: state.appointment
});

const mapDispatch = (dispatch: Dispatch) => ({
  onUpdateAppointment: (data: AppointmentState) =>
    dispatch(persistAppointmentData(data))
});

interface AppointmentInviteProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointment: AppointmentState;
  onUpdateAppointment: (data: AppointmentState) => any;
}

interface State {
  selected: CalendarDate;
  selectedTime: Date;
}

class AppointmentInviteScreen extends React.Component<
  AppointmentInviteProps,
  State
> {
  static navigationOptions = ({ navigation }) => ({
    title: 'Invite to Wonder'
  })

  private init = (): CalendarDate => {
    const now = moment();
    return {
      day: now.date(),
      month: now.month() + 1,
      year: now.year(),
      timestamp: now.utc().valueOf(),
      dateString: now.format(DATE_STRING_FORMAT)
    };
  }

  state: State = {
    selected: this.init(),
    selectedTime: moment()
      .add(15, 'minutes')
      .toDate()
  };

  today = () => moment().startOf('day');

  onDateChange = (date: any) => {
    const selected: CalendarDate = date as CalendarDate;
    this.setState({ selected });
  }

  onTimeChange = (selectedTime: Date) => {
    this.setState({ selectedTime });
  }

  getMarkedDates = () => ({
    [this.state.selected.dateString]: {
      selected: true,
      selectedDotColor: theme.colors.primaryLight
    }
  })

  onComplete = () => {
    const { onUpdateAppointment, navigation } = this.props;
    const result = this.getCombinedMoment();
    // const dateTime = result.format('YYYY-MM-DD[T]HH:mm:ssZ');

    onUpdateAppointment({ eventAt: result.toDate() });
    navigation.navigate('AppointmentConfirm', { appointment: null });
  }

  renderTitle = () => {
    const { activity } = this.props.appointment;
    if (activity) {
      return (
        <View style={styles.header}>
          <Strong style={{ textAlign: 'center' }}>{activity.name}</Strong>
        </View>
      );
    }
  }

  getCombinedMoment = () => {
    const { selected, selectedTime } = this.state;
    const timeMoment = moment(selectedTime);
    const dateMoment = moment(selected.dateString, DATE_STRING_FORMAT);

    dateMoment
      .hour(timeMoment.hour())
      .minutes(timeMoment.minutes())
      .seconds(0);
    return dateMoment;
  }

  render() {
    const { selected } = this.state;
    return (
      <Screen>
        {this.renderTitle()}
        <Calendar
          current={selected.dateString}
          minDate={this.today().format(DATE_STRING_FORMAT)}
          maxDate={this.today()
            .add(1, 'month')
            .format(DATE_STRING_FORMAT)}
          onDayPress={this.onDateChange}
          monthFormat="MMMM '('yyyy')'" // http://arshaw.com/xdate/#Formatting
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          // Hide day names. Default = false
          hideDayNames={true}
          // Show week numbers to the left. Default = false
          showWeekNumbers={true}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          // onPressArrowLeft={substractMonth => substractMonth()}
          // Handler which gets executed when press arrow icon left. It receive a callback can go next month
          // onPressArrowRight={addMonth => addMonth()}
          markedDates={this.getMarkedDates()}
        />
        <View flex={1} style={{ paddingHorizontal: 20 }}>
          <TimePicker
            label='Select a time'
            minDate={moment()
              .add(15, 'minutes')
              .toDate()}
            initialDate={moment()
              .add(15, 'minutes')
              .toDate()}
            onChange={this.onTimeChange}
          />
        </View>
        <View flex={1} style={{ justifyContent: 'flex-end', margin: 10 }}>
          <PrimaryButton
            title={this.getCombinedMoment().format('MMMM Do [@] h:mma')}
            onPress={this.onComplete}
          />
        </View>
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(AppointmentInviteScreen);

const styles = StyleSheet.create({
  header: {
    padding: 10
  }
});

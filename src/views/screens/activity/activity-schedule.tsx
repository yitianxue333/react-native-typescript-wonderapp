import React from 'react';
import Analytics from 'appcenter-analytics';
import { View, Alert, StyleSheet, Dimensions } from 'react-native';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import RNCalendarEvents, {
  RNCalendarEvent
} from 'react-native-calendar-events';
import Screen from 'src/views/components/screen';
import {
  Text,
  PrimaryButton,
  IconButton,
  TextButton
} from 'src/views/components/theme';
import moment from 'moment';
import TimePicker from 'src/views/components/theme/pickers/time-picker';
import WonderAppState from 'src/models/wonder-app-state';
import {
  AppointmentState,
  persistAppointmentData
} from 'src/store/reducers/appointment';
import { NavigationParams, NavigationScreenProp } from 'react-navigation';
import Avatar, { AvatarSize } from 'src/views/components/theme/avatar';
import { getDecoratedConversation } from 'src/store/selectors/conversation';
import Conversation from 'src/models/conversation';
import User from 'src/models/user';
import { selectCurrentUser } from 'src/store/selectors/user';
import Attendance from 'src/models/attendance';
import UserCalendarModal, {
  CalendarItemMap
} from 'src/views/components/modals/user-calendar.modal';
import theme from 'src/assets/styles/theme';
import Topic from 'src/models/topic';
import { black } from 'color-name';

interface StateProps {
  currentUser: User;
  conversation: Conversation | null;
  appointment: AppointmentState;
  // appointments: ReadonlyArray<DecoratedAppointment>;
  attendances: ReadonlyArray<Attendance>;
}
interface DispatchProps {
  onUpdateAppointment: (data: AppointmentState) => any;
}
interface Props extends StateProps, DispatchProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

interface State {
  isCalendarOpen: boolean;
  selectedDate?: string;
  selectedTime?: {
    hour: number;
    minute: number;
  };
  agendaItems: any;
}

const { height } = Dimensions.get('window');

const mapState = (state: WonderAppState): StateProps => ({
  appointment: state.appointment,
  currentUser: selectCurrentUser(state),
  conversation: getDecoratedConversation(state),
  attendances: state.wonder.attendances
  // appointments: selectUpcomingAppointments(state)
});

const mapDispatch = (dispatch: Dispatch): DispatchProps => ({
  // getAllDates:dispatch(getAllDatesSaga)  <------ not written yet but for future reference
  onUpdateAppointment: (data: AppointmentState) =>
    dispatch(persistAppointmentData(data))
});
class ActivityScheduleScreen extends React.Component<Props, State> {
  state: State = {
    isCalendarOpen: true,
    selectedDate: undefined,
    selectedTime: undefined,
    agendaItems: {},
  };

  componentWillMount() {
    if (this.props.appointment.match) {
      Analytics.trackEvent('ActivityScheduleScreen', {
        match: this.props.appointment.match.id || ''
      });
    }

    this.mapNativeCalendarEventsToAgenda();
  }

  openCalendarModal = () => this.setState({ isCalendarOpen: true });
  closeCalendarModal = () => this.setState({ isCalendarOpen: false });

  /**
   * Create an array of Dates as strings to be mapped as keys
   */
  mapOutDays = () => {
    //
    // starts on the current day
    const today = moment();
    const otherDates = _.range(0, 30).map((i: number) => {
      //
      // Date that is added to the items props in agenda component(see below)
      return today
        .clone()
        .add(i, 'day')
        .format('YYYY-MM-DD');
    });
    return [today.format('YYYY-MM-DD'), ...otherDates];
  }

  schedule = () => {
    const { onUpdateAppointment, navigation } = this.props;
    const { selectedDate, selectedTime } = this.state;
    if (
      selectedDate &&
      selectedTime &&
      selectedTime.hour >= 0 &&
      selectedTime.minute >= 0
    ) {
      const dateMoment = moment(selectedDate, 'YYYY-MM-DD');
      dateMoment.hours(selectedTime.hour);
      dateMoment.minutes(selectedTime.minute);
      onUpdateAppointment({ eventAt: dateMoment.toDate() });
      navigation.navigate('AppointmentConfirm', { appointment: null });
    }
  }

  /**
   * Reads the native calendar events from today to a month from now and loads them into state
   */
  mapNativeCalendarEventsToAgenda = async () => {
    const RCE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSSZ';
    //
    // Attaches native calendar events to wonder agenda
    try {
      const granted: string = await RNCalendarEvents.authorizeEventStore();
      if (granted === 'authorized') {
        const { attendances } = this.props;
        //
        // gets todays utc and from a month from now
        const today = moment();
        const nextMonth = moment().add(1, 'month');

        //
        // Fetch all events from native calendar
        const events = await RNCalendarEvents.fetchAllEvents(
          today.utc().toDate(),
          nextMonth.utc().toDate()
        );

        const agendaItems: any = events.reduce(
          (result: CalendarItemMap, event: RNCalendarEvent) => {
            const {
              startDate,
              endDate,
              title,
              location,
              id,
              calendarId
            } = event;

            //
            // converts callback time to agenda format time
            const eventStartDate = moment(startDate, RCE_TIME_FORMAT);

            if (!result[eventStartDate.format('YYYY-MM-DD')]) {
              result[eventStartDate.format('YYYY-MM-DD')] = [];
            }

            let topic;
            if (id) {
              const found = attendances.find(
                (a: Attendance) => id === a.device_calendar_event_id
              );
              if (found) {
                topic = found.appointment.topic;
              }
            }

            result[eventStartDate.format('YYYY-MM-DD')].push({
              date: eventStartDate.utc().toDate(),
              title,
              location,
              start: startDate,
              end: endDate,
              id,
              calendarId,
              topic
            });

            return result;
          },
          {} as CalendarItemMap
        );

        this.setState({
          agendaItems: { ...this.state.agendaItems, ...agendaItems }
        });
      }
    } catch (error) {
      Alert.alert('DEV ERROR', error.message);
    }
  }

  onDateChange = (dateString: string) => {
    this.setState({ selectedDate: dateString });
  }

  selectTime = (selectedTime: { hour: number; minute: number }) => {
    this.setState({ selectedTime });
  }
  renderConfirmButton = (missingDate: boolean, disabled: boolean) => {
    return(
    <View style={{ position: 'absolute', right: 0, left: 0, bottom: 0}}>
    <PrimaryButton
       title={missingDate ? 'Select Date' : 'Confirm'}
       onPress={missingDate ? this.openCalendarModal : this.schedule}
       disabled={disabled}
       rounded={false}
    />
  </View>);
  }

  renderHeader = () => {
    const { navigation, conversation, appointment: { topic = {} } } = this.props;
    const { selectedDate, selectedTime } = this.state;
    const { first_name, last_name, images = [] } = _.get(
      conversation,
      'partner',
      {} as User
    );
    const activityName = _.get(topic, 'name', "Activity");

    const dateTime = moment(selectedDate, 'YYYY-MM-DD');

    if (selectedTime) {
      dateTime.hours(selectedTime.hour);
      dateTime.minutes(selectedTime.minute);
    }

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: 15
        }}
      >
        <Avatar circle uri={_.get(images[0], 'url', null)} size={height <= 680 ? 'md' : 'xl'} />
        <Text style={{ marginTop: 15, fontFamily: 'Poppins-Regular', color: black }}>
          {first_name}
        </Text>

        {selectedDate && (
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeLabel}>You are proposing:</Text>
            <TextButton
              style={styles.calendarButtonText}
              // text={"Soccer with ".."dateTime.format('MMMM Do, YYYY[\n][at] h:mma')}
              text={[activityName, 'with', first_name, '\n', 'on', dateTime.format('MMMM Do'), '\n', 'at', dateTime.format('h:mma')].join(' ')}
              onPress={this.openCalendarModal}
            />
          </View>
        )}
      </View>
    );
  }

  render() {
   // console.log();
    // console.log(JSON.stringify(this.props));
    // console.log(JSON.stringify(this.state));
    const {
      selectedDate,
      selectedTime,
      agendaItems,
      isCalendarOpen
    } = this.state;
    const disabled = !!selectedDate && !selectedTime;
    const missingDate = !selectedDate;
    return (
      <Screen>
        {this.renderHeader()}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
            flex: 1,
            justifyContent: 'center'
          }}
        >
          <TimePicker label='Select a time' onChange={this.selectTime} />
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                margin: 10,
                width: '50%'
              }}
            >
              {/* <PrimaryButton
                title={missingDate ? 'Select Date' : 'Confirm'}
                onPress={missingDate ? this.openCalendarModal : this.schedule}
                disabled={disabled}
              /> */}
            </View>
          </View>
        </View>
        <UserCalendarModal
          onDateChange={this.onDateChange}
          visible={isCalendarOpen}
          agendaItems={agendaItems}
          onRequestClose={this.closeCalendarModal}
        />
       {this.renderConfirmButton(missingDate, disabled)}

      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(ActivityScheduleScreen);

const styles = StyleSheet.create({
  dateTimeContainer: {
    marginTop: 10
  },
  dateTimeLabel: {
    textAlign: 'center',
    fontFamily: 'Poppins-Light'
  },
  calendarButtonText: {
    textAlign: 'center',
    fontSize: 24,
    color: theme.colors.primary,
    fontFamily: 'Poppins-Bold'
  }
});

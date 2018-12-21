import React from 'react';
import { View, Linking, Alert } from 'react-native';
import { TextInput } from 'src/views/components/theme';
import Screen from 'src/views/components/screen';
import { AppointmentList } from 'src/views/components/appointment-list';
import { connect } from 'react-redux';
import theme from 'src/assets/styles/theme';
import { Dispatch } from 'redux';
import { getAppointments } from 'src/store/sagas/appointment';
import moment from 'moment-timezone';
import {
  selectUpcomingAppointments,
  selectUpcomingAttendances
} from 'src/store/selectors/appointment';
import { deleteAttendance, getAttendances } from 'src/store/sagas/attendance';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import WonderAppState from 'src/models/wonder-app-state';
import { DecoratedAppointment } from 'src/models/appointment';
import { getConversation } from 'src/store/sagas/conversations';
import {
  cancelAppointment,
  declineAppointment
} from 'src/store/sagas/appointment';
import { setAlertModal, IAPIAlert } from '@actions';

interface State {
  search: string;
}

const mapState = (state: WonderAppState) => ({
  appointments: selectUpcomingAppointments(state),
  attendances: selectUpcomingAttendances(state)
  // selectUpcomingAttendances(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onRefreshAppointments: () => dispatch(getAppointments()),
  onDeleteAttendance: (data: DecoratedAppointment) =>
    dispatch(deleteAttendance(data)),
  onRefreshAttendances: () => dispatch(getAttendances()),
  onGetConversation: (partnerId: number, params: object) =>
    dispatch(getConversation({ id: partnerId, successRoute: 'Chat', params })),
  onCancelAppointment: (data: DecoratedAppointment) =>
    dispatch(cancelAppointment(data)),
  setAlertModal: (data: IAPIAlert) => dispatch(setAlertModal(data))
});

interface UpcomingAppointmentsProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointments: DecoratedAppointment[];
  attendances: DecoratedAppointment[];
  onRefreshAppointments: () => void;
  onRefreshAttendances: () => void;
  onDeleteAttendance: () => void;
  setAlertModal: (data: IAPIAlert) => void;
}

class UpcomingAppointmentsScreen extends React.Component<
  UpcomingAppointmentsProps
> {
  state: State = {
    search: ''
  };
  componentDidMount() {
    this.props.onRefreshAppointments();
    this.props.onRefreshAttendances();
  }

  goToAppointment = (appointment: DecoratedAppointment) => {
    this.props.navigation.navigate('UpcomingAppointmentView', { appointment });
  }

  onSearchTextChange = (text: string) => {
    this.setState({ search: text.toLowerCase() });
  }

  handleCancel = (date) => {
    if (date.state !== 'cancelled') {
      this.props.onDeleteAttendance(date);
      this.props.onGetConversation(date.match.id, {});
      this.props.onCancelAppointment(date);
      this.props.navigation.navigate('Chat', { name: date.match.first_name });
    } else {
      this.props.onDeleteAttendance(date);
    }
  }

  cancelAppointment = (date) => {
    const actionText =
      date.state === 'cancelled' ? 'remove' : 'cancel and remove';

    this.props.setAlertModal({
      title: 'Please Confirm',
      body: `Are you sure you want to ${actionText} this date?`,
      alertVisible: true,
      buttonTitle: 'Keep Date',
      buttonTitle2: 'Yes',
      onPress2: () => this.handleCancel(date)
    });
  }

  filterAppointments = () => {
    const { search } = this.state;
    const { appointments, attendances } = this.props;

    if (search) {
      return attendances.filter((appointment) => {
        const locationName =
          appointment.name.toLowerCase().indexOf(search) >= 0;
        const matchName =
          appointment.match.first_name.toLowerCase().indexOf(search) >= 0;
        const date =
          moment(appointment.event_at)
            .format('MMMM Do, [at] h:mma')
            .toLowerCase()
            .indexOf(search) >= 0;
        const activity =
          appointment.topic.name.toLowerCase().indexOf(search) >= 0;

        return locationName || matchName || date || activity;
      });
    }

    return attendances;
  }

  renderList = () => {
    const {
      appointments,
      onRefreshAppointments,
      attendances,
      onRefreshAttendances
    } = this.props;
    const filteredAppointments = this.filterAppointments();

    if (filteredAppointments.length) {
      return (
        <AppointmentList
          onPressCallNumber={this.callNumber}
          onRefresh={onRefreshAttendances}
          data={filteredAppointments}
          onPress={this.goToAppointment}
          onDelete={this.cancelAppointment}
        />
      );
    }
  }

  callNumber = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) {
        Alert.alert("Sorry! This number can't be opened from the app");
      } else {
        return Linking.openURL(url);
      }
    });
  }

  render() {
    return (
      <Screen>
        <TextInput
          outerContainerStyles={{ height: 42 }}
          color={theme.colors.primaryLight}
          containerStyles={{ borderBottomColor: theme.colors.primaryLight }}
          autoCorrect={false}
          autoCapitalize='none'
          icon='search'
          placeholder='Name, Date or Location'
          onChangeText={this.onSearchTextChange}
        />
        {this.renderList()}
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(UpcomingAppointmentsScreen);

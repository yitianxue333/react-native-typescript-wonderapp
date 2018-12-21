import _ from 'lodash';
import React from 'react';
import Screen from 'src/views/components/screen';
import { AppointmentList } from 'src/views/components/appointment-list';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getAppointments } from 'src/store/sagas/appointment';
import { deleteAttendance, getAttendances } from 'src/store/sagas/attendance';
import {
  selectPastAppointments,
  selectPastAttendences
} from 'src/store/selectors/appointment';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import WonderAppState from 'src/models/wonder-app-state';
import { DecoratedAppointment } from 'src/models/appointment';
import { Alert, View, Linking, StyleSheet } from 'react-native';
import { TextInput } from 'src/views/components/theme';
import theme from 'src/assets/styles/theme';
import moment from 'moment-timezone';

const mapState = (state: WonderAppState) => ({
  appointments: selectPastAttendences(state)
});

// not we're getting attendances and not appointments
const mapDispatch = (dispatch: Dispatch) => ({
  onRefreshAppointments: () => dispatch(getAttendances()),
  onDeleteAttendance: (data: DecoratedAppointment) =>
    dispatch(deleteAttendance(data))
});

interface PastAppointmentsProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointments: DecoratedAppointment[];
  onRefreshAppointments: () => void;
}

class PastAppointmentsScreen extends React.Component<PastAppointmentsProps> {
  state = {
    search: ''
  };

  componentDidMount() {
    this.props.onRefreshAppointments();
  }

  goToAppointment = (appointment: DecoratedAppointment) => {
    this.props.navigation.navigate('PastAppointmentView', { appointment });
  }

  onSearchTextChange = (text: string) => {
    this.setState({ search: text.toLowerCase() });
  }

  filterAppointments = () => {
    const { search } = this.state;
    const { appointments } = this.props;

    if (search) {
      return appointments.filter((appointment) => {
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

    return appointments;
  }

  renderList = () => {
    const { appointments, onRefreshAppointments } = this.props;
    const filteredAppointments = this.filterAppointments();
    if (filteredAppointments.length) {
      return (
        <AppointmentList
          onPressCallNumber={this.callNumber}
          onRefresh={onRefreshAppointments}
          data={filteredAppointments}
          onPress={this.goToAppointment}
          onDelete={this.props.onDeleteAttendance}
          isPast={true}
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
    const { appointments, onRefreshAppointments } = this.props;
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
)(PastAppointmentsScreen);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    width: '100%',
    alignSelf: 'center'
  }
});

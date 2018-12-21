import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Screen from 'src/views/components/screen';
import {Text, Strong, PrimaryButton, TextButton} from 'src/views/components/theme';
import { Dispatch } from 'redux';
import moment from 'moment-timezone';
import {View, StyleSheet, ScrollView, Dimensions, Platform, Linking, Alert, TouchableOpacity} from 'react-native';
import WonderAppState from 'src/models/wonder-app-state';
import {
  AppointmentState,
  persistAppointmentData
} from 'src/store/reducers/appointment';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { createAppointment } from 'src/store/sagas/appointment';
import Avatar, { AvatarSize } from 'src/views/components/theme/avatar';
import { Title } from 'native-base';

import { confirmAppointment } from 'src/store/sagas/appointment';
import { DecoratedAppointment } from 'src/models/appointment';

import RNCalendarEvents from 'react-native-calendar-events';
import WonderImage from '../../components/theme/wonder-image';

const Viewport = Dimensions.get('window');

const IPHONE5_WIDTH = 640;
const { height } = Dimensions.get('window');

const mapState = (state: WonderAppState) => ({
  appointment: state.appointment
});

const mapDispatch = (dispatch: Dispatch) => ({
  onConfirm: () => dispatch(createAppointment()),
  onConfirmAppointment: (appointment: DecoratedAppointment) =>
    dispatch(confirmAppointment({ appointment }))
});

interface AppointmentConfirmProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointment: AppointmentState;
  onConfirm: Function;
  onConfirmAppointment: (appointment: DecoratedAppointment) => void;
}

class AppointmentConfirmScreen extends React.Component<
  AppointmentConfirmProps
> {
  componentDidMount() {
    RNCalendarEvents.authorizationStatus().then((status) => {
      if (status !== 'authorized') {
        RNCalendarEvents.authorizeEventStore();
      }
    });
  }
  onComplete = () => {
    const { onConfirm } = this.props;
    onConfirm();
  }

  openAddress = (lat, lng, label) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q='
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  }

  onCall = async (url?: string | null) => {
    Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            Alert.alert("Sorry! This number can't be opened from the app");
          } else {
            return Linking.openURL(url);
          }
        })
        .catch((err) => console.error('An error occurred', err));
  }

  formatPhoneNumber = (phoneNumberString: String) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = (match[1] ? '+1 ' : '');
      return ['(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return '';
  }

  handleConfirmAppointment = (appointment: DecoratedAppointment) => {
    const { onConfirmAppointment, navigation } = this.props;
    onConfirmAppointment(appointment);
    navigation.goBack();
    // navigation.setParams({ appointment: null });
  }

  renderContent = () => {
    const { appointment } = this.props;
    const { match, activity, eventAt } = appointment;
    if (match && activity && eventAt) {
      const eventMoment = moment(eventAt);

      return (
        <View flex={1}>
          <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
              <View style={styles.scrollViewContainer}>
                <View style={{ alignItems: 'center', marginBottom: 15, marginTop: 20 }}>
                  <Avatar
                      size={((Viewport.width * Viewport.scale) <= IPHONE5_WIDTH) ? AvatarSize.md : AvatarSize.xl}
                      circle
                      uri={_.get(match, 'images[0].url', null)}
                  />
                </View>
                <Text style={[{ textAlign: 'center', }, styles.mainFontSize, ]}>
                  Invite {match.first_name}{'\n'}
                  on a {appointment.topic.name} Date to:
                </Text>
                <View style={{justifyContent: 'center', flex: 1}}>
                  <View style={[styles.body]}>
                    <View>
                      <Text style={[styles.mainFontSize, styles.activityName]}>{activity.name}</Text>
                      <Text
                          style={[styles.mainFontSize, styles.addressText]}
                          onPress={() =>
                              this.openAddress(
                                  activity.latitude,
                                  activity.longitude,
                                  activity.name
                              )
                          }
                      >
                        {activity.location.slice(0, 1) + '\n' + activity.location
                            .slice(1, activity.location.length).join(', ')}
                      </Text>

                      {eventMoment && (
                          <Strong
                              align='left'
                              style={styles.mainFontSize}
                          >
                            {eventMoment.format('MMMM Do [at] h:mma')}
                          </Strong>
                      )}

                      {activity.phone !== null && (
                          <TextButton
                              btnStyle={{ alignSelf: 'flex-start' }}
                              style={[styles.mainFontSize, styles.phoneText]}
                              text={this.formatPhoneNumber(activity.phone)}
                              onPress={() => this.onCall(`tel:${activity.phone}`)}
                          />
                      )}

                      <TouchableOpacity onPress={() => Linking.openURL(activity.url)}>
                        <Text style={[styles.linkText]}>
                          somesite.com
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'flex-start' }}>
                      <WonderImage style={styles.WonderIcon} uri={appointment.topic.icon} />
                    </View>
                  </View>
                </View>
              </View>
          </View>

          <View>
              <PrimaryButton rounded={false} title='Send Invitation' onPress={this.onComplete} />
            </View>
        </View>
      );
    }
  }

  renderConfirmContent = (appointment: DecoratedAppointment) => {
    const { match, eventMoment, name, location } = appointment;

    return (
      <View flex={1}>
        <ScrollView style={styles.container}>
          <Title>{match.first_name}</Title>
          <View style={{ alignItems: 'center', marginTop: 15 }}>
            <Avatar
              size={AvatarSize.xl}
              circle
              uri={_.get(match, 'images[0].url', null)}
            />
          </View>
          <View style={styles.body}>
            <View>
              <Text style={{ fontSize: 18, textAlign: 'left' }}>
                Invite {match.first_name} to:{'\n'}
                <Strong style={{ textAlign: 'center' }}>
                  {name} date{'\n'} at {location}{'\n'}
                  on {eventMoment && eventMoment.format('MMMM Do [at] h:mma')}?
                </Strong>
              </Text>
            </View>

          </View>
        </ScrollView>
        <View>
          <PrimaryButton
            rounded={false}
            title='Confirm'
            onPress={() => this.handleConfirmAppointment(appointment)}
          />
        </View>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const appointment = navigation.getParam('appointment', null);

    return (
      <Screen>
        {appointment
          ? this.renderConfirmContent(appointment)
          : this.renderContent()}
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(AppointmentConfirmScreen);

const styles = StyleSheet.create({
  body: {
    flex: 1,
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    // marginTop: 15,
    paddingHorizontal: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  scrollView: {
    height : Dimensions.get('window').height,
  },
  mainContainer : {
    flex : 1,
  },
  scrollViewContainer: {
    flex: 1,
    alignItems: 'center'
  },
  mainFontSize: {
    fontSize: ((Viewport.width * Viewport.scale) <= IPHONE5_WIDTH) ? 13 : 16,
  },
  activityName: {
    color: '#000',
    fontWeight: 'bold',
  },
  addressText: {
    color: 'rgb(0, 122, 255)',
    marginLeft: 0,
    textAlign: 'left'
  },
  phoneText: {
    color: 'rgb(0, 122, 255)',
    marginLeft: 0,
    textAlign: 'left'
  },
  linkText: {
    color: 'rgb(0, 122, 255)',
    marginLeft: 0,
    textAlign: 'left',
    fontSize: ((Viewport.width * Viewport.scale) <= IPHONE5_WIDTH) ? 12 : 15,
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  footer: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  WonderIcon: {
    height: ((Viewport.width * Viewport.scale) <= IPHONE5_WIDTH) ? 39 : 48,
    width: ((Viewport.width * Viewport.scale) <= IPHONE5_WIDTH) ? 39 : 48,
  }
});

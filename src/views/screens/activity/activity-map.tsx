import React from 'react';
import Screen from 'src/views/components/screen';
import MapView, { Marker as MarkerContainer, Callout } from 'react-native-maps';
import Marker from 'src/views/components/map/marker';
import ActivityCallout from 'src/views/components/map/activity-callout';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
  getPartnerActivities,
  getActivityDetails
} from 'src/store/sagas/partner';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import ActivityDetailsModal from 'src/views/components/modals/activity-details-modal';

import { persistActivity } from 'src/store/reducers/chat';
import {
  GeolocationReturnType,
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import {
  persistAppointmentData,
  AppointmentState
} from 'src/store/reducers/appointment';
import askForDeviceLocation from 'src/services/gps';

import Svg, { Image } from 'react-native-svg';

import { selectCurrentUser } from 'src/store/selectors/user';
import WonderAppState from 'src/models/wonder-app-state';
import Coordinate from 'src/models/coordinate';
import User from 'src/models/user';
import Activity from 'src/models/activity';
import Conversation from 'src/models/conversation';
import ActivityDetails from 'src/models/activity-details';

import theme from 'src/assets/styles/theme';

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state),
  activities: state.chat.activities,
  details: state.chat.activity,
  conversation: state.chat.conversation
});

const mapDispatch = (dispatch: Dispatch) => ({
  onGetActivities: (id: number, coordinate?: Coordinate) =>
    dispatch(getPartnerActivities({ id, coordinate })),
  onGetActivity: (id: string) => dispatch(getActivityDetails({ id })),
  onUpdateAppointment: (data: AppointmentState) =>
    dispatch(persistAppointmentData(data)),
  clearActivity: () => dispatch(persistActivity(null))
});

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  currentUser: User;
  activities: Activity[];
  details: ActivityDetails | null;
  onGetActivities: Function;
  onGetActivity: Function;
  clearActivity: Function;
  conversation: Conversation;
  onUpdateAppointment: (data: AppointmentState) => any;
}

interface State {
  position: any;
  mapReady: boolean;
}

class ActivityMapScreen extends React.Component<Props, State> {
  // tslint:disable-next-line:variable-name
  _mapRef: null | React.RefObject<MapView> = null;

  state: State = {
    position: {
      lat: 0,
      lng: 0
    },
    mapReady: false
  };

  componentWillMount() {
    const { navigation, onGetActivities, clearActivity } = this.props;
    const partnerId: number = navigation.getParam('id', 0);
    onGetActivities(partnerId);
    clearActivity();
  }

  componentDidMount() {
    askForDeviceLocation(this.updatePosition, this.fallbackToBackendLocation);
  }

  updatePosition = (position: GeolocationReturnType) => {
    const { navigation, onGetActivities, clearActivity } = this.props;
    const partnerId: number = navigation.getParam('id', 0);

    console.log(`updating position:`, position);

    const { coords } = position;
    this.setState({
      position: {
        lng: coords.longitude,
        lat: coords.latitude
      },
      mapReady: true
    });

    onGetActivities(partnerId, coords);
  }

  private fallbackToBackendLocation = (): void => {
    const { currentUser } = this.props;

    if (!currentUser) {
      return;
    }

    const { latitude, longitude } = currentUser;

    if (latitude && longitude) {
      this.setState({
        position: {
          lng: longitude,
          lat: latitude
        },
        mapReady: true
      });
    }
  }

  onInviteMatch = () => {
    const {
      details,
      navigation,
      clearActivity,
      onUpdateAppointment
    } = this.props;
    clearActivity();
    onUpdateAppointment({ activity: details });
    navigation.navigate('WonderSchedule');
  }

  renderMarker = (activity: Activity, index: number) => {
    const {
      onGetActivity,
      onUpdateAppointment,
      currentUser,
      conversation
    } = this.props;
    const { id, name, latitude, longitude, topic } = activity;
    const { position } = this.state;
    const usersTopics = currentUser.topics.map((t: Topic) => t.name);
    const matchTopics = conversation.partner.topics.map((t: Topic) => t.name);

    return (
      <MarkerContainer
        key={`${id} - ${name} - ${index}`}
        coordinate={{ latitude, longitude }}
        // onPress={() => onGetActivity(id)}
      >
        <View
          style={
            usersTopics.includes(topic.name) && matchTopics.includes(topic.name)
              ? styles.active
              : null
          }
        >
          <Marker title={topic.name} icon={topic.icon} />
        </View>
        <Callout
          tooltip={true}
          onPress={() => {
            onGetActivity(id);
            onUpdateAppointment({ topic: activity.topic });
          }}
        >
          <ActivityCallout userPosition={position} activity={activity} />
        </Callout>
      </MarkerContainer>
    );
  }

  private handleMapRef = (ref: React.RefObject<MapView>): void => {
    const { position } = this.state;
    this._mapRef = ref;

    if (!this._mapRef) {
      return;
    }

    requestAnimationFrame(() => {
      if (!this._mapRef) {
        return;
      }

      this._mapRef.animateToRegion(
        {
          latitude: position.lat,
          longitude: position.lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        },
        1
      );
    });
  }

  render() {
    const { activities, details, clearActivity, conversation } = this.props;
    const { position } = this.state;

    return (
      <Screen>
        {this.state.mapReady ? (
          <MapView
            // showsUserLocation
            ref={this.handleMapRef}
            showsMyLocationButton
            rotateEnabled={false}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: position.lat,
              longitude: position.lng,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1
            }}
          >
            {activities.map(this.renderMarker)}
            <MarkerContainer
              coordinate={{
                latitude: Number(conversation.partner.latitude),
                longitude: Number(conversation.partner.longitude)
              }}
            >
              <Svg width={40} height={40}>
                <Image
                  href={require('src/assets/images/icons/MapMatchIcon.png')}
                  width={40}
                  height={40}
                />
              </Svg>
            </MarkerContainer>
            <MarkerContainer
              coordinate={{
                latitude: Number(this.state.position.lat),
                longitude: Number(this.state.position.lng)
              }}
            >
              <Svg width={40} height={40}>
                <Image
                  href={require('src/assets/images/icons/WonderMapIcon.png')}
                  width={40}
                  height={40}
                />
              </Svg>
            </MarkerContainer>
          </MapView>
        ) : (
          <ActivityIndicator />
        )}
        <ActivityDetailsModal
          userPosition={position}
          onRequestClose={() => clearActivity()}
          details={details}
          onCancel={clearActivity}
          onConfirm={this.onInviteMatch}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  active: {
    height: 34,
    width: 34,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17
  }
});

export default connect(
  mapState,
  mapDispatch
)(ActivityMapScreen);

// location: "90024"

{
  /* <MarkerContainer
coordinate={{
  latitude: Number(conversation.partner.latitude),
  longitude: Number(conversation.partner.longitude),
}}
>
<Image
  style={{ height: 40, width: 40 }}
  resizeMode='contain'
  source={require('src/assets/images/icons/MapMatchIcon.png')} />
</MarkerContainer>

<MarkerContainer
coordinate={{
  latitude: Number(this.state.position.lat),
  longitude: Number(this.state.position.lng),
}}
>
<Image
  style={{ height: 40, width: 40 }}
  resizeMode='contain'
  source={require('src/assets/images/icons/WonderMapIcon.png')} />
</MarkerContainer> */
}

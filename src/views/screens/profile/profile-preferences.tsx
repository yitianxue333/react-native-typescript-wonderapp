import React from 'react';
import Screen from 'src/views/components/screen';
import {
  SubHeader,
  Text,
  Toggle,
  PrimaryButton,
  Switch
} from 'src/views/components/theme';
import {
  View,
  StyleSheet,
  ScrollView,
  //   Slider,
  RefreshControl
} from 'react-native';
import Slider from 'react-native-slider';

import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';

import { Dispatch } from 'redux';
import { updateUser, getUser } from 'src/store/sagas/user';
import MultiPointSlider from 'src/views/components/theme/multi-point-slider/multi-point-slider';
import WonderAppState from 'src/models/wonder-app-state';
import User from 'src/models/user';
import DistanceUnit from 'src/models/distance-unit';
import { colors, IOS } from '@assets';
import { ProfilePreferenceRow, prefRowStyles } from './profile-preference-row';

const mapState = (state: WonderAppState) => ({
  profile: state.user.profile
});

const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (profile: Partial<User>) => dispatch(updateUser(profile)),
  onRefresh: () => dispatch(getUser())
});

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  profile: User;
  onSave: Function;
  onRefresh: Function;
}

interface State {
  isScrollEnabled?: boolean;
  isRefreshing?: boolean;
  distance_of_interest_max?: number;
  age_of_interest_min?: number;
  age_of_interest_max?: number;
  male_interest?: boolean;
  female_interest?: boolean;
  available?: boolean;
  show_flakers?: boolean;
  show_ghosters?: boolean;
  show_fibbers?: boolean;
  military_time?: boolean;
  distance_unit?: DistanceUnit;
  apn_new_matches?: boolean;
  apn_new_messages?: boolean;
  apn_message_likes?: boolean;
  activities_only_interest?: boolean;
  apn_new_offers?: boolean;
  apn_message_super_likes?: boolean;
  geocoding_requested?: boolean;
}

class ProfilePreferencesScreen extends React.Component<Props, State> {
  static defaultProps = {
    profile: {}
  };

  constructor(props: Props) {
    super(props);
    this.state = this.loadProfile(props.profile);
  }

  loadProfile = (profile: User): State => ({
    isScrollEnabled: true,
    isRefreshing: false,
    distance_of_interest_max: profile.distance_of_interest_max || 0,
    age_of_interest_min: profile.age_of_interest_min || 18,
    age_of_interest_max: profile.age_of_interest_max || 32,
    male_interest: profile.male_interest,
    female_interest: profile.female_interest,
    available: profile.available,
    show_flakers:
      profile.show_flakers === undefined ? true : profile.show_flakers,
    show_ghosters:
      profile.show_ghosters === undefined ? true : profile.show_ghosters,
    show_fibbers:
      profile.show_fibbers === undefined ? true : profile.show_fibbers,
    military_time: profile.military_time,
    distance_unit: profile.distance_unit || DistanceUnit.miles,
    apn_new_matches: profile.apn_new_matches,
    apn_new_messages: profile.apn_new_messages,
    apn_message_likes: profile.apn_message_likes,
    apn_message_super_likes: profile.apn_message_super_likes,
    activities_only_interest: !!profile.activities_only_interest,
    apn_new_offers: !!profile.apn_new_offers,
    geocoding_requested: profile.geocoding_requested
  })

  onNumberChange = (key: string) => {
    return (value: number) => {
      this.setState({
        [key]: value
      });
    };
  }

  onBooleanChange = (key: string) => {
    const value = this.state[key];

    return () => {
      this.setState({
        [key]: !value
      });
    };
  }

  onChangeDistanceUnit = () => {
    const { distance_unit } = this.state;

    const nextUnit = distance_unit === 'km' ? 'mi' : 'km';
    this.setState({ distance_unit: nextUnit });
  }

  onChangeAgeRange = (
    age_of_interest_min: number,
    age_of_interest_max: number
  ) => {
    this.setState({ age_of_interest_min, age_of_interest_max });
  }

  save = () => {
    const { onSave, navigation } = this.props;
    const {
      distance_of_interest_max,
      age_of_interest_min,
      age_of_interest_max,
      male_interest,
      female_interest,
      available,
      show_flakers,
      show_ghosters,
      show_fibbers,
      military_time,
      distance_unit,
      apn_new_matches,
      apn_new_messages,
      apn_message_likes,
      apn_message_super_likes,
      geocoding_requested,
      apn_new_offers,
      activities_only_interest
    } = this.state;

    onSave({
      distance_of_interest_max,
      age_of_interest_min,
      age_of_interest_max,
      male_interest,
      female_interest,
      available,
      show_flakers,
      show_ghosters,
      show_fibbers,
      military_time,
      distance_unit,
      apn_new_matches,
      apn_new_messages,
      apn_message_likes,
      apn_message_super_likes,
      geocoding_requested,
      apn_new_offers,
      activities_only_interest
    });
    navigation.goBack();
  }

  refresh = () => {
    const { onRefresh } = this.props;
    onRefresh();
    this.setState({ isRefreshing: true }, () => {
      setTimeout(() => this.setState({ isRefreshing: false }), 1500);
    });
  }

  render() {
    const {
      isRefreshing,
      distance_of_interest_max,
      age_of_interest_min,
      age_of_interest_max,
      male_interest,
      female_interest,
      show_ghosters,
      military_time,
      distance_unit,
      apn_new_matches,
      apn_new_messages,
      activities_only_interest,
      apn_new_offers,
      show_fibbers,
      show_flakers,
      apn_message_likes,
      apn_message_super_likes,
      geocoding_requested,
      available
    } = this.state;

    const ageRangeText = IOS
      ? ''
      : `: ${age_of_interest_min} - ${age_of_interest_max}`;

    return (
      <Screen>
        <ScrollView
          scrollEnabled={this.state.isScrollEnabled}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing || false}
              onRefresh={this.refresh}
            />
          }
          contentContainerStyle={styles.contentContainer}
        >
          <SubHeader style={styles.heading}>Notifications</SubHeader>
          <ProfilePreferenceRow
            text={'New Matches'}
            value={!!apn_new_matches}
            onValueChange={this.onBooleanChange('apn_new_matches')}
          />

          <ProfilePreferenceRow
            text={'Messages'}
            value={!!apn_new_messages}
            onValueChange={this.onBooleanChange('apn_new_messages')}
          />

          {/* <ProfilePreferenceRow
            text={'Activities'}
            value={!!activities_only_interest}
            onValueChange={this.onBooleanChange('activities_only_interest')}
          /> */}

          <ProfilePreferenceRow
            text={'Products & Services'}
            value={!!apn_new_offers}
            onValueChange={this.onBooleanChange('apn_new_offers')}
          />

          <SubHeader style={styles.heading}>Settings</SubHeader>

          {/* <ProfilePreferenceRow
            text={'My Location'}
            value={!!show_location}
            onValueChange={this.onBooleanChange('show_location')}
          /> */}

          <ProfilePreferenceRow
            text={'Military Time'}
            value={!!military_time}
            onValueChange={this.onBooleanChange('military_time')}
          />

          <ProfilePreferenceRow
            text={`Units ${distance_unit}`}
            value={distance_unit === DistanceUnit.miles}
            onValueChange={this.onChangeDistanceUnit}
          />

          <SubHeader style={styles.heading}>Show Me</SubHeader>

          <ProfilePreferenceRow
            text={'Women'}
            value={!!female_interest}
            onValueChange={this.onBooleanChange('female_interest')}
          />

          <ProfilePreferenceRow
            text={'Men'}
            value={!!male_interest}
            onValueChange={this.onBooleanChange('male_interest')}
          />

          <ProfilePreferenceRow
            text={'Activity Partner'}
            value={!!activities_only_interest}
            onValueChange={this.onBooleanChange('activities_only_interest')}
          />

          <SubHeader style={styles.heading}>
            {`Age Range${ageRangeText}`}
          </SubHeader>

          <View style={prefRowStyles.row}>
            <MultiPointSlider
              min={18}
              max={80}
              initialMinValue={age_of_interest_min}
              initialMaxValue={age_of_interest_max}
              onValueChange={this.onChangeAgeRange}
            />
          </View>

          <SubHeader style={styles.heading}>
            Distance ({distance_unit}) - Up to {distance_of_interest_max}
          </SubHeader>

          <View style={prefRowStyles.row}>
            <Slider
              onValueChange={this.onNumberChange('distance_of_interest_max')}
              style={{ width: '100%' }}
              minimumTrackTintColor={colors.lightPeach}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              value={distance_of_interest_max}
              minimumValue={1}
              maximumValue={50}
              step={1}
            />
          </View>

          <SubHeader style={styles.heading}>Integrity</SubHeader>
          <ProfilePreferenceRow
            text={'Ghosters'}
            value={!!show_ghosters}
            onValueChange={this.onBooleanChange('show_ghosters')}
          />

          <ProfilePreferenceRow
            text={'Flakers'}
            value={!!show_flakers}
            onValueChange={this.onBooleanChange('show_flakers')}
          />

          <ProfilePreferenceRow
            text={'Fibbers'}
            value={!!show_fibbers}
            onValueChange={this.onBooleanChange('show_fibbers')}
          />
        </ScrollView>
        <View>
          <PrimaryButton rounded={false} title='Save' onPress={this.save} />
        </View>
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(ProfilePreferencesScreen);

const styles = StyleSheet.create({
  contentContainer: { paddingHorizontal: 20 },
  heading: {
    marginTop: 15
  },
  thumb: {
    width: 30,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.lightPeach
  },
  track: {
    backgroundColor: colors.lightGray,
    height: 2
  }
});

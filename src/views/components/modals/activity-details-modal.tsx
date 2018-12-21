import React from 'react';
import _ from 'lodash';
import {
  Modal,
  View,
  ModalProps,
  StyleSheet,
  Image,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Linking
} from 'react-native';
import {
  Title,
  Text,
  PrimaryButton,
  SmallText,
  SubTitle,
  TextButton
} from '../theme';

import PricingIndicator from '../pricing-indicator';
import RatingIndicator from '../rating-indicator';
import ActivityDetails from 'src/models/activity-details';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';
import theme from '../../../assets/styles/theme';
import Color from 'color';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { lightgrey } from 'color-name';

const gradient = [
  lighten(theme.colors.primaryLight, 0.5),
  lighten(theme.colors.primary, 0.5)
];

function lighten(color: string, value: number) {
  return Color(color)
    .fade(value)
    .toString();
}

function distance(lat1: any, lon1: any, lat2: any, lon2: any, unit: String) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') {
      dist = dist * 1.609344;
    }
    if (unit === 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  }
}

interface ActivityDetailsModalProps extends ModalProps {
  details: ActivityDetails | null;
  onCancel: Function;
  onConfirm: TouchableOpacityOnPress;
  userPosition: {
    lat: Number;
    lng: Number;
  };
}

class ActivityDetailsModal extends React.Component<ActivityDetailsModalProps> {
  renderHeaderImage = (images: string[]) => {
    if (images && images.length && images[0]) {
      return (
        <View>
          <Image source={{ uri: images[0] }} style={styles.headerImage} />
        </View>
      );
    }
  }

  renderStoreHours = () => {
    const { details } = this.props;
    const date = moment();
    const dow = date.day();

    const hours = _.get(details, 'hours[0].open', null);

    if (hours && hours.length) {
      const currentBusinessDay = hours.filter((d: any) => d.day === dow);
      if (currentBusinessDay && currentBusinessDay[0]) {
        return (
          <SmallText
            allowFontScaling={false}
            adjustsFontSizeToFit={true}
            style={{ fontSize: 11, color: 'grey', marginRight: 5 }}
          >
            {moment(currentBusinessDay[0].start, 'HH:mm').format('hh:mm a') +
              '-' +
              moment(currentBusinessDay[0].end, 'HH:mm').format('hh:mm a')}
          </SmallText>
        );
      } else {
        return <View />;
      }
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
    // .catch((err) => console.error('An error occurred', err));
  }

  renderDetails = () => {
    const { details, onConfirm, userPosition } = this.props;
    if (details) {
      const {
        name,
        location,
        hours,
        rating,
        review_count,
        price_level,
        images,
        phone
      } = details;

      return (
        <LinearGradient colors={gradient} style={styles.modal}>
          <View style={styles.container}>
            {this.renderHeaderImage(images)}
            <View style={styles.body}>
              <View style={styles.row}>
                <View style={{ flex: 2 }}>
                  <Title allowFontScaling={false} style={{ color: '#000' }}>
                    {name}
                  </Title>
                  <SmallText
                    allowFontScaling={false}
                    style={{ marginBottom: 3 }}
                  >
                    {location.join(' ')}
                  </SmallText>
                  {this.renderStoreHours()}
                  <PricingIndicator rating={price_level} />
                  {phone !== undefined && (
                    <TextButton
                      text={phone}
                      style={styles.phoneText}
                      onPress={() => this.callNumber(`tel:${phone}`)}
                    />
                  )}
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text>
                    {distance(
                      userPosition.lat,
                      userPosition.lng,
                      details.latitude,
                      details.longitude,
                      'N'
                    ).toFixed(0) + ' miles'}
                  </Text>
                  <RatingIndicator
                    containerStyle={{ marginTop: 4 }}
                    rating={rating}
                  />
                  <SmallText style={{ marginTop: 3 }}>
                    {review_count} Reviews
                  </SmallText>
                  <TouchableWithoutFeedback
                    onPress={() => Linking.openURL('https://www.yelp.com')}
                  >
                    <Image
                      source={require('../../../assets/images/icons/yelpLogo.png')}
                      style={{ height: 30, width: 50 }}
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                marginVertical: 10,
                alignItems: 'center'
              }}
            >
              <PrimaryButton title='Invite' onPress={onConfirm} />
            </View>
          </View>
        </LinearGradient>
      );
    }
  }
  render() {
    const { onConfirm, details, ...rest } = this.props;

    return (
      <Modal animationType='fade' visible={!!details} transparent {...rest}>
        <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
          {this.renderDetails()}
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default ActivityDetailsModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  container: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginTop: 60,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.4,
    elevation: 5
  },
  headerImage: {
    width: '100%',
    height: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  body: {
    padding: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  phoneText: {
    fontSize: 13,
    color: 'rgb(0, 122, 255)'
  }
});

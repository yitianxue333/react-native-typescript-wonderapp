import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  WebView
} from 'react-native';
import { Text } from 'src/views/components/theme';

import PricingIndicator from 'src/views/components/pricing-indicator';
import Activity from 'src/models/activity';
import Wonder from '../../components/theme/wonder/wonder';
import api, { BASE_URL } from 'src/services/api';
import SvgUri from 'react-native-svg-uri';

interface Props {
  activity: Activity;
  userPosition: {
    lat: String,
    lng: String,
  };
  // onPress: TouchableOpacityOnPress;
}

function distance(lat1: any, lon1: any, lat2: any, lon2: any, unit: String) {
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0;
  } else {
    const radlat1 = Math.PI * lat1 / 180;
    const radlat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') { dist = dist * 1.609344; }
    if (unit === 'N') { dist = dist * 0.8684; }
    return dist;
  }
}

class ActivityCallout extends React.Component<Props> {
  renderImage = () => {
    const { activity } = this.props;
    if (activity.image_url && activity.image_url.length) {
      return (
        <View flex={2} style={styles.imageContainer}>
          {<Image source={{ uri: activity.image_url }} style={{ flex: 1 }} />}
        </View>
      );
    }
  }
  render() {
    const { activity, userPosition } = this.props;

    return (
      <View
        style={styles.container}
      >
        {this.renderImage()}
        <View flex={3} style={styles.containerRight}>
          <View style={{ flex: 4, padding: 4, justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.title}>{activity.name}</Text>
              <Text style={styles.address}>{activity.location.join('\n')}</Text>
            </View>
            <PricingIndicator rating={activity.price_level} />
          </View>
          <View
            style={styles.rightContainer}
          >
            <SvgUri
              height={18}
              width={18}
              source={{ uri: `${BASE_URL}/${activity.topic.icon}` }}
            />
            <Text
              style={{ fontSize: 11 }}
            >
              {distance(userPosition.lat, userPosition.lng, activity.latitude, activity.longitude, 'N')
                .toFixed(0) + 'm'}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default ActivityCallout;

const styles = StyleSheet.create({
  container: {
    height: 110,
    width: 300,
    flexDirection: 'row',
    padding: 0,
    justifyContent: 'space-between',
    borderTopLeftRadius: 6, borderBottomLeftRadius: 6,
  },
  imageContainer: { borderTopLeftRadius: 6, borderBottomLeftRadius: 6, overflow: 'hidden' },
  containerRight: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 6 },
  body: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 14,
    marginBottom: 3,
  },
  address: {
    marginTop: 2,
    marginBottom: 2,
    fontSize: 11,
    lineHeight: 12,
  },
  rightContainer: {
    flex: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
});

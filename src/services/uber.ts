import { Linking, Alert } from 'react-native';
import { Toast } from 'native-base';

const clientId = 'LGT4W8iiwsBkJLIbd6uzg2o8HJo_Kb9q';
const UBER_UNIVERSAL_LINK = 'https://m.uber.com';

interface UberRideParams {
  pickup?: 'my_location' | string; // &pickup=my_location
  formattedAddress: string; // dropoff[formatted_address]=155%20Broadway%2C%20New%20York%2C%20NY%2C%20USA
  latitude?: number; // &dropoff[latitude]=40.709386
  longitude?: number; // &dropoff[longitude]=-74.010390
}

function formatUberRideParams(params: UberRideParams) {
  const result = [];
  result.push(
    'dropoff[formatted_address]=' + encodeURIComponent(params.formattedAddress)
  );
  result.push('dropoff[latitude]=' + params.latitude);
  result.push('dropoff[longitude]=' + params.longitude);
  return result.join('&');
}

const scheduleUber = async (params: UberRideParams): Promise<void> => {
  try {
    if (!params.longitude || !params.latitude) {
      Toast.show({ text: 'Unable to schedule Uber.' });
      return;
    }

    const url = [
      UBER_UNIVERSAL_LINK,
      '/ul?action=setPickup',
      '&client_id=',
      clientId,
      '&pickup=my_location',
      `&${formatUberRideParams(params)}`
    ].join('');

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    }
  } catch (error) {
    Alert.alert('Cannot Open Uber', 'We are unable to launch the uber app');
  }
};

const UberService = {
  scheduleUber
};

export default UberService;

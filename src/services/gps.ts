import {
  PermissionsAndroid,
  Platform,
  Alert,
  GeolocationReturnType,
  GeolocationError
} from 'react-native';

export type GeolocationSuccessCallback = (
  position: GeolocationReturnType
) => any;
export type GeolocationErrorCallback = (position: GeolocationError) => any;

const defaultOnError = (error: GeolocationError) => Alert.alert(error.message);

const askForDeviceLocation = async (
  onSuccess: GeolocationSuccessCallback,
  onError: GeolocationErrorCallback = defaultOnError
) => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Wonder would like your location',
        message: 'Use your location to find activities near you'
      }
    );

    console.log(`Android geo granted?`, granted);

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getDeviceLocation(onSuccess, onError);
    }
  } else {
    // iOS
    getDeviceLocation(onSuccess, onError);
  }
};

export const getDeviceLocation = (
  onSuccess: GeolocationSuccessCallback,
  onError: GeolocationErrorCallback
) => {
  console.log(`requesting user location`);
  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    timeout: 5000
  });
};

export default askForDeviceLocation;

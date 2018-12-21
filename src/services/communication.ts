import { Linking } from 'react-native';
import { Toast } from 'native-base';

export async function callPhoneNumber(phoneNumber?: string | null) {
  try {
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        Linking.openURL(url);
      }
    }
  } catch (error) {
    Toast.show({ text: `Cannot open ${phoneNumber}` });
  }
}

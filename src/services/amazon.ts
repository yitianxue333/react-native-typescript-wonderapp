import { Linking, Alert } from 'react-native';

const AMAZON_AFFILIATE_ID = 'wonderdatinga-20';
const AMAZON_BASE_URL = `https://www.amazon.com/gp/search?ie=UTF8&tag=${AMAZON_AFFILIATE_ID}&index=aps&keywords=`;

const search = async (query: string): Promise<void> => {
  try {
    const url = AMAZON_BASE_URL + encodeURIComponent(query);
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      Linking.openURL(url);
    }
  } catch (error) {
    Alert.alert('Cannot open Amazon', error);
  }
};

const AmazonService = {
  search
};

export default AmazonService;

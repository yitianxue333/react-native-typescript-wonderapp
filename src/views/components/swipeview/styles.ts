import Theme from 'src/assets/styles/theme';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const DEVICE_WIDTH = width;
export const DEVICE_HEIGHT = height;

export default StyleSheet.create({
  container: {
    flex: 1,
    width
  },
  titleContainer: {
    paddingVertical: 15
  },
  titleTxt: {
    textAlign: 'center',
    fontSize: 18
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15
  },
  dot: {
    paddingHorizontal: 2
  },
  skipTxt: {
    color: Theme.colors.textColor,
    textAlign: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  }
});

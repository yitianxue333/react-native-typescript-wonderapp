import { GestureResponderEvent } from 'react-native';
type TouchableOpacityOnPress =
  | ((event: GestureResponderEvent) => void)
  | undefined;

export default TouchableOpacityOnPress;

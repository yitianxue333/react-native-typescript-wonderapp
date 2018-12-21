import React from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleProp,
  ViewStyle
} from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export class KeyboardDismissView extends React.Component<Props> {
  render() {
    const { children, style } = this.props;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={style}>{children}</View>
      </TouchableWithoutFeedback>
    );
  }
}

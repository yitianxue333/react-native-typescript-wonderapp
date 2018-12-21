import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';
import { Text } from '.';
import { ThemeTextProps } from './text/text';

interface Props extends ThemeTextProps {
  text: string;
  color?: string;
  onPress?: any;
  style?: StyleProp<TextStyle>;
  btnStyle?: StyleProp<ViewStyle>;
}

export default class TextButton extends React.Component<Props> {
  render() {
    const { btnStyle, text, onPress, style, align, color, size } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={btnStyle}>
        <Text
          align={align}
          color={color}
          size={size}
          style={[styles.txt, style]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  txt: {}
});

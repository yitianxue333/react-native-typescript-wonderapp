import React from 'react';
import { Text } from '..';
import { TextProps, StyleSheet } from 'react-native';

class ErrorHint extends React.Component<TextProps> {
  public render() {
    const { children, style } = this.props;
    return <Text style={[styles.errorHintText, style]}>{children}</Text>;
  }
}

export default ErrorHint;

const styles = StyleSheet.create({
  errorHintContainer: {
    borderColor: 'red',
    borderWidth: 2
  },
  errorHintText: {
    color: 'red',
    fontSize: 9
  }
});

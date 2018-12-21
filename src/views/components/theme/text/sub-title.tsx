import React from 'react';
import { StyleSheet } from 'react-native';
import Text, { ThemeTextProps } from './text';

export default class SubTitle extends React.Component<ThemeTextProps> {
  render() {
    const { children, style, ...rest } = this.props;
    return (
      <Text style={[styles.text, style]} {...rest}>
        {children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12
  }
});

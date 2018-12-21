import React from 'react';
import { Text } from '.';
import { StyleSheet, TextProps } from 'react-native';
import Color from 'color';
import theme from 'src/assets/styles/theme';

interface LabelProps extends TextProps {}

export default class Label extends React.Component<LabelProps> {
  public render() {
    const { children, style, ...rest } = this.props;
    return (
      <Text style={[styles.label, style]} {...rest}>
        {children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 11,
    color: theme.colors.textColor
  },
  container: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: Color(theme.colors.textColor).lighten(0.2)
  },
  input: {
    fontFamily: theme.fonts.primary,
    color: theme.colors.textColor
  }
});

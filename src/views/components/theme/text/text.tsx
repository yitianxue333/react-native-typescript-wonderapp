import React from 'react';
import { Text as NativeText, TextProps, StyleSheet } from 'react-native';
import Theme from 'src/assets/styles/theme';

export interface ThemeTextProps extends TextProps {
  color?: string;
  size?: number;
  align?: 'left' | 'center' | 'right';
}

export default class Text extends React.Component<ThemeTextProps, any> {
  static defaultProps = {
    style: {},
    color: Theme.colors.textColor,
    fontSize: 14,
    align: 'left'
  };

  render() {
    const { size, align, children, style, color, ...rest } = this.props;

    return (
      <NativeText
        {...rest}
        style={[
          styles.text,
          { color, fontSize: size, textAlign: align },
          style
        ]}
      >
        {children}
      </NativeText>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: Theme.colors.textColor,
    fontFamily: Theme.fonts.primary
  }
});

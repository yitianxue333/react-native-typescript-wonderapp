import React from 'react';
import BaseButton, { BaseButtonProps } from './base-button';
import theme from 'src/assets/styles/theme';
import Color from 'color';

const palette = Color(theme.colors.backgroundPrimary);
export default class SecondaryButton extends React.Component<BaseButtonProps> {
  render() {
    const { disabled, innerStyle, ...props } = this.props;
    return (
      <BaseButton
        disabled={disabled}
        rounded
        color={theme.colors.textColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        innerStyle={[{ backgroundColor: palette.toString(), padding: 8 }, innerStyle]}
        {...props}
      />
    );
  }
}

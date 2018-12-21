import React from 'react';
import BaseButton, { BaseButtonProps } from './base-button';
import theme from 'src/assets/styles/theme';
import Color from 'color';
import { StyleSheet } from 'react-native';

function lighten(color: string, value: number) {
  return Color(color)
    .lighten(value)
    .toString();
}

const enabledColors = [
  theme.colors.cottonCandyBlue,
  theme.colors.cottonCandyPink
];
const disabledColors = [
  lighten(theme.colors.cottonCandyBlue, 0.1),
  lighten(theme.colors.cottonCandyPink, 0.1)
];
export default class PrimaryButton extends React.Component<BaseButtonProps> {
  render() {
    const { disabled, style, ...otherProps } = this.props;
    return (
      <BaseButton
        rounded
        color='#FFF'
        colors={disabled ? disabledColors : enabledColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.primaryButtonContainer, style]}
        disabled={disabled}
        {...otherProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  primaryButtonContainer: {
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1
  }
});

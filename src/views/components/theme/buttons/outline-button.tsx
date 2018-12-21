import React from 'react';
import BaseButton, { BaseButtonProps } from './base-button';
import theme from 'src/assets/styles/theme';
import Color from 'color';

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
export default class OutlineButton extends React.Component<BaseButtonProps> {
  render() {
    const { disabled } = this.props;
    return (
      <BaseButton
        rounded
        color='#FFF'
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#FFF'
        }}
        {...this.props}
      />
    );
  }
}

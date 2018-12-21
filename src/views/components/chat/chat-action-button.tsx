import React from 'react';
import theme from 'src/assets/styles/theme';
import Color from 'color';
import { BaseButton } from 'src/views/components/theme';
import { BaseButtonProps } from 'src/views/components/theme/buttons/base-button';

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

export default class ChatActionButton extends React.PureComponent<BaseButtonProps> {
  render() {
    const { disabled, bold } = this.props;
    return (
      <BaseButton
        bold
        rounded
        color='#FFF'
        colors={disabled ? disabledColors : enabledColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        {...this.props}
        style={{ padding: 5 }}
      />
    );
  }
}

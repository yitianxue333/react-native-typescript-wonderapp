import _ from 'lodash';
import React from 'react';
import { Switch } from 'react-native';
import SwitchValueChange from 'src/models/switch-value-change';
import { colors } from '@assets';

interface Props {
  disabled?: boolean;
  onValueChange?: SwitchValueChange;
  value?: boolean;
  initialValue?: boolean;
}

class Toggle extends React.Component<Props> {
  static defaultProps = {
    onValueChange: _.noop,
    value: false
  };

  onChangeValue = (value: boolean) => {
    const { onValueChange } = this.props;
    if (onValueChange) {
      onValueChange(value);
    }
  }

  render() {
    const { disabled, value } = this.props;

    const disabledState = disabled || !value;

    return (
      <Switch
        disabled={disabled}
        thumbTintColor={disabledState ? colors.lightPurple : colors.peach}
        tintColor={disabledState ? colors.lightPurple : colors.lightPeach}
        onTintColor={colors.lightPeach}
        onValueChange={this.onChangeValue}
        value={value}
        trackColor={disabledState ? 'white' : colors.lightPeach}
      />
    );
  }
}

export default Toggle;

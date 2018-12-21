import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Text from './text/text';
import Strong from './text/strong';
interface BooleanToggleProps {
  yesLabel?: string;
  noLabel?: string;
  initialValue?: boolean;
  onValueChange?: (value: boolean) => void;
}

interface BooleanToggleState {
  value: boolean;
}

class BooleanToggle extends React.Component<
  BooleanToggleProps,
  BooleanToggleState
> {
  static defaultProps = {
    yesLabel: 'Yes',
    noLabel: 'No'
  };

  state = {
    value: this.props.initialValue || true
  };

  setNo = () => {
    const { onValueChange } = this.props;

    this.setState({ value: false });
    if (onValueChange) {
      onValueChange(false);
    }
  }

  setYes = () => {
    const { onValueChange } = this.props;
    this.setState({ value: true });
    if (onValueChange) {
      onValueChange(true);
    }
  }

  renderLabel = ({
    label,
    selected
  }: {
    label?: string;
    selected: boolean;
  }) => {
    if (label) {
      const Wrapper = selected ? Strong : Text;
      return <Wrapper style={[styles.optionText]}>{label}</Wrapper>;
    }
  }

  render() {
    const { noLabel, yesLabel } = this.props;
    const { value } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.setYes}>
          {this.renderLabel({ label: yesLabel, selected: value })}
        </TouchableOpacity>
        <TouchableOpacity onPress={this.setNo}>
          {this.renderLabel({ label: noLabel, selected: !value })}
        </TouchableOpacity>
      </View>
    );
  }
}

export default BooleanToggle;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  optionText: {
    padding: 10
  }
});

import React from 'react';
import { View, Slider } from 'react-native';
import theme from 'src/assets/styles/theme';

export interface MultiPointSliderValue {
  selectedMinimum: number;
  selectedMaximum: number;
}

interface MultiPointSliderProps {
  min: number;
  max: number;
  initialMinValue?: number;
  initialMaxValue?: number;
  onValueChange?: any;
}

interface MultiPointSliderState {
  selectedMin: number;
  selectedMax: number;
}

class MultiPointSlider extends React.Component<
  MultiPointSliderProps,
  MultiPointSliderState
> {
  static getDerivedStateFromProps(
    props: MultiPointSliderProps,
    state: MultiPointSliderState
  ) {
    const { selectedMin, selectedMax } = state;
    const { min, max, initialMaxValue, initialMinValue } = props;
    const newState: Partial<MultiPointSliderState> = {};
    if (selectedMin < min) {
      newState.selectedMin = min;
    }

    if (selectedMax > max) {
      newState.selectedMax = max;
    }

    if (Object.keys(newState).length) {
      return newState;
    }

    return null;
  }

  state = {
    selectedMin: this.props.initialMinValue || this.props.min,
    selectedMax: this.props.initialMaxValue || this.props.max
  };

  onValueChange = (value: number) => {
    const { onValueChange } = this.props;
    onValueChange({ selectedMax: value, selectedMin: value });
  }

  render() {
    const { min, max } = this.props;
    const { selectedMin, selectedMax } = this.state;
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Slider
          minimumValue={min}
          maximumValue={max}
          thumbTintColor={theme.colors.primary}
          minimumTrackTintColor={theme.colors.primaryLight}
          value={selectedMax}
          // selectedMinimum={selectedMin}
          // selectedMaximum={selectedMax}
          // style={{ flex: 1, height: 70 }}
          onValueChange={this.onValueChange}
        />
      </View>
    );
  }
}

export default MultiPointSlider;

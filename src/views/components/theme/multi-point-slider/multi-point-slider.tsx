import React from 'react';
import { View, StyleSheet } from 'react-native';
import MultiSlider from 'react-native-multi-slider';
import theme from 'src/assets/styles/theme';
import { Text } from 'src/views/components/theme';
import { width as WIDTH } from '@assets';
import { IOS } from '@utils';

const commonMarker = {
  position: 'absolute',
  minWidth: 15
};

const localStyles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sliderContainer: {},
  track: {
    backgroundColor: theme.colors.lightGray,
    width: '100%'
  },
  marker: {
    width: 10,
    height: 30,
    borderRadius: 5,
    backgroundColor: theme.colors.lightPeach,
    borderWidth: 0,
    overflow: 'visible'
  },
  selected: {
    backgroundColor: theme.colors.lightPeach
  },
  sliderValueText: {
    ...commonMarker,
    top: -20
    // right: -2
  },
  sliderValueText2: {
    ...commonMarker,
    bottom: -40,
    right: -4
  }
});

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

  private onValuesChange = (vals: number[]): void => {
    console.log(`vals:`, vals);
    const { onValueChange } = this.props;

    const [selectedMin, selectedMax] = vals;

    this.setState({ selectedMin, selectedMax });

    onValueChange(selectedMin, selectedMax);
  }

  private renderValue1 = (): React.ReactNode => {
    const { selectedMin } = this.state;

    if (!IOS) {
      return null;
    }
    return (
      <Text size={12} style={localStyles.sliderValueText}>
        {`${selectedMin}`}
      </Text>
    );
  }

  private renderValue2 = (): React.ReactNode => {
    const { selectedMax } = this.state;

    if (!IOS) {
      return null;
    }

    return (
      <Text size={12} style={localStyles.sliderValueText2}>
        {`${selectedMax}`}
      </Text>
    );
  }

  render() {
    const { min, max } = this.props;
    const { selectedMin, selectedMax } = this.state;
    return (
      <View style={localStyles.container}>
        <MultiSlider
          min={min}
          max={max}
          values={[selectedMin, selectedMax]}
          sliderLength={WIDTH - 60}
          renderInsideMarker1={this.renderValue1}
          renderInsideMarker2={this.renderValue2}
          markerStyle={localStyles.marker}
          selectedStyle={localStyles.selected}
          trackStyle={localStyles.track}
          containerStyle={localStyles.sliderContainer}
          onValuesChange={this.onValuesChange}
          //   markerOffsetX={10}
        />
      </View>
    );
  }
}

export default MultiPointSlider;

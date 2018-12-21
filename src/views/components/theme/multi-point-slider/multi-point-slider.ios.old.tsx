import React from 'react';
import { View, StyleSheet } from 'react-native';
import MultiSlider from 'react-native-multi-slider';
import theme from 'src/assets/styles/theme';
import { Text } from 'src/views/components/theme';
import { width as WIDTH } from '@assets';

const localStyles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sliderContainer: { height: 70, width: '100%' },
  track: {
    backgroundColor: theme.colors.lightGray,
    width: '100%'
  },
  marker: {
    width: 30,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.lightPeach,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 0
    },
    elevation: 0,
    shadowRadius: 0,
    shadowOpacity: 0,
    borderWidth: 0
  },
  selected: {
    backgroundColor: theme.colors.lightPeach
  },
  sliderValueText: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center'
  },
  triangle: {
    position: 'absolute',
    top: -10,
    height: 0,
    width: 0,
    backgroundColor: theme.colors.lightPeach,
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftWidth: 5,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.peach,
    borderLeftColor: 'transparent'
  },
  sliderValueContainer: {
    position: 'absolute',
    bottom: -40,
    paddingVertical: 2.5,
    // paddingHorizontal: 15,
    width: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.lightPeach
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

  //   private renderCustomMarkerLeft = (): React.ReactNode => {
  //     return <View style={localStyles.marker} />;
  //   };

  //   private renderCustomMarkerRight = (): React.ReactNode => {
  //     return <View style={localStyles.marker} />;
  //   };

  private onValuesChange = (vals: number[]): void => {
    console.log(`vals:`, vals);

    const [selectedMin, selectedMax] = vals;

    this.setState({ selectedMin, selectedMax });
  }

  private renderValue1 = (): React.ReactNode => {
    const { selectedMin } = this.state;

    return (
      <Text size={12} style={localStyles.sliderValueText}>
        {`${selectedMin}`}
      </Text>
    );

    // NK: to implemente full design, WIP

    // return (
    //   <View style={localStyles.sliderValueContainer}>
    //     <View style={localStyles.triangle} />
    //     <Text color={theme.colors.white} size={14}>{`${selectedMin}`}</Text>
    //   </View>
    // );
  }

  private renderValue2 = (): React.ReactNode => {
    const { selectedMax } = this.state;
    return (
      <Text size={12} style={localStyles.sliderValueText}>
        {`${selectedMax}`}
      </Text>
    );
  }

  render() {
    const { min, max, onValueChange } = this.props;
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
          markerOffsetX={10}
        />
      </View>
    );
  }
}

export default MultiPointSlider;

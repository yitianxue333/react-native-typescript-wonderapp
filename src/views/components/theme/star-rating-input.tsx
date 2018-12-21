import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from 'src/assets/styles/theme';

interface StarRatingInputProps {
  size?: number;
  initialValue?: number;
  onValueChange?: (value: number) => void;
}

interface StarRatingInputState {
  value: number;
}

class StarRatingInput extends React.Component<
  StarRatingInputProps,
  StarRatingInputState
> {
  static defaultProps = {
    size: 25
  };

  state: StarRatingInputState = {
    value: this.props.initialValue || 0
  };

  onValueChange = (value: number) => {
    this.setState({ value });
  }

  renderOption = (key: number) => {
    const { value } = this.state;
    return (
      <TouchableOpacity
        style={styles.option}
        key={key}
        onPress={() => this.onValueChange(key)}
      >
        <Icon
          name='star'
          color={
            value >= key ? theme.colors.primaryLight : theme.colors.textColor
          }
          size={25}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const { size } = this.props;
    return (
      <View style={styles.container}>
        {_.range(1, 6).map(this.renderOption)}
      </View>
    );
  }
}

export default StarRatingInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  option: {
    padding: 5
  }
});

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from 'src/assets/styles/theme';

interface Props {
  rating: number;
  containerStyle?: StyleProp<ViewStyle>;
}

class RatingIndicator extends React.Component<Props> {
  renderRating = () => {
    const { rating } = this.props;
    switch (rating) {
      case 5:
        return (
          <Image source={require('../../assets/images/icons/small_5.png')} />
        );
      case 4:
        return (
          <Image source={require('../../assets/images/icons/small_4.png')} />
        );
      case 3:
        return (
          <Image source={require('../../assets/images/icons/small_3.png')} />
        );
      case 2:
        return (
          <Image source={require('../../assets/images/icons/small_2.png')} />
        );
      case 1:
        return (
          <Image source={require('../../assets/images/icons/small_1.png')} />
        );
      case 0:
        return (
          <Image source={require('../../assets/images/icons/small_0.png')} />
        );
      default:
        return (
          <Image source={require('../../assets/images/icons/small_5.png')} />
        );
    }

  }

  render() {
    const { containerStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderRating()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default RatingIndicator;

 // return [1, 2, 3, 4, 5].map((i: number) => (
    //   <Icon
    //     key={i}
    //     size={10}
    //     name='star'
    //     color={
    //       i <= rating ? theme.colors.primaryLight : theme.colors.textColorLight
    //     }
    //   />
    // ));

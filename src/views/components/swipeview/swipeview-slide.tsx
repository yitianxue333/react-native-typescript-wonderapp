import React from 'react';
import {
  FlatList,
  View,
  Button,
  ImageBackground,
  ImageSourcePropType
} from 'react-native';
import { Text } from '../theme';
import styles, { DEVICE_WIDTH } from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props {
  containerStyle?: object;
  title?: string;
  children: React.ReactNode;
  backgroundImage: ImageSourcePropType;
}

export default class SwipeViewSlide extends React.Component<Props> {
  renderTitle = (title?: string) => {
    if (title) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>{title}</Text>
        </View>
      );
    }
  }

  render() {
    const { containerStyle, children, title, backgroundImage } = this.props;

    if (backgroundImage) {
      return (
        <ImageBackground
          style={[styles.container, containerStyle]}
          source={backgroundImage}
        >
          {this.renderTitle(title)}
          {children}
        </ImageBackground>
      );
    }

    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderTitle(title)}
        {children}
      </View>
    );
  }
}

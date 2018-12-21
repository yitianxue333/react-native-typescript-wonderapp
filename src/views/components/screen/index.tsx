import React from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  StyleProp,
  ViewStyle
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GradientPoint from 'src/models/gradient-point';

interface Props {
  children?: any;
  backgroundImage?: any;
  backgroundGradient?: string[];
  gradientStart?: GradientPoint;
  gradientEnd?: GradientPoint;
  style?: StyleProp<ViewStyle>;
  horizontalPadding?: number;
}

class Screen extends React.Component<Props> {
  static defaultProps = {
    gradientStart: undefined
  };

  render() {
    const {
      children,
      backgroundImage,
      backgroundGradient,
      gradientEnd,
      gradientStart,
      style,
      horizontalPadding
    } = this.props;

    const renderedStyles: any = {};

    if (horizontalPadding) {
      renderedStyles.paddingHorizontal = horizontalPadding;
    }

    if (backgroundImage) {
      return (
        <ImageBackground
          source={backgroundImage}
          style={[styles.container, style, renderedStyles]}
        >
          {children}
        </ImageBackground>
      );
    } else if (backgroundGradient) {
      return (
        <LinearGradient
          colors={backgroundGradient}
          start={gradientStart}
          end={gradientEnd}
          style={[styles.container, style, renderedStyles]}
        >
          {children}
        </LinearGradient>
      );
    }

    return (
      <View style={[styles.container, style, renderedStyles]}>{children}</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }
});

export default Screen;

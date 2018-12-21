import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ImageStyle,
  ViewStyle
} from 'react-native';
import { WonderImage } from '../theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../../../assets/styles/theme';

export enum AvatarSize {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xmd = 'xmd'
}

interface AvatarProps {
  unreadMessage?: boolean;
  bordered?: boolean;
  rounded?: boolean;
  circle?: boolean;
  uri?: string | null;
  size?: AvatarSize | 'xs' | 'sm' | 'xmd' | 'md' | 'lg' | 'xl';
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ImageStyle>;
  chat?: any;
  currentUser?: { id: number };
  sender?: number;
}

class Avatar extends React.Component<AvatarProps> {
  static defaultProps = {
    size: AvatarSize.sm,
    bordered: false,
    rounded: false,
    circle: false,
    uri: null
  };

  static Sizes = {
    xs: 32,
    sm: 64,
    xmd: 74,
    md: 96,
    lg: 128,
    xl: 160
  };

  getDimensions = () => {
    const { size } = this.props;
    return Avatar.Sizes[size || AvatarSize.sm];
  }

  getContainerStyles = () => {
    const { bordered, rounded, circle } = this.props;
    const length = this.getDimensions();
    return {
      height: length,
      width: length,
      borderRadius: circle ? length / 2 : rounded ? 5 : 0,
      borderWidth: bordered ? 3 : 0
    };
  }

  renderImage = () => {
    const { uri, style, chat, circle } = this.props;

    if (uri) {
      if (circle && chat) {
        return (
          <View>
            {uri ? (
              <WonderImage
                style={[
                  {
                    ...this.getContainerStyles(),
                    width: this.getDimensions(),
                    height: this.getDimensions()
                  },
                  style
                ]}
                uri={uri}
              />
            ) : (
              <Icon
                color='#BBB'
                name='user'
                size={this.getDimensions() * 0.4}
              />
            )}
          </View>
        );
      } else {
        return (
          <WonderImage
            style={[
              {
                ...this.getContainerStyles(),
                width: this.getDimensions(),
                height: this.getDimensions()
              },
              style,
              { margin: 2 }
            ]}
            uri={uri}
          />
        );
      }
    }
  }

  render() {
    const { containerStyle } = this.props;
    return (
      <View
        style={[
          styles.avatarContainer,
          this.getContainerStyles(),
          containerStyle
        ]}
      >
        {this.renderImage()}
      </View>
    );
  }
}

export default Avatar;

const styles = StyleSheet.create({
  avatarContainer: {
    borderColor: '#FFF',
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowColor: '#000',
    shadowOpacity: 0.3
  }
});

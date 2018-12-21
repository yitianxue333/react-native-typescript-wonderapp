import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleProp,
  Text
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import WonderImage from '../wonder-image';
import api, { ApiConfig, BASE_URL } from 'src/services/api';
import Video from 'react-native-video';
import { Response } from 'src/models/image-picker';
import ProfileImage from 'src/models/profile-image';
import theme from 'src/assets/styles/theme';

interface Props {
  videoSource?: string;
  source?: ProfileImage;
  featured?: boolean;
  onPress: (data: Response | null) => void;
  size?: number;
  gutter: number;
  video?: boolean;
}

export default class MediaGridItem extends React.Component<Props> {
  state: any = {
    isActive: true
  };

  static defaultProps = {
    videoSource: undefined,
    source: undefined,
    featured: false,
    size: 75,
    gutter: 0,
    video: false,
    isFocused: true
  };

  renderContainerStyles = () => {
    const { size, gutter } = this.props;
    return {
      width: size,
      height: size,
      margin: gutter
    };
  }

  renderMediaContent = () => {
    const { source, videoSource, video, size } = this.props;
    if (video && videoSource) {
      return (
        <Video
          paused
          source={{ uri: `${videoSource}` }}
          style={{ width: size, height: size, zIndex: 2 }}
          controls={false}
        />
      );
    } else if (source) {
      return (
        <WonderImage
          style={{ width: size, height: size, borderRadius: 10 }}
          uri={source.url}
        />
      );
    }
    return null;
  }

  onPress = () => {
    const { source, videoSource, onPress } = this.props;

    if (source) {
      onPress({ ...source, uri: `${BASE_URL}/${source.url}` });
    } else if (videoSource) {
      onPress({ uri: `${BASE_URL}/${videoSource}` });
    }
  }

  render() {
    const { source, onPress, size, video, videoSource } = this.props;
    const containerStyles = [styles.container, this.renderContainerStyles()];

    if (!source && !videoSource) {
      return (
        <TouchableOpacity onPress={() => onPress(null)}>
          <LinearGradient
            style={containerStyles}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={['#FFF799', '#FFC3A0']}
          >
            <Icon
              name={video ? 'video-camera' : 'plus'}
              size={video ? 22 : size ? size / 5 : 16}
              color={video ? theme.colors.textColor : '#fff'}
            />
            {video && (
              <Text
                allowFontScaling={false}
                style={{ fontSize: 9, color: theme.colors.textColor }}
              >
                Upload vibe {'\n'} video clip
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={this.onPress}>
        <LinearGradient
          style={containerStyles}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={['#FFF799', '#FFC3A0']}
        >
          {this.renderMediaContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#DDD'
  }
});

import _ from 'lodash';
import React from 'react';
import {ImageProps, Image, ImageStyle, StyleProp, Dimensions} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import api, { BASE_URL } from 'src/services/api';
import Omit from 'src/models/omit';
import FastImage from 'react-native-fast-image';

const imageExtension = `&auto=enhance,format&fit=crop&crop=entropy&q=60`;

interface Props extends Omit<ImageProps, 'source'> {
  uri: string;
  background?: boolean;
  children?: any;
  style?: StyleProp<ImageStyle>;
}

class WonderImage extends React.PureComponent<Props> {
  static defaultProps = {
    background: false
  };

  render() {
    const { uri, children, background, style, ...rest } = this.props;

    if (uri) {
      // Handle SVG images differently
      if (uri.toString().endsWith('.svg')) {
        return (
          <SvgUri
            height={_.get(style, 'height', 15)}
            width={_.get(style, 'width', 15)}
            source={{ uri: `${BASE_URL}/${uri}` }}
            {...rest}
          />
        );
      }

      if (background) {
        return (
          <FastImage
            fallback={true}
            style={[style, uri !== 7 ? null: {height: Dimensions.get('window').height} ]}
            {...rest}
            source={{
              uri:
                uri !== 7
                  ? `${uri}?w=${style.width}&h=${style.height}${imageExtension}`
                  : `https://wonderapp.imgix.net/female-silhouette.jpg`,
              priority: FastImage.priority.high
            }}
          >
            {children}
          </FastImage>
        );
      }
      return (
        <Image
          style={style}
          source={{
            uri: uri
              ? `${uri}?crop=faces?w=${400}&h=${400}${imageExtension}`
              : `https://wonderapp.imgix.net/female-silhouette.jpg`
          }}
          {...rest}
        />
      );
    }
    return null;
  }
}

export default WonderImage;

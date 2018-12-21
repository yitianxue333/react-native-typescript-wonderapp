import _ from 'lodash';
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageSourcePropType,
  TouchableOpacity
} from 'react-native';
import MediaGridItem from './media-grid-item';

import { connect } from 'react-redux';
import { selectCurrentUser } from 'src/store/selectors/user';
import { Response } from 'src/models/image-picker';
import User from 'src/models/user';
import WonderAppState from 'src/models/wonder-app-state';

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state)
});

interface Props {
  featured?: ImageSourcePropType;
  items?: any;
  images?: any[];
  video?: any;
  onNewPicture?: (data: Response | null) => void;
  onNewVideo?: (data: Response | null) => void;
  gutter: number;
  width: number;
  currentUser: User;
}

class MediaGrid extends React.Component<Props> {
  static defaultProps = {
    gutter: 5,
    width: 200
  };

  calcGridSpace = (span: number) => {
    const { gutter, width } = this.props;
    const base = (width / 3 - 2 * gutter) * span;

    let result = base;
    if (span > 1) {
      result += span * gutter;
    }

    return result;
  }

  render() {
    const {
      featured,
      gutter,
      onNewPicture,
      onNewVideo,
      currentUser
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={[styles.column]}>
            <MediaGridItem
              featured
              size={this.calcGridSpace(2)}
              gutter={gutter}
              onPress={onNewPicture}
              source={_.get(currentUser, 'images[0]', '')}
            />
          </View>
          <View style={[styles.column]}>
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
              source={_.get(currentUser, 'images[1]', '')}
            />
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
              source={_.get(currentUser, 'images[2]', '')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
              source={_.get(currentUser, 'images[3]', '')}
            />
          </View>
          <View style={styles.column}>
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
              source={_.get(currentUser, 'images[4]', '')}
            />
          </View>
          <View style={styles.column}>
            <MediaGridItem
              video
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewVideo}
              videoSource={_.get(currentUser, 'video')}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default connect(mapState)(MediaGrid);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    flexDirection: 'column'
  },
  container: {},
  featuredContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 154,
    height: 154
  }
});

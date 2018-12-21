import _ from 'lodash';
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Avatar from 'src/views/components/theme/avatar';
import Conversation from 'src/models/conversation';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';
import { fallbackImageUrl } from 'src/services/api';

interface LatestMatchesItemProps {
  chat: Conversation;
  onPress: TouchableOpacityOnPress;
}

class LatestMatchesItem extends React.Component<LatestMatchesItemProps> {
  static defaultProps = {
    chat: {
      messages: []
    }
  };

  render() {
    const { chat, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View flex={5}>
          <Avatar
            size={'xmd'}
            circle
            uri={_.get(chat, 'partner.images[0].url', fallbackImageUrl)}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default LatestMatchesItem;

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  textContainer: {
    justifyContent: 'center'
  }
});

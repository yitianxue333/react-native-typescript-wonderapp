import _ from 'lodash';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

//
import Wonder from '../wonder/wonder';
import theme from 'src/assets/styles/theme';
import Topic from 'src/models/topic';

interface Props {
  topic: Topic;
  selected?: boolean;
  onPress?: Function;
}

export default class WonderPickerItem extends React.Component<Props> {
  static defaultProps = {
    selected: false,
    onPress: _.noop
  };

  render() {
    const { topic, selected, onPress } = this.props;

    return (
      <TouchableOpacity
        style={[styles.btn, selected && styles.selectedBtn]}
        onPress={() => onPress && onPress(topic)}
      >
        <Wonder
          labelStyles={{ color: '#000' }}
          topic={topic}
          active={selected}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 5,
    backgroundColor: '#FFF'
  },
  selectedBtn: {
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.5
  }
});

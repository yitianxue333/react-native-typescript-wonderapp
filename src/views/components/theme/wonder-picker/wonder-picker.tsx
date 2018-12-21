import React from 'react';
import { StyleSheet, View, FlatList, StyleProp, ViewStyle } from 'react-native';
import WonderPickerItem from './wonder-picker-item';

import _ from 'lodash';
import Topic from 'src/models/topic';

interface Props {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  topics: Topic[];
  limit?: number;
  onChangeSelected?: Function;
  initialValue?: Topic[];
}

interface State {
  selected: Topic[];
}

export default class WonderPicker extends React.Component<Props, State> {
  static defaultProps = {
    topics: []
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      selected: props.initialValue || []
    };
  }

  onChange = (topic: Topic) => {
    const { limit } = this.props;
    const { selected } = this.state;
    if (
      (!limit || selected.length < limit) &&
      !selected.filter((t: Topic) => t.name === topic.name).length
    ) {
      this.setState(
        {
          selected: [...selected, topic]
        },
        this.update
      );
    } else {
      this.setState(
        {
          selected: selected.filter((t: Topic) => t.name !== topic.name)
        },
        this.update
      );
    }
  }

  update = () => {
    const { selected } = this.state;
    const { onChangeSelected } = this.props;
    if (onChangeSelected) {
      onChangeSelected(selected);
    }
  }

  renderRow = ({ item }: { item: any }) => {
    return <View style={styles.row}>{item.map(this.renderWonder)}</View>;
  }

  renderWonder = (topic: Topic) => {
    const { selected } = this.state;
    return (
      <WonderPickerItem
        key={topic.name}
        topic={topic}
        selected={!!selected.filter((t: Topic) => t.name === topic.name).length}
        onPress={this.onChange}
      />
    );
  }

  keyExtractor = (item: any, index: any) => index.toString();

  render() {
    const { topics, style, contentContainerStyle } = this.props;
    const groupedTopics = _.chunk(topics, 3);
    return (
      <FlatList
        style={[styles.container, style]}
        contentContainerStyle={contentContainerStyle}
        keyExtractor={this.keyExtractor}
        data={groupedTopics}
        renderItem={this.renderRow}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // height: '100%'
  },
  row: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

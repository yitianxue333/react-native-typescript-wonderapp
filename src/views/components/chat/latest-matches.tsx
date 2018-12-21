import React from 'react';
import { FlatList, View, StyleSheet, ScrollView } from 'react-native';
import { Title } from '../theme';
import { LatestMatchesItem } from '.';
import Conversation from 'src/models/conversation';

interface LatestMatchesProps {
  onRefresh?: () => void;
  chats?: Conversation[];
  onPressChat: Function;
}

class LatestMatches extends React.Component<LatestMatchesProps> {
  static defaultProps = {
    chats: []
  };

  keyExtractor = (item: Conversation, index: number) => {
    return `${item.id}`;
  }

  renderItem = ({ item: chat }: { item: Conversation }) => {
    const { onPressChat } = this.props;
    return <LatestMatchesItem chat={chat} onPress={() => onPressChat(chat)} />;
  }

  renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Title>No Matches</Title>
      </View>
    );
  }

  render() {
    const { chats, onRefresh } = this.props;
    if (chats && chats.length) {
      return (
        <ScrollView
          style={{ borderBottomWidth: 1, borderBottomColor: '#e6e6ec' }}
        >
          <FlatList
            refreshing={false}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            data={chats || []}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            horizontal={true}
          />
        </ScrollView>
      );
    }
    return this.renderEmpty();
  }
}

export default LatestMatches;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1
  }
});

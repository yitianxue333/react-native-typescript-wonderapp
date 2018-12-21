import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Title } from '../theme';
import { ChatListItem } from '.';
import Conversation from 'src/models/conversation';

interface ChatListProps {
  onRefresh?: () => void;
  chats?: Conversation[];
  onPressChat: Function;
  currentUser: number;
}

class ChatList extends React.PureComponent<ChatListProps> {
  static defaultProps = {
    chats: []
  };

  keyExtractor = (item: Conversation, index: number) => {
    return `${item.id}`;
  }

  renderItem = ({ item: chat }: { item: Conversation }) => {
    const { onPressChat, currentUser } = this.props;
    return (
      <ChatListItem
        currentUser={currentUser}
        chat={chat}
        onPress={() => onPressChat(chat)}
      />
    );
  }

  renderEmpty = () => {
    return <View />;
  }

  render() {
    const { chats, onRefresh } = this.props;

    if (!chats || chats.length) {
      return (
        <FlatList
          refreshing={false}
          onRefresh={onRefresh}
          contentContainerStyle={styles.flatList}
          showsVerticalScrollIndicator={false}
          data={chats || []}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      );
    }
    return this.renderEmpty();
  }
}

export default ChatList;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1
  },
  flatList: {
    paddingBottom: 50
  }
});

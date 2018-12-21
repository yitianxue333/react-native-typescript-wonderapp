import React from 'react';
import _ from 'lodash';
import Screen from 'src/views/components/screen';
import { ChatList, LatestMatches } from 'src/views/components/chat';
import { Title } from 'src/views/components/theme';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';

import { Dispatch } from 'redux';
import {
  getConversations,
  getConversation,
  ghostContact
} from 'src/store/sagas/conversations';

import {
  persistNewReceivedMessage,
  persistChatSearch
} from 'src/store/reducers/chat';

import { connect } from 'react-redux';
import { selectCurrentUser } from 'src/store/selectors/user';
import Conversation from 'src/models/conversation';
import WonderAppState from 'src/models/wonder-app-state';
import Chat from 'src/models/chat';
import { View, StyleSheet, Alert, Dimensions, Modal } from 'react-native';
import ChatActionButton from 'src/views/components/chat/chat-action-button';
import SearchBar from 'react-native-searchbar';
import { getAttendances } from 'src/store/sagas/attendance';
import ActionCable from 'react-native-actioncable';
import { DOMAIN } from 'src/services/api';
import { TextButton, PrimaryButton, Text } from 'src/views/components/theme';

const { width } = Dimensions.get('window');

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  conversations: Conversation[];
  onRefreshConversations: () => void;
  onGetConversation: (partnerId: number, params: object) => void;
  onGetAttendances: () => void;
  token: string;
  onReceiveMessage: (data: object) => void;
  currentUser: any;
  chat: Chat;
  onSearchChange: (data: string) => void;
}

interface ChatListScreenState {
  isSearchModalOpen: boolean;
  results?: Conversation[];
  handleChangeText: string;
}

const mapState = (state: WonderAppState) => ({
  token: state.user.auth.token,
  currentUser: selectCurrentUser(state),
  conversations: state.chat.conversations,
  chat: state.chat
});

const mapDispatch = (dispatch: Dispatch) => ({
  onRefreshConversations: () => dispatch(getConversations()),
  onGetConversation: (partnerId: number, params: object) =>
    dispatch(getConversation({ id: partnerId, successRoute: 'Chat', params })),
  onGetAttendances: () => dispatch(getAttendances()),
  onReceiveMessage: (data: object) => dispatch(persistNewReceivedMessage(data)),
  onSearchChange: (data: object) => dispatch(persistChatSearch(data))
});

class ChatListScreen extends React.Component<Props> {
  searchBar?: any;
  cable: any;
  appChat: any;

  state: ChatListScreenState = {
    isSearchModalOpen: false,
    results: [],
    handleChangeText: ''
  };

  componentWillMount() {
    const { token } = this.props;
    this.props.onRefreshConversations();
    this.props.onGetAttendances();

    this.appChat = {};
    this.cable = ActionCable.createConsumer(
      `wss://${DOMAIN}/cable?token=${token}`
    );
    this.appChat = this.cable.subscriptions.create(
      {
        channel: 'ConversationChannel'
      },
      {
        received: (data: any) => {
          if (
            data ===
            `{"error":{"message":"Event 'read' cannot transition from 'read'. "}}`
          ) {
            return;
          } else if (
            data ===
            '{"error":{"message":"Validation failed: Recipient must have already matched"}}'
          ) {
            this.showGhostedAlert();
          } else {
            this.props.onReceiveMessage(data);
          }
        },
        deliver: ({ message, recipient_id }) => {
          this.appChat.perform('deliver', { body: message, recipient_id });
        }
      }
    );
  }

  componentDidUpdate(prevProps: any) {
    const { chat } = this.props;
    if (chat.newOutgoingMessage.hasOwnProperty('message')) {
      if (
        chat.newOutgoingMessage.message !==
        prevProps.chat.newOutgoingMessage.message
      ) {
        this.appChat.deliver({
          message: chat.newOutgoingMessage.message.text,
          recipient_id: chat.newOutgoingMessage.recipient_id
        });
      }
    }
    if (
      !_.isEmpty(chat.lastReadMessage) &&
      chat.lastReadMessage !== prevProps.chat.lastReadMessage
    ) {
      this.appChat.perform('read', {
        message_id: chat.lastReadMessage.last_message.id
      });
    }

    const { navigation, onGetConversation } = this.props;
    const redirect = navigation.getParam('redirect', '');
    const partnerId = navigation.getParam('partnerId', null);
    if (partnerId && redirect) {
      onGetConversation(partnerId, { redirect });
      navigation.setParams({ partnerId: null, redirect: '' });
    }
  }

  goToChat = (chat: Chat) => {
    const { onGetConversation } = this.props;
    onGetConversation(chat.partner.id, {});
    this.props.navigation.navigate('Chat', { name: chat.partner.first_name });
  }

  openSearchModal = () => {
    this.setState({ isSearchModalOpen: !this.state.isSearchModalOpen });
  }

  handleResults = (results: Conversation[]) => {
    const { conversations } = this.props;
    if (!results.length && !this.state.handleChangeText) {
      this.setState({ results: conversations });
    } else {
      this.setState({ results });
    }
  }

  handleChangeText = (text: string) => {
    this.props.onSearchChange(text);
  }

  componentWillUnmount() {
    if (this.appChat) {
      this.cable.subscriptions.remove(this.appChat);
    }
  }

  showGhostedAlert = () => {
    Alert.alert(
      'Sorry!',
      'This person has removed you from their conversations',
      [{ text: 'OK' }],
      { cancelable: false }
    );
  }

  renderSearchbar = () => {
    const { conversations } = this.props;
    if (this.state.isSearchModalOpen) {
      return (
        <SearchBar
          ref={(ref: any) => (this.searchBar = ref)}
          data={conversations}
          onBack={this.openSearchModal}
          handleResults={this.handleResults}
          handleChangeText={this.handleChangeText}
          showOnLoad
        />
      );
    }
  }

  renderSearchButton() {
    const { conversations } = this.props;
    if (conversations.length) {
      return (
        <View style={{ position: 'absolute', right: 0, left: 0, bottom: 0 }}>
          <PrimaryButton
            rounded={false}
            title='Search'
            onPress={this.openSearchModal}
          />
        </View>
      );
    }
    return null;
  }

  render() {
    const {
      conversations,
      onRefreshConversations,
      currentUser,
      chat
    } = this.props;
    const filteredConvos = conversations.filter(
      (c) => c.partner !== null && !c.last_message
    );

    return (
      <Screen horizontalPadding={20}>
        {this.renderSearchbar()}
        <Title style={styles.latestText}>Latest Matches</Title>
        <View>
          <LatestMatches
            onRefresh={onRefreshConversations}
            chats={filteredConvos}
            onPressChat={this.goToChat}
          />
        </View>
        <ChatList
          currentUser={currentUser}
          onRefresh={onRefreshConversations}
          chats={this.props.conversations}
          onPressChat={this.goToChat}
        />

        {this.renderSearchButton()}
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(ChatListScreen);

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  ghostButtonStyle: {
    marginLeft: 20,
    marginTop: 2,
    borderRadius: 100 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 46,
    height: 46,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#fcbd77'
  },
  searchButtonContainer: {
    alignItems: 'stretch',
    width: '100%'
  },
  latestText: { marginTop: 12 }
});

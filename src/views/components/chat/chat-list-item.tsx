import _ from 'lodash';
import React from 'react';
import { Text, Title, SmallText } from '../theme';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Avatar from 'src/views/components/theme/avatar';
import theme from 'src/assets/styles/theme';
import { Dispatch } from 'redux';
import Conversation from 'src/models/conversation';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';
import { ghostContact } from 'src/store/sagas/conversations';
import { SwipeRow, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { deleteConversation } from 'src/store/sagas/conversations';
import { persistGhostMessage } from 'src/store/reducers/chat';
import { fallbackImageUrl } from 'src/services/api';
import { setAlertModal, IAPIAlert } from '@actions';

interface ChatListItemProps {
  chat: Conversation;
  onPress: TouchableOpacityOnPress;
  currentUser: { id: number };
  onGhostContact: (data: object) => void;
  onSendGhostMessage: (data: object) => void;
  setAlertModal: (data: IAPIAlert) => void;
}

const mapDispatch = (dispatch: Dispatch) => ({
  onDeleteConversation: (data: object) => dispatch(deleteConversation(data)),
  onGhostContact: (data: object) => dispatch(ghostContact(data)),
  onSendGhostMessage: (data: object) => dispatch(persistGhostMessage(data)),
  setAlertModal: (data: IAPIAlert) => dispatch(setAlertModal(data))
});

class ChatListItem extends React.PureComponent<ChatListItemProps> {
  static defaultProps = {
    chat: {
      messages: []
    }
  };

  renderRecentMessage = () => {
    const { chat, currentUser } = this.props;
    const f = new Date();
    const d = new Date(chat.last_message.sent_at);
    // d.setHours(d.getHours() - f.getHours());
    const hours: number = Math.abs(f - d) / 36e5;

    if (chat && chat.last_message) {
      if (hours > 72) {
        return (
          <Text numberOfLines={2} style={styles.oldText}>
            {_.get(chat, 'last_message.body', '') || ''}
          </Text>
        );
      }
      return (
        <Text
          numberOfLines={2}
          style={[
            !chat.last_message.read_at &&
            chat.last_message.sender_id !== currentUser.id
              ? { color: 'black' }
              : null,
            { fontSize: 14 }
          ]}
        >
          {chat.last_message.body == null ? '' : chat.last_message.body}
        </Text>
      );
    }
    return <SmallText>No Messages</SmallText>;
  }

  renderGreenDot() {
    const { chat } = this.props;
    if (chat.partner.online) {
      return (
        <View style={{ marginLeft: 10 }}>
          <SmallText>
            <Icon name='circle' size={10} color='#48dc0e' />
          </SmallText>
        </View>
      );
    }
    return null;
  }
  renderDistance() {
    const { chat } = this.props;

    return (
      <View style={{ marginTop: 8 }}>
        <SmallText>
          {chat.partner.distance &&
            _.get(chat, 'partner.distance', 0).toFixed(0)}{' '}
          miles
        </SmallText>
      </View>
    );
  }

  deleteConversation = () => {
    const { chat } = this.props;
    this.props.onGhostContact({ partner: chat.partner });
    this.props.onSendGhostMessage({
      ghostMessage: '',
      conversation_id: chat.id,
      partner: chat.partner
    });
  }

  showAlert = () => {
    this.props.setAlertModal({
      title: 'Please Confirm',
      body: `Are you sure you want to unmatch?`,
      alertVisible: true,
      buttonTitle: 'Cancel',
      buttonTitle2: 'Unmatch',
      onPress2: this.deleteConversation
    });
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    const { chat, onPress, currentUser } = this.props;

    if (!chat.last_message) {
      return null;
    }

    return (
      <SwipeRow
        style={styles.swipeContainer}
        rightOpenValue={-75}
        right={
          <Button danger onPress={this.showAlert}>
            <Icon name='trash' size={30} color='#FFF' />
          </Button>}
        body={
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.container}
            onPress={onPress}
          >
            <View style={styles.avatarOuterContainer}>
              <View
                style={
                  chat.last_message.sender_id !== currentUser.id &&
                  !chat.last_message.read_at
                    ? styles.unreadMessage
                    : null
                }
              >
                <Avatar
                  size={'xmd'}
                  chat={chat}
                  sender={chat.last_message.sender_id}
                  currentUser={currentUser}
                  circle
                  uri={_.get(chat, 'partner.images[0].url', fallbackImageUrl)}
                />
              </View>
            </View>
            <View flex={2} style={styles.textContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Title style={{ color: '#000' }}>
                  {chat.partner.first_name}{' '}
                </Title>
                {this.renderGreenDot()}
              </View>
              {this.renderRecentMessage()}
            </View>
          </TouchableOpacity>
        }
      />
    );
  }
}

export default connect(
  null,
  mapDispatch
)(ChatListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4
  },
  textContainer: {
    justifyContent: 'center',
    paddingLeft: 20
  },
  swipeContainer: {
    borderBottomWidth: 1,
    height: 98,
    borderBottomColor: '#e6e6ec'
  },
  avatarOuterContainer: {
    height: 86,
    width: 86,
    justifyContent: 'center',
    alignItems: 'center'
  },
  unreadMessage: {
    height: 88,
    width: 88,
    borderColor: theme.colors.primary,
    borderWidth: 5,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  oldText: { color: '#eb4d4b', fontSize: 14 }
});

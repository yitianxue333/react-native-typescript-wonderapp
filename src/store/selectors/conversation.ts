import _ from 'lodash';
import WonderAppState from 'src/models/wonder-app-state';
import { createSelector } from 'reselect';
import Conversation, { DecoratedConversation } from 'src/models/conversation';
import { selectCurrentUser } from './user';
import User from 'src/models/user';
import ChatResponseMessage from 'src/models/chat-response-message';
import GiftedChatMessage from 'src/models/chat-message';
import { BASE_URL } from 'src/services/api';
const avatarExtension =
  '?w=100&h=100&auto=enhance,format&fit=crop&crop=entropy&q=60';

const selectConversation = (state: WonderAppState) => state.chat.conversation;

export const getDecoratedConversation = createSelector(
  [selectCurrentUser, selectConversation],
  (currentUser, conversation): DecoratedConversation => {
    return conversation as DecoratedConversation;
  }
);

export const decorateMessagesForGiftedChat = (
  currentUser: User,
  conversation: Conversation | null
): DecoratedConversation | undefined => {
  if (conversation) {
    const messages: ChatResponseMessage[] = _.get(conversation, 'messages', []);
    return {
      ...conversation,
      giftedChatMessages: messages.map((message: ChatResponseMessage) => {
        const owner: User =
          message.sender_id === currentUser.id
            ? currentUser
            : conversation.partner;

        const o: GiftedChatMessage = {
          _id: message.id,
          text: message.body,
          createdAt: message.sent_at,
          user: {
            _id: message.sender_id,
            avatar: owner.images.length
              ? `${owner.images[0].url}${avatarExtension}`
              : `https://wonderapp.imgix.net/female-silhouette.jpg`
          }
        };

        return o;
      })
    };
  }

  return undefined;
};

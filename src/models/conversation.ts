import ChatResponseMessage from './chat-response-message';
import User from './user';
import GiftedChatMessage from './chat-message';
import { number } from 'prop-types';

interface Conversation {
  id: number;
  partner: User;
  last_message: ChatResponseMessage;
  messages: ChatResponseMessage[];
}

interface DecoratedConversation extends Conversation {
  giftedChatMessages: GiftedChatMessage[];
}

interface ConversationNewMessage {
  conversation_id: number;
  recipient_id: number;
  recipient: object;
  sender: User;
  message: {
    body: string;
  };
}

export { DecoratedConversation, ConversationNewMessage };

export default Conversation;

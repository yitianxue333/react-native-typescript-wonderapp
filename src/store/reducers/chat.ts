import { handleActions, createAction, Action } from 'redux-actions';
import Conversation from '../../models/conversation';
import Activity from '../../models/activity';
import ActivityDetails from '../../models/activity-details';

export interface ChatState {
  readonly conversations: Conversation[];
  readonly conversation: Conversation | null;
  readonly activities: Activity[];
  readonly activity: ActivityDetails | null;
  readonly conversationsCopy: Conversation[];
}

export const initialState: ChatState = {
  conversations: [],
  conversation: [],
  conversationsCopy: [],
  activities: [],
  activity: null,
  newOutgoingMessage: {},
  conversationsLib: [],
  lastReadMessage: {},
  ghostMessage: undefined
};

export const persistConversations = createAction('PERSIST_CONVERSATIONS');
export const persistConversation = createAction('PERSIST_CONVERSATION');
export const persistNewMessage = createAction('PERSIST_NEW_MESSAGE');
export const persistActivities = createAction('PERSIST_ACTIVITIES');
export const persistActivity = createAction('PERSIST_ACTIVITY');

export const persistNewChatMessage = createAction('PERSIST_NEW_CHAT_MESSAGE');
export const persistNewReceivedMessage = createAction(
  'PERSIST_NEW_RECEIVED_MESSAGE'
);
export const persistMessageAsRead = createAction('PERSIST_MESSAGE_AS_READ');
export const persistGhostMessage = createAction('PERSIST_GHOST_MESSAGE');

export const persistChatSearch = createAction('PERSIST_CHAT_SEARCH');

export const clearCurrentConversation = createAction('CLEAR_CURRENT_CONVERSATION');

export default handleActions(
  {
      CLEAR_CURRENT_CONVERSATION: (state: ChatState, action: Action<any>) => {
      return {
        ...state,
        conversation: []
      };
    },
    PERSIST_CHAT_SEARCH: (state: ChatState, action: Action<any>) => {
      const results = state.conversations.filter((c) =>
        c.partner.first_name.includes(action.payload)
      );
      if (action.payload) {
        return {
          ...state,
          conversations: results
        };
      } else {
        return {
          ...state,
          conversations: state.conversationsCopy
        };
      }
    },
    PERSIST_GHOST_MESSAGE: (state: ChatState, action: Action<any>) => {
      const removedConversation = state.conversations.filter(
        (c) => c.id !== action.payload.conversation_id
      );
      return {
        ...state,
        ghostMessage: action.payload,
        conversations: removedConversation
      };
    },
    PERSIST_MESSAGE_AS_READ: (state = initialState, action: Action<any>) => {
      const { user, conversation_id } = action.payload;
      if (state.conversationsLib.indexOf(conversation_id !== -1)) {
        let lastRead;
        const updateConvos = state.conversations.map((c: Conversation) => {
          if (
            c.last_message &&
            c.id === conversation_id &&
            c.last_message.sender_id !== user
          ) {
            const obj = {
              ...c.last_message,
              read_at: new Date().toISOString()
            };
            c.last_message = obj;
            lastRead = c;
          }
          return c;
        });

        return {
          ...state,
          conversations: updateConvos,
          lastReadMessage: lastRead
        };
      } else {
        console.log('conversation not present');
      }
    },
    PERSIST_NEW_RECEIVED_MESSAGE: (
      state = initialState,
      action: Action<any>
    ) => {
      const { conversation_id } = action.payload;

      if (state.conversationsLib.indexOf(conversation_id !== -1)) {
        const newConvos = state.conversations.map((c: Conversation) => {
          if (c.partner) {
            if (c.partner.id && c.partner.id === action.payload.sender_id) {
              c.last_message = { ...action.payload, aasm_state: 'delivered' };
            }
          }
          return c;
        });

        if (state.conversation && state.conversation.id === conversation_id) {
          return {
            ...state,
            conversation: {
              ...state.conversation,
              messages: [action.payload, ...state.conversation.messages]
            },
            conversations: newConvos
          };
        } else {
          return {
            ...state,
            conversations: newConvos
          };
        }
      } else {
        console.log('conversation not present');
      }
    },
    PERSIST_NEW_CHAT_MESSAGE: (state = initialState, action: Action<any>) => {
      const message = {
        id: Math.floor(1000 + Math.random() * 9000),
        body: action.payload.message.text,
        state: 'delivered',
        recipient: action.payload.recipient,
        sender: action.payload.sender,
        sender_id: action.payload.sender.id,
        delivered_at: new Date().toISOString(),
        sent_at: new Date(action.payload.message.createdAt).toISOString(),
        read_at: null,
        aasm_state: 'delivered'
      };
      const newConversations = state.conversations.map((c) => {
        if (c.id === action.payload.conversation_id) {
          c.last_message = message;
        }
        return c;
      });

      return {
        ...state,
        conversation: {
          ...state.conversation,
          messages: [message, ...state.conversation.messages]
        },
        newOutgoingMessage: action.payload,
        conversations: newConversations
      };
    },
    PERSIST_CONVERSATIONS: (state = initialState, action: Action<any>) => {
      const conversationLib = action.payload.map((c: Conversation) => c.id);

      return {
        ...state,
        conversations: action.payload.filter((c) => c.partner !== null),
        conversationsCopy: action.payload.filter((c) => c.partner !== null),
        conversationsLib: conversationLib,
        lastReadMessage: null
      };
    },
    PERSIST_CONVERSATION: (state: ChatState, action: Action<any>) => ({
      ...state,
      conversation: action.payload
    }),
    PERSIST_ACTIVITY: (state: ChatState, action: Action<any>) => ({
      ...state,
      activity: action.payload
    }),
    PERSIST_ACTIVITIES: (state: ChatState, action: Action<any>) => ({
      ...state,
      activities: action.payload
    }),
    LOGOUT_USER: () => initialState
  },
  initialState
);

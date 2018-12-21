import { select, call, put, takeEvery } from 'redux-saga/effects';
import { createAction, Action } from 'redux-actions';
import api from '../../services/api';

import { Alert } from 'react-native';

import {
  persistConversations,
  persistConversation,
  persistNewMessage
} from '../reducers/chat';
import Conversation from '../../models/conversation';
import WonderAppState from '../../models/wonder-app-state';
import ChatResponseMessage from '../../models/chat-response-message';
import navigation from '../../services/navigation';
import { getUser } from './user';
import { handleAxiosError } from './utils';

// Get all conversations (Chats)
export const GET_CONVERSATIONS = 'GET_CONVERSATIONS';
export const getConversations = createAction(GET_CONVERSATIONS);
export function* getConversationsSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: Conversation[] } = yield call(
      api,
      {
        method: 'GET',
        url: '/conversations'
      },
      state.user
    );

    if (data) {
      yield put(persistConversations(data));
    }
  } catch (error) {
    handleAxiosError(error);
  }
}
export function* watchGetConversations() {
  yield takeEvery(GET_CONVERSATIONS, getConversationsSaga);
}

// Get the content of a single conversation
export const GET_CONVERSATION = 'GET_CONVERSATION';
export const getConversation = createAction(GET_CONVERSATION);
export function* getConversationSaga(action: Action<any>) {
  try {
    const { id, successRoute, params } = action.payload;
    const state: WonderAppState = yield select();
    const { data }: { data: Conversation[] } = yield call(
      api,
      {
        method: 'GET',
        url: `/conversations/${id}/messages`
      },
      state.user
    );

    yield put(persistConversation(data));

    //   if (successRoute) {
    //     const routeParams = params || {};
    //    navigation.navigate(successRoute, routeParams);
    //  }
  } catch (error) {
    handleAxiosError(error);
  } finally {
    yield put(getUser());
  }
}

export function* watchGetConversation() {
  yield takeEvery(GET_CONVERSATION, getConversationSaga);
}

// send chat messages
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const sendMessage = createAction(SEND_MESSAGE);
export function* sendMessageSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: ChatResponseMessage } = yield call(
      api,
      {
        method: 'POST',
        url: `/conversations/${action.payload.recipient_id}/messages`,
        data: action.payload
      },
      state.user
    );
    yield put(persistNewMessage(data));
  } catch (error) {
    handleAxiosError(error);
  } finally {
    // yield put(getUser());
  }
}

export function* watchSendMessage() {
  yield takeEvery(SEND_MESSAGE, sendMessageSaga);
}

// ghost contact
export const GHOST_CONTACT = 'GHOST_CONTACT';
export const ghostContact = createAction(GHOST_CONTACT);
export function* ghostContactSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();
    let formattedMessage;

    if (action.payload.message) {
      formattedMessage = action.payload.message.split(' ').join('+');
    } else {
      formattedMessage = '';
    }

    const response = yield call(
      api,
      {
        method: 'DELETE',
        url: `/conversations/${
          action.payload.partner.id
        }/ghost?message=${formattedMessage}`
      },
      state.user
    );
  } catch (error) {
    handleAxiosError(error);
  } finally {
    // yield put(getUser());
  }
}

export function* watchGhostContact() {
  yield takeEvery(GHOST_CONTACT, ghostContactSaga);
}

// delete conversation
export const DELETE_CONVERSATION = 'DELETE_CONVERSATION';
export const deleteConversation = createAction(DELETE_CONVERSATION);
export function* deleteConversationSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();
    const { data }: { data: Conversation[] } = yield call(
      api,
      {
        method: 'DELETE',
        url: `/conversations/${action.payload.partner.id}/messages/${
          action.payload.id
        }`
      },
      state.user
    );

    // yield put(persistConversation(data));
  } catch (error) {
    handleAxiosError(error);
  } finally {
    yield put(getUser());
  }
}

export function* watchDeleteConversationSaga() {
  yield takeEvery(DELETE_CONVERSATION, deleteConversationSaga);
}

import { select, call, put, takeEvery } from 'redux-saga/effects';
import { createAction, Action } from 'redux-actions';
import api from 'src/services/api';

import { persistActivities, persistActivity } from 'src/store/reducers/chat';

import _ from 'lodash';
import WonderAppState from '../../models/wonder-app-state';
import Partner from '../../models/partner';
import Coordinate from '../../models/coordinate';
import Activity from '../../models/activity';
import ActivityDetails from '../../models/activity-details';
import { handleAxiosError } from './utils';
import { createElement } from 'react';

export const GET_PARTNERS = 'GET_PARTNERS';
export const getPartners = createAction(GET_PARTNERS);
export function* getPartnersSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: Partner[] } = yield call(
      api,
      {
        method: 'GET',
        url: '/partners'
      },
      state.user
    );

    // yield persistPar
  } catch (error) {
    handleAxiosError(error);
  } finally {
    // yield put(getUser());
  }
}

export function* watchGetPartners() {
  yield takeEvery(GET_PARTNERS, getPartnersSaga);
}

export const GET_PARTNER_ACTIVITIES = 'GET_PARTNER_ACTIVITIES';
export const getPartnerActivities = createAction(GET_PARTNER_ACTIVITIES);
export function* getPartnerActivitiesSaga(action: Action<any>) {
  try {
    const {
      id,
      coordinate
    }: { id: number; coordinate?: Coordinate } = action.payload;
    const state: WonderAppState = yield select();

    const { data }: { data: Activity[] } = yield call(
      api,
      {
        method: 'GET',
        url: `/partners/${id}/activities`,
        params: {
          lat: _.get(coordinate, 'lat'),
          lng: _.get(coordinate, 'lng')
        }
      },
      state.user
    );

    yield put(persistActivities(data));
    // yield put(persistUser(data));
  } catch (error) {
    handleAxiosError(error);
  } finally {
    // yield put(getUser());
  }
}

export function* watchGetPartnerActivities() {
  yield takeEvery(GET_PARTNER_ACTIVITIES, getPartnerActivitiesSaga);
}

const GET_ACTIVITY_DETAILS = 'GET_ACTIVITY_DETAILS';
export const getActivityDetails = createAction(GET_ACTIVITY_DETAILS);
export function* getActivityDetailsSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: ActivityDetails } = yield call(
      api,
      {
        method: 'GET',
        url: `/activities/${action.payload.id}`
      },
      state.user
    );

    yield put(persistActivity(data));
    // yield put(persistUser(data));
  } catch (error) {
    handleAxiosError(error);
  } finally {
    // yield put(getUser());
  }
}

export function* watchGetActivityDetails() {
  yield takeEvery(GET_ACTIVITY_DETAILS, getActivityDetailsSaga);
}

export const BLOCK_USER = 'BLOCK_USER';
export const blockUser = createAction(BLOCK_USER);

export function* blockUserSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: ActivityDetails } = yield call(
      api,
      {
        method: 'POST',
        url: `/partners/${action.payload.id}/blocks?message=cow+goes-moo`
      },
      state.user
    );

    // yield put(persistActivity(data));
    // yield put(persistUser(data));
  } catch (error) {
    handleAxiosError(error);
  } finally {
    // yield put(getUser());
  }
}

export function* watchBlockUser() {
  yield takeEvery(BLOCK_USER, blockUserSaga);
}

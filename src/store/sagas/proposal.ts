import { select, call, put, takeEvery } from 'redux-saga/effects';
import { createAction, Action } from 'redux-actions';
import api from '../../services/api';
import { persistProposal } from '../actions/proposal';

import {
  persistCurrentMatch,
  persistProposalImages,
  persistBulkProposals
} from '../reducers/wonder';
import WonderAppState from '../../models/wonder-app-state';
import Proposal from '../../models/proposal';
import { handleAxiosError } from './utils';
import User from 'src/models/user';

const CLEAR_PROPOSALS = 'CLEAR_PROPOSALS';
export const clearProposals = createAction(CLEAR_PROPOSALS);

const GET_NEW_PROPOSAL = 'GET_NEW_PROPOSAL';
export const getNewProposal = createAction(GET_NEW_PROPOSAL);
export function* getNewProposalSaga() {
  try {
    const state: WonderAppState = yield select();

    const response = yield call(
      api,
      {
        method: 'GET',
        url: `/proposables?limit=1&offset=4`
      },
      state.user
    );

    if (response.data[0]) {
      yield put(persistProposal(response.data[0]));
    }
  } catch (error) {
    const { response } = error;
    if (response && response.status === 404) {
      // 404 - No Proposals available for user;
      yield put(persistProposal(undefined));
    } else {
      handleAxiosError(error);
    }
  }
}

export function* watchGetNewProposal() {
  yield takeEvery(GET_NEW_PROPOSAL, getNewProposalSaga);
}
// THIS SAGA IS NOT YET BEING USED
const GET_NEXT_PROPOSAL = 'GET_NEXT_PROPOSAL';
export const getNextProposal = createAction(GET_NEXT_PROPOSAL);

export function* getNextProposalSaga(act: {
  type: GET_NEXT_PROPOSAL;
  payload: number;
}) {
  console.log(`act:`, act);
  const { payload: limit } = act;
  console.log(`limit:`, limit);
  try {
    const state: WonderAppState = yield select();
    const bulkProposalRes = yield call(
      api,
      {
        method: 'GET',
        url: `/proposables?limit=${limit}`
      },
      state.user
    );

    console.log(`getNextProposalSaga - bulkProposalRes`, bulkProposalRes);

    yield put(persistBulkProposals(bulkProposalRes.data));
  } catch (e) {
    handleAxiosError(e);
  }
}

export function* watchGetNextProposal() {
  yield takeEvery(GET_NEXT_PROPOSAL, getNextProposalSaga);
}

interface RateProposalPayload {
  proposal: Proposal;
  liked: boolean;
}
const RATE_PROPOSAL = 'RATE_PROPOSAL';
export const rateProposal = createAction(RATE_PROPOSAL);
export function* rateProposalSaga(action: Action<any>) {
  try {
    const { proposal, liked }: RateProposalPayload = action.payload;

    const state: WonderAppState = yield select();

    console.log(`Posting proposal with liked: ${liked}:`, proposal);
    const { data }: { data: Proposal } = yield call(
      api,
      {
        url: '/proposals',
        method: 'POST',
        data: {
          proposal: {
            candidate_id: proposal.candidate.id,
            liked
          }
        }
      },
      state.user
    );

    if (data.has_match) {
      // TODO: We are matched, show the modal
      yield put(persistCurrentMatch(data));
    }

    // yield put(persistProposal(data));
  } catch (error) {
    const { response } = error;
    if (response && response.status === 422) {
      // 422 - Already rated
    } else {
      handleAxiosError(error);
    }
  } finally {
    yield put(getNewProposal());
  }
}

export function* watchRateProposal() {
  yield takeEvery(RATE_PROPOSAL, rateProposalSaga);
}

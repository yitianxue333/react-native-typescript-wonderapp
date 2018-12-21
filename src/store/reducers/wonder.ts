import { handleActions, createAction, Action } from 'redux-actions';
import Topic from '../../models/topic';
import Proposal from '../../models/proposal';
import Partner from '../../models/partner';
import Appointment from '../../models/appointment';
import Attendance from 'src/models/attendance';
import { actionChannel } from 'redux-saga/effects';
export interface WonderState {
  readonly topics: Topic[];
  readonly proposal: Proposal[];
  readonly partners: Partner[];
  readonly currentMatch: Proposal | {};
  readonly appointments: Appointment[];
  readonly attendances: Attendance[];
  readonly proposalImages: [];
}

const defaultState: WonderState = {
  topics: [],
  proposal: [],
  partners: [],
  currentMatch: {},
  appointments: [],
  attendances: [],
  proposalImages: []
};

export const persistBulkProposals = createAction('PERSIST_BULK_PROPOSALS');
export const persistTopics = createAction('PERSIST_TOPICS');
export const persistPartners = createAction('PERSIST_PARTNERS');
export const persistCurrentMatch = createAction('PERSIST_CURRENT_MATCH');
export const persistAppointments = createAction('PERSIST_APPOINTMENTS');
export const persistAttendances = createAction('PERSIST_ATTENDANCES');
export const persistProposalImages = createAction('PERSIST_PROPOSAL_IMAGES');

const getProposalFromPersistProposal = (
  existingProposals: Proposal[],
  proposal: Proposal
): Proposal[] => {
  const proposalExists = existingProposals
    ? existingProposals.find((obj) => obj.candidate.id === proposal.candidate.id)
    : false;

  if (existingProposals.length) {
    if (!proposalExists) {
      return [...existingProposals, proposal];
    }
  }

  return existingProposals;
};

export default handleActions(
  {
    CLEAR_PROPOSALS: (state: WonderState, action: Action<any>) => ({
      ...state,
      proposal: []
    }),
    PERSIST_BULK_PROPOSALS: (state: WonderState, action: Action<any>) => {
      const { proposal } = state;

      return {
        ...state,
        proposal: action.payload
      };
    },
    PERSIST_PROPOSAL_IMAGES: (state: WonderState, action: Action<any>) => ({
      ...state,
      proposalImages: action.payload || defaultState.proposalImages
    }),

    PERSIST_CURRENT_MATCH: (state: WonderState, action: Action<any>) => ({
      ...state,
      currentMatch: action.payload || defaultState.currentMatch
    }),
    PERSIST_TOPICS: (state: WonderState, action: Action<any>): WonderState => ({
      ...state,
      topics: action.payload || defaultState.topics
    }),
    RATE_PROPOSAL: (state: WonderState, action: Action<any>) => ({
      ...state,
      proposal: state.proposal.length > 0 ? state.proposal.slice(1) : []
    }),
    PERSIST_PROPOSAL: (state: WonderState, action: Action<any>) => ({
      ...state,
      proposal: getProposalFromPersistProposal(state.proposal, action.payload)
    }),
    PERSIST_PARTNERS: (state: WonderState, action: Action<any>) => ({
      ...state,
      partners: action.payload || defaultState.partners
    }),
    PERSIST_APPOINTMENTS: (state: WonderState, action: Action<any>) => ({
      ...state,
      appointments: action.payload || defaultState.appointments
    }),
    PERSIST_ATTENDANCES: (state: WonderState, action: Action<any>) => ({
      ...state,
      attendances: action.payload
    })
  },
  defaultState
);

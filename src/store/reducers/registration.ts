import { handleActions, createAction, Action } from 'redux-actions';

export interface RegistrationState {
  readonly first_name: string | null;
  readonly last_name: string | null;
  readonly email: string | null;
  readonly phone: string | null;
  readonly password: string | null;
  readonly gender: string | null;
  readonly birthdate: string | null;
  readonly occupation: string | null;
  readonly school: string | null;
  readonly auth_token: object | {};
  readonly id: number | null;
  readonly about: string | null;

  // readonly images: any[];
  // readonly video: any;

  readonly topic_ids: number[];
}

const defaultState: RegistrationState = {
  first_name: null,
  last_name: null,
  email: null,
  phone: null,
  password: null,
  gender: null,
  birthdate: null,
  occupation: null,
  school: null,
  about: null,
  // images: [],
  // video: null,
  topic_ids: []
};

export const persistRegistrationInfo = createAction(
  'PERSIST_REGISTRATION_INFO'
);
export const resetRegistration = createAction('RESET_REGISTRATION');

export default handleActions(
  {
    PERSIST_REGISTRATION_INFO: (
      state: RegistrationState,
      action: Action<any>
    ): RegistrationState => ({
      ...state,
      ...action.payload
    }),
    LOGOUT_USER: () => defaultState,
    RESET_REGISTRATION: (
      state: RegistrationState,
      action: Action<any>
    ): RegistrationState => defaultState
  },
  defaultState
);

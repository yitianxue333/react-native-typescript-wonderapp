import { handleActions, createAction } from 'redux-actions';
import User from '../../models/user';
import { UserAuth } from '../../models/user-credentials';

export interface UserState {
  readonly profile: User;
  readonly auth: UserAuth;
}

export const initialState: UserState = {
  profile: {
    images: [],
    onboarding_ui_state: {
      has_matched: false,
      has_swiped_left: false,
      has_scheduled_wonder: false,
      has_swiped_right: false
    }
  },
  phone: null,
  auth: {
    token: null,
    uid: null
  }
};

export const addProfileImage = createAction('ADD_PROFILE_IMAGE');
export const addProfileVideo = createAction('ADD_PROFILE_VIDEO');
export const removeProfileImage = createAction('REMOVE_PROFILE_IMAGE');
export const persistUserPhone = createAction('PERSIST_USER_PHONE');

export default handleActions(
  {
    PERSIST_USER_PHONE: (state: UserState, action) => ({
      ...state,
      phone: action.payload || initialState.phone
    }),
    ADD_PROFILE_IMAGE: (state: UserState, action) => {
      return {
        ...state,
        profile: {
          ...state.profile,
          images: [
            ...(state.profile.images || []),
            {
              id: Math.floor(1000 + Math.random() * 9000),
              url: action.payload.uri,
              position: 2
            }
          ]
        }
      };
    },
    ADD_PROFILE_VIDEO: (state: UserState, action) => {
      return {
        ...state,
        profile: {
          ...state.profile,
          video: action.payload.uri
        }
      };
    },
    PERSIST_AUTH: (state: UserState, action) => ({
      ...state,
      auth: {
        token: action.payload.token || initialState.auth.token,
        uid:
          (action.payload.payload && action.payload.payload.sub) ||
          initialState.auth.uid
      }
    }),
    PERSIST_USER: (state: UserState, action) => ({
      ...state,
      profile: action.payload || initialState.profile
    }),
    LOGOUT_USER: () => initialState,
    DEACTIVATE_ACCOUNT: () => initialState
  },
  initialState
);

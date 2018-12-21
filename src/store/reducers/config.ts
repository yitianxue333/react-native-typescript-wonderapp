import { handleActions, createAction, Action } from 'redux-actions';

export interface ConfigState {
  readonly loading: {};
}

export const initialState: ConfigState = {
  loading: {}
};

export const isLoading = createAction('IS_LOADING');
export const doneLoading = createAction('DONE_LOADING');
export default handleActions(
  {
    IS_LOADING: (state: ConfigState, action: Action<any>) => ({
      ...state,
      loading: {
        ...state.loading,
        [action.payload]: true
      }
    }),
    DONE_LOADING: (state: ConfigState, action: Action<any>) => ({
      ...state,
      loading: Object.keys(state.loading).reduce((keys: any, key: string) => {
        if (action.payload !== key) {
          keys[key] = true;
        }
        return keys;
      }, {})
    }),
    LOGOUT_USER: () => initialState
  },
  initialState
);

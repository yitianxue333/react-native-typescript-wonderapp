import {
  handleActions,
  createAction,
  Action,
  ActionFunctionAny
} from 'redux-actions';

export interface UserPayload {
  user: User;
}

export const PERSIST_USER = 'PERSIST_USER';
export const persistUser: ActionFunctionAny<Action<UserPayload>> = createAction(
  PERSIST_USER
);

export const PERSIST_AUTH = 'PERSIST_AUTH';
export const persistAuth: ActionFunctionAny<
  Action<UserCredentialsResponse>
> = createAction(PERSIST_AUTH);

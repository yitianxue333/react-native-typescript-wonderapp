import { createAction, Action, ActionFunctionAny } from 'redux-actions';

export interface IAPIAlert {
  title: string;
  body: string;
  buttonTitle: string;
  buttonTitle2?: string;
  alertVisible: boolean;
  isError?: boolean;
  onPress?: () => void;
  onPress2?: () => void;
}

export const SET_API_ALERT = 'SET_API_ALERT';
export const setAlertModal: ActionFunctionAny<Action<IAPIAlert>> = createAction(
  SET_API_ALERT,
  (payload: IAPIAlert) => payload
);

export const HIDE_API_ALERT = 'HIDE_API_ALERT';
export const hideAlertModal: ActionFunctionAny<
  Action<IAPIAlert>
> = createAction(HIDE_API_ALERT);

import { handleActions, Action } from 'redux-actions';
import User from '../../models/user';
import ActivityDetails from '../../models/activity-details';
import Topic from '../../models/topic';
import { IAPIAlert } from '@actions';

export const initialApiAlertState: IAPIAlert = {
  title: '',
  body: '',
  buttonTitle: '',
  buttonTitle2: '',
  alertVisible: false,
  isError: true
};

export default handleActions(
  {
    SET_API_ALERT: (state: IAPIAlert, action: Action<any>) => ({
      ...action.payload,
      isError: true
    }),
    HIDE_API_ALERT: (state: IAPIAlert, action: Action<any>) => ({
      ...initialApiAlertState
    })
  },
  initialApiAlertState
);

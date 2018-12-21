import { WonderState } from '../store/reducers/wonder';
import { UserState } from '../store/reducers/user';
import { RegistrationState } from '../store/reducers/registration';
import { ChatState } from '../store/reducers/chat';
import { ConfigState } from '../store/reducers/config';
import { AppointmentState } from '../store/reducers/appointment';
import { IAPIAlert } from '@actions';

export default interface WonderAppState {
  user: UserState;
  wonder: WonderState;
  registration: RegistrationState;
  chat: ChatState;
  config: ConfigState;
  appointment: AppointmentState;
  apiAlert: IAPIAlert;
}

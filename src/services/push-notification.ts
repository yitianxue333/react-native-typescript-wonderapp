import RNPushNotification, {
  PushNotification,
  PushNotificationObject
} from 'react-native-push-notification';

import { PushNotificationIOS } from 'react-native';
import { NavigationActions } from 'react-navigation';

import NavigationService from './navigation';
import Appointment, { DecoratedAppointment } from '../models/appointment';
import { decorateAppointment } from '../store/selectors/appointment';
import User from '../models/user';
export interface RNPushNotificationToken {
  os: string;
  token: string;
}
type onRegisterToken = (token: RNPushNotificationToken) => void;

interface WonderPushNotification extends PushNotification {
  type?: string;
  extra?: string;
}

interface AndroidNotificationPayload {
  type?: string;
  partner_id?: number;
  appointment?: string;
}
interface IosNotificationPayload {
  type?: string;
  partner_id?: number;
  appointment?: Appointment;
}

class PushNotificationService {
  public token?: RNPushNotificationToken;
  public onRegister?: onRegisterToken;
  public onNotification?: (notification: PushNotificationObject) => void;
  private lastId: number = 0;
  private senderID: string = '487922911515';
  private user?: User;

  private handleRegister = (token: RNPushNotificationToken) => {
    this.token = token;
    if (this.onRegister) {
      this.onRegister(token);
    }
  }

  private resetToDate = (
    destination: string,
    appointment: DecoratedAppointment | null,
    review: boolean
  ) => {
    NavigationService.reset('Main', 'onboarding');
    NavigationService.navigate('User');
    NavigationService.navigate('Upcoming');
    NavigationService.navigate(destination, { appointment, review });
  }

  private resetToPast = () => {
    NavigationService.reset('Main', 'onboarding');
    NavigationService.navigate('User');
    NavigationService.navigate('Past');
  }

  private resetToChat = (partnerId: number, redirect: string) => {
    NavigationService.reset('Main', 'onboarding');
    NavigationService.navigate('Messages');
    NavigationService.navigate('ChatList', { partnerId, redirect });
  }

  private handleIosNotifications = (payload: IosNotificationPayload) => {
    const { partner_id, appointment, type } = payload;
    return {
      type,
      partnerId: partner_id,
      appointment:
        appointment && this.user
          ? decorateAppointment(appointment, this.user)
          : null
    };
  }

  private handleAndroidNotifications = (
    payload: AndroidNotificationPayload
  ) => {
    const { partner_id, appointment, type } = payload;
    const parsedAppointment: Appointment = appointment
      ? JSON.parse(appointment)
      : null;
    return {
      type,
      partnerId: partner_id,
      appointment:
        parsedAppointment && this.user
          ? decorateAppointment(parsedAppointment, this.user)
          : null
    };
  }

  private parseNotification = (notification: WonderPushNotification) => {
    const error = {
      type: null,
      partnerId: null,
      appointment: null
    };

    const { data } = notification;
    if (!this.token || (this.token.os === 'ios' && !data)) {
      return error;
    }

    return this.token.os === 'ios'
      ? this.handleIosNotifications(data)
      : this.handleAndroidNotifications(notification);
  }

  private handleNotificationReceived = (
    notification: WonderPushNotification
  ) => {
    const { userInteraction, foreground, message } = notification;
    if (userInteraction) {
      const payload = this.parseNotification(notification);
      const { type, partnerId, appointment } = payload;
      if (
        (type === 'upcoming_date' ||
          type === 'confirm_date' ||
          type === 'invite_date') &&
        appointment
      ) {
        this.resetToDate('UpcomingAppointmentView', appointment, false);
      } else if (type === 'new_message' && partnerId) {
        this.resetToChat(partnerId, 'none');
      } else if (type === 'ghosting' && partnerId) {
        this.resetToChat(partnerId, 'ghosting');
      } else if (type === 'new_match' && partnerId) {
        this.resetToChat(partnerId, 'profile');
      } else if (type === 'gift_date' && appointment) {
        this.resetToDate('PastAppointmentView', appointment, false);
      } else if (type === 'review_date' && appointment) {
        this.resetToDate('PastAppointmentView', appointment, true);
      } else if (type === 'cancel_date' && appointment) {
        this.resetToPast();
      }
    } else if (foreground && this.token && this.token.os === 'ios') {
      // RNPushNotification.localNotification({
      //   title: '',
      //   message: `${message}`,
      //   userInfo: {}
      // });
    }

    if (this.token && this.token.os === 'ios') {
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
  }

  configure(user: User) {
    this.user = user;
    RNPushNotification.configure({
      onRegister: this.handleRegister,
      onNotification: (notification: WonderPushNotification) =>
        this.handleNotificationReceived(notification),
      senderID: this.senderID,
      popInitialNotification: true,
      requestPermissions: true
    });
  }

  localNotification = (content: PushNotificationObject): void => {
    RNPushNotification.presentLocalNotification(content);
  }
}

export default new PushNotificationService();

import NavigatorService from '../../services/navigation';
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { createAction, Action } from 'redux-actions';
import api from '../../services/api';
import { Alert } from 'react-native';
import { persistAppointments } from '../reducers/wonder';
import {
  AppointmentState,
  persistAppointmentData,
  resetAppointment
} from '../reducers/appointment';
import WonderAppState from '../../models/wonder-app-state';
import Appointment, { DecoratedAppointment } from '../../models/appointment';
import { handleAxiosError } from './utils';
import RNCalendarEvents, {
  RNCalendarEvent,
  RNCalendarCalendar
} from 'react-native-calendar-events';
import moment from 'moment';
import { getAttendances } from './attendance';

export const GET_APPOINTMENTS = 'GET_APPOINTMENTS';
export const getAppointments = createAction(GET_APPOINTMENTS);
export function* getAppointmentsSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: Appointment[] } = yield call(
      api,
      {
        method: 'GET',
        url: '/appointments'
      },
      state.user
    );

    yield put(persistAppointments(data));
  } catch (error) {
    handleAxiosError(error);
  } finally {
    // yield put(getUser());
  }
}

export function* watchGetAppointments() {
  yield takeEvery(GET_APPOINTMENTS, getAppointmentsSaga);
}

const serializeAppointment = (appt: AppointmentState): any => {
  if (appt && appt.activity && appt.topic && appt.match) {
    return {
      invited_user_id: appt.match.id,
      appointment: {
        name: appt.activity.name,
        location: appt.activity.location.join(', '),
        latitude: appt.activity.latitude,
        longitude: appt.activity.longitude,
        event_at: appt.eventAt,
        topic_id: appt.topic.id,
        phone: appt.activity.phone
      }
    };
  }
};

export const CREATE_APPOINTMENT = 'CREATE_APPOINTMENT';
export const createAppointment = createAction(CREATE_APPOINTMENT);
export function* createAppointmentSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();
    const { appointment: appointmentState } = state;

    const { eventAt, match, topic, activity } = appointmentState;
    if (eventAt && match && topic && activity) {
      const body = serializeAppointment(appointmentState);

      // Save the calendar Event to the users calendar
      const calendars = yield call([RNCalendarEvents, 'findCalendars']);
      if (calendars.length) {
        const primaryCalendar:
          | RNCalendarCalendar
          | undefined = calendars.filter(
          (c: RNCalendarCalendar) => c.allowsModifications
        );
        // calendars.find((c: RNCalendarCalendar) => ['Default', 'Phone'].indexOf(c.source) >= 0) || calendars[0];
        if (primaryCalendar[0]) {
          const title = `${topic.name} with ${match.first_name}`;
          const details: Partial<RNCalendarEvent> = {
            calendarId: primaryCalendar[0].id,
            location: activity.location.join(','),
            startDate: eventAt,
            endDate: moment(eventAt)
              .add(1, 'hour')
              .toDate()
          };
          const eventId = yield call(
            [RNCalendarEvents, 'saveEvent'],
            title,
            details,
            undefined
          );
          if (eventId) {
            body.attendance = {
              device_calendar_event_id: eventId,
              device_calendar_name: primaryCalendar.id
            };
          }
        }
      }
      // api call to make the appointment, optionally with calendar data
      yield call(
        api,
        {
          method: 'POST',
          url: '/appointments',
          data: body
        },
        state.user
      );
    }

    yield put(resetAppointment());
    yield put(getAppointments());
    NavigatorService.popToTop();
  } catch (error) {
    handleAxiosError(error);
  } finally {
    yield put(getAttendances());
    yield put(getAppointments());
    // yield put(getUser());
  }
}

export function* watchCreateAppointment() {
  yield takeEvery(CREATE_APPOINTMENT, createAppointmentSaga);
}

export const CONFIRM_APPOINTMENT = 'CONFIRM_APPOINTMENT';
export const confirmAppointment = createAction(CONFIRM_APPOINTMENT);
export function* confirmAppointmentSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();
    const {
      appointment
    }: { appointment: DecoratedAppointment } = action.payload;

    const { event_at, match, topic, location, id } = appointment;

    const authorized = yield call([RNCalendarEvents, 'authorizationStatus']);

    if (authorized && event_at && match && topic && location) {
      // Save the calendar Event to the users calendar
      const calendars = yield call([RNCalendarEvents, 'findCalendars']);
      if (calendars.length) {
        const primaryCalendar:
          | RNCalendarCalendar
          | undefined = calendars.filter(
          (c: RNCalendarCalendar) => c.allowsModifications
        );
        // calendars.find((c: RNCalendarCalendar) => ['Default', 'Phone'].indexOf(c.source) >= 0) || calendars[0];
        if (primaryCalendar[0]) {
          const title = `${topic.name} with ${match.first_name}`;
          const details: Partial<RNCalendarEvent> = {
            calendarId: primaryCalendar.id,
            location,
            startDate: moment(event_at),
            endDate: moment(event_at)
              .add(1, 'hour')
              .toDate()
          };
          yield call(
            [RNCalendarEvents, 'saveEvent'],
            title,
            details,
            undefined
          );
        }
      }
    }
    yield call(
      api,
      {
        method: 'POST',
        url: `/appointments/${id}/confirm`
      },
      state.user
    );

    yield put(resetAppointment());
    yield put(getAppointments());
    // NavigatorService.popToTop();
  } catch (error) {
    handleAxiosError(error);
  } finally {
    yield put(getAttendances());
    yield put(getAppointments());
  }
}

export function* watchConfirmtAppointment() {
  yield takeEvery(CONFIRM_APPOINTMENT, confirmAppointmentSaga);
}

// DELETE AN APPOINTMENT
export const CANCEL_APPOINTMENT = 'CANCEL_APPOINTMENT';
export const cancelAppointment = createAction(CANCEL_APPOINTMENT);
export function* cancelAppointmentSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const info = {
      invited_user_id: action.payload.owner.id,
      appointment: {
        name: action.payload.name,
        location: action.payload.location,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        event_at: action.payload.event_at,
        topic_id: action.payload.topic.id
      }
    };

    const { data }: { data: Appointment[] } = yield call(
      api,
      {
        method: 'POST',
        url: `/appointments/${action.payload.id}/cancel`,
        data: info
      },
      state.user
    );

    Alert.alert(
      'Success',
      `Your appointment with ${
        action.payload.match.first_name
      } has been canceled`,
      [{ text: 'OK' }],
      { cancelable: false }
    );

    yield put(getAttendances());
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchcancelAppointmentSaga() {
  yield takeEvery(CANCEL_APPOINTMENT, cancelAppointmentSaga);
}

export const DECLINE_APPOINTMENT = 'DECLINE_APPOINTMENT';
export const declineAppointment = createAction(DECLINE_APPOINTMENT);
export function* declineAppointmentSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const info = {
      invited_user_id: action.payload.owner.id,
      appointment: {
        name: action.payload.name,
        location: action.payload.location,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        event_at: action.payload.event_at,
        topic_id: action.payload.topic.id
      }
    };

    const { data }: { data: Appointment[] } = yield call(
      api,
      {
        method: 'POST',
        url: `/appointments/${action.payload.id}/decline`,
        data: info
      },
      state.user
    );

    Alert.alert(
      'Success',
      `Your appointment with ${
        action.payload.match.first_name
      } has been declined`,
      [{ text: 'OK' }],
      { cancelable: false }
    );
    yield put(getAttendances());
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchDeclineAppointmentSaga() {
  yield takeEvery(DECLINE_APPOINTMENT, declineAppointmentSaga);
}

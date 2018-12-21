import _ from 'lodash';
import { createSelector, OutputSelector } from 'reselect';
import { selectCurrentUser } from './user';
import moment from 'moment-timezone';
import {
  isAppointmentBeforeToday,
  isAppointmentAfterToday
} from 'src/utils/appointment';
import WonderAppState from 'src/models/wonder-app-state';
import Appointment, {
  DecoratedAppointment,
  AppointmentUser
} from 'src/models/appointment';
import User from 'src/models/user';
import Wonder from 'src/views/components/theme/wonder/wonder';

const allAppointments = (state: WonderAppState) => state.wonder.appointments;
const allAttendances = (state: WonderAppState) => state.wonder.attendances;

export const decorateAppointment = (
  appointment: Appointment,
  me: User
): DecoratedAppointment | undefined => {
  if (appointment) {
    const result: DecoratedAppointment = {
      ...appointment,
      me,
      match: appointment.users.find(
        (user: AppointmentUser) => user.id !== me.id
      ),
      eventMoment: appointment.event_at
        ? moment(appointment.event_at)
        : undefined
    };

    return result;
  }
  return undefined;
};
// ONLY THIS ONE
export const decorateAttendance = (
  appointment: any,
  me: User
): DecoratedAppointment | undefined => {
  if (appointment) {
    const { users } = appointment.appointment;
    const result: any = {
      ...appointment.appointment,
      attendanceId: appointment.id,
      reviewed_at: appointment.reviewed_at,
      me,
      match: users.find((user: AppointmentUser) => user.id !== me.id),
      eventMoment: appointment.appointment.event_at
        ? moment(appointment.event_at)
        : undefined
    };
    return result;
  }
  return undefined;
};

export const selectUpcomingAppointments = createSelector(
  [selectCurrentUser, allAppointments],
  (currentUser, appointments) => {
    return _.sortBy(appointments, 'event_at')
      .map((a: Appointment) => decorateAppointment(a, currentUser))
      .filter(isAppointmentAfterToday);
  }
);

export const selectUpcomingAttendances = createSelector(
  [selectCurrentUser, allAttendances],
  (currentUser, appointments) => {
    return _.sortBy(appointments, 'departure_at')
      .map((a: any) => decorateAttendance(a, currentUser))
      .filter(isAppointmentAfterToday);
  }
);

export const selectPastAppointments = createSelector(
  [selectCurrentUser, allAppointments],
  (currentUser, appointments) => {
    return appointments
      .map((a: Appointment) => decorateAppointment(a, currentUser))
      .filter(isAppointmentBeforeToday);
  }
);

export const selectPastAttendences = createSelector(
  [selectCurrentUser, allAttendances],
  (currentUser, appointments) => {
    return appointments
      .map((a: Appointment) => decorateAttendance(a, currentUser))
      .filter(isAppointmentBeforeToday);
  }
);

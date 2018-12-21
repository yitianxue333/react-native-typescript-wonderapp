import Appointment from '../models/appointment';
import moment from 'moment-timezone';

export const isAppointmentBeforeToday = (
  appointment?: Appointment
): boolean => {
  if (appointment && appointment.event_at) {
    const now = moment();
    // const eventAt = moment(appointment.event_at);
    // const eventAt = moment(appointment.event_at);
    const eventEnd = moment(appointment.event_at);
    return eventEnd.isBefore(now);
  }
  return false;
};

export const isAppointmentAfterToday = (appointment?: Appointment): boolean => {
  if (appointment && appointment.event_at) {
    const now = moment();
    // const eventAt = moment(appointment.event_at);
    const eventEnd = moment(appointment.event_at);
    return now.isBefore(eventEnd);
  }
  return false;
};

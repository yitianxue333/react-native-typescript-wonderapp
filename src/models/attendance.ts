import Appointment from './appointment';

interface Attendance {
  id: number;
  departure_at?: string;
  travel_time_in_seconds?: null;
  distance_in_meters: number;
  device_calendar_event_id: string | null;
  device_calendar_name: string | null;
  appointment: Appointment;
}

export default Attendance;

import RNCalendarEvents, {
  RNCalendarCalendar,
  RNCalendarEvent,
  RNCalendarEventPermissionLevel
} from 'react-native-calendar-events';

export type Calendar = RNCalendarCalendar;
export type CalendarEvent = RNCalendarEvent;

class CalendarService {
  static async authorize(): Promise<RNCalendarEventPermissionLevel> {
    const status: RNCalendarEventPermissionLevel = await RNCalendarEvents.authorizationStatus();

    if (status !== 'authorized') {
      return await RNCalendarEvents.authorizeEventStore();
    }
    return status;
  }

  static getCalendars(): Promise<Calendar[]> {
    return RNCalendarEvents.findCalendars();
  }

  static async getCalendarById(id: string): Promise<Calendar | undefined> {
    const calendars = await RNCalendarEvents.findCalendars();
    return calendars.find((c: Calendar) => c.id === id);
  }

  static getEventById(id: string): Promise<CalendarEvent | null> {
    return RNCalendarEvents.findEventById(id);
  }
}

export default CalendarService;

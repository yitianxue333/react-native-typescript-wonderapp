declare module 'react-native-calendar-events' {
  export type RNCalendarEventPermissionLevel =
    | 'denied'
    | 'restricted'
    | 'authorized'
    | 'undetermined';
  export type RNCalendarEventOccurrence =
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly';

  export default class RNCalendarEvents {
    static authorizationStatus(): Promise<RNCalendarEventPermissionLevel>;
    static authorizeEventStore(): Promise<RNCalendarEventPermissionLevel>;
    static fetchAllEvents(
      startDate: Date,
      endDate: Date,
      calendars?: RNCalendarCalendar[]
    ): Promise<any>;
    static findCalendars(): Promise<RNCalendarCalendar[]>;
    static saveEvent(
      title: string,
      details: Partial<RNCalendarEvent>,
      options: any
    ): Promise<string>;
    static findEventById(id: string): Promise<RNCalendarEvent | null>;
  }

  export interface RNCalendarEvent {
    id: string;
    calendarId: string;
    title: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    location: string;
    url: string; // iOS only
    description: string; // Android only
    recurrence?: RNCalendarEventOccurrence;
  }

  export interface RNCalendarCalendar {
    id: string;
    title: string;
    type: string;
    source: string;
    isPrimary: boolean;
    allowsModifications: boolean;
    color: string;
    allowedAvailabilities: any[];
  }
}

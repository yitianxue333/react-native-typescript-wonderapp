export default interface CalendarDate {
  day: number; // day of month (1-31)
  month: number; // month of year (1-12)
  year: number; // year
  timestamp: number; // UTC timestamp representing 00:00 AM of this date
  dateString: string; // '2016-05-13' // date formatted as 'YYYY-MM-DD' string
}

export const DATE_STRING_FORMAT = 'YYYY-MM-DD';

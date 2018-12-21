declare module 'appcenter-analytics' {
  // export type RNCalendarEventPermissionLevel = 'denied' | 'restricted' | 'authorized' | 'undetermined';

  export interface AppCenterAnalyticsEventProperties {
    // only string mappings are supported, but the lib converts for you
    [key: string]: string | number | boolean | undefined;
  }

  export class AppCenterAnalyticsTransmissionTarget {
    constructor(targetToken: string);

    static trackEvent(
      eventName: string,
      properties?: AppCenterAnalyticsEventProperties
    ): Promise<string>;
  }

  export default class AppCenterAnalytics {
    bindingType:
      | 'MSAnalytics'
      | 'com.microsoft.appcenter.AppCenterAnalytics.Analytics';
    static setEnabled(enabled: boolean): Promise<void>;
    static isEnabled(): Promise<boolean>;
    static trackEvent(
      eventName: string,
      properties?: AppCenterAnalyticsEventProperties
    ): Promise<string>;
    static getTransmissionTarget(
      targetToken: string
    ): Promise<AppCenterAnalyticsTransmissionTarget>;
  }
}

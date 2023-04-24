export namespace NotificationsConfig {
  export const emailSubject2FA = 'Verification Code';
  export const urlNotifications2FA: string =
    'http://localhost:7183/Notifications/send-code-2fa';
  export const urlNotificationsSMS: string =
    'http://localhost:7183/Notifications/send-sms';
  export const emailSubjectVerificateEmail = 'Confirm your Email';
  export const urlNotificationsVerificateEmail: string =
    //'http://localhost:7183/Notifications/send-confirmation-email'
    '';
}

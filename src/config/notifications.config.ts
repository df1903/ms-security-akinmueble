export namespace NotificationsConfig {
  export const emailSubject2FA = 'Verification Code';
  export const urlNotifications2FA: string =
    'https://localhost:7183/Notifications/send-code-2fa';
  export const urlNotificationsSMS: string =
    'https://localhost:7183/Notifications/send-sms';
}

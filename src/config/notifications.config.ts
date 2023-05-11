export namespace NotificationsConfig {
  // Email subjects
  export const emailSubjectVerificateEmail = 'Confirm your Email';
  export const emailSubject2FA = 'Verification Code';
  // SMS links
  export const urlNotificationsSMS: string =
    'http://localhost:7183/Notifications/send-sms';
  // Email links
  export const urlNotifications2FA: string =
    'http://localhost:7183/Notifications/send-code-2fa';
  export const urlNotificationsEmail: string =
    'http://localhost:7183/Notifications/send-email-general';
  export const urlFrontHashVerification: string =
    'http://localhost:4200/hash-verification';
  export const urlNotificationAdviserCredentials =
    'http://localhost:7183/Notifications/send-advisor-credentials';
  export const urlNotificationRecoveryPassword =
    'http://localhost:7183/Notifications/recovery-password-email';
  export const urlNotificationVerificateEmail =
    'http://localhost:7183/Notifications/send-verificate-email';
}

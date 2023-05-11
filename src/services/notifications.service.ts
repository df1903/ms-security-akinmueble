import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {NotificationsConfig} from '../config/notifications.config';

const fetch = require('node-fetch');
@injectable({scope: BindingScope.TRANSIENT})
export class NotificationsService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */

  sendNotification(data: any, url: string) {
    fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'},
    });
  }

  sendCredentialsByEmail(data: any) {
    let content =
      `Hi ${data.firstName} ${data.firstLastname}, <br/ >` +
      `These are your credentials: ` +
      `<br/ ><br/ > >> Applicant's Data << ` +
      `<br/ > Username: ${data.email}` +
      `<br/ > Password: ${data.password}`;

    let conactData = {
      destinyEmail: data.email,
      destinyName: `${data.firstName} ${data.firstLastname}`,
      emailSubject: `New ${data.role} Credentials`,
      emailBody: content,
    };
    this.sendNotification(
      conactData,
      NotificationsConfig.urlNotificationsEmail,
    );
  }

  RecoveryPasswordCredentials(data: any) {
    // SMS notification
    let info = {
      destinyPhone: data.phone,
      smsBody: `Hello ${data.firstName} ${data.firstLastname},\nyour new password is:\n\n ${data.newPassword}`,
    };

    this.sendNotification(info, NotificationsConfig.urlNotificationsSMS);

    // Email notification
    let conactData = {
      destinyEmail: data.email,
      destinyName: `${data.firstName} ${data.firstLastname}`,
      emailSubject: `New password`,
      emailBody: `Hello ${data.firstName} ${data.secondName},\nyour new password is:\n\n ${data.newPassword}`,
    };

    this.sendNotification(
      conactData,
      NotificationsConfig.urlNotificationsEmail,
    );
  }
}

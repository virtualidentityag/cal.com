import nodemailer from "nodemailer";

import type { Dayjs } from "@calcom/dayjs";
import dayjs from "@calcom/dayjs";
import { WEBSITE_URL } from "@calcom/lib/constants";
import { getErrorFromUnknown } from "@calcom/lib/errors";
import { serverConfig } from "@calcom/lib/serverConfig";

declare let global: {
  E2E_EMAILS?: Record<string, unknown>[];
};

interface EmailSettings {
  emailNotificationsEnabled: boolean;
  settings: {
    initialEnquiryNotificationEnabled: boolean;
    newChatMessageNotificationEnabled: boolean;
    reassignmentNotificationEnabled: boolean;
    appointmentNotificationEnabled: boolean;
  };
}

export default class BaseEmail {
  name = "";

  protected getTimezone() {
    return "";
  }

  protected getRecipientTime(time: string): Dayjs;
  protected getRecipientTime(time: string, format: string): string;
  protected getRecipientTime(time: string, format?: string) {
    const date = dayjs(time).tz(this.getTimezone());
    if (typeof format === "string") return date.format(format);
    return date;
  }

  protected getNodeMailerPayload(): Record<string, unknown> {
    return {};
  }
  public sendEmail() {
    if (process.env.NEXT_PUBLIC_IS_E2E) {
      global.E2E_EMAILS = global.E2E_EMAILS || [];
      global.E2E_EMAILS.push(this.getNodeMailerPayload());
      console.log("Skipped Sending Email as NEXT_PUBLIC_IS_E2E==1");
      return new Promise((r) => r("Skipped sendEmail for E2E"));
    }
    this.isAbleToSend().then((allowedToSend) => {
      if (!allowedToSend) {
        return;
      }

      new Promise((resolve, reject) =>
        nodemailer
          .createTransport(this.getMailerOptions().transport)
          .sendMail(this.getNodeMailerPayload(), (_err, info) => {
            if (_err) {
              const err = getErrorFromUnknown(_err);
              this.printNodeMailerError(err);
              reject(err);
            } else {
              resolve(info);
            }
          })
      ).catch((e) => console.error("sendEmail", e));
    });
    return new Promise((resolve) => resolve("send mail async"));
  }

  protected async isAbleToSend(): Promise<boolean> {
    const csrf = this.generateCsrfToken();
    const token = await this.loginUserInApp();
    const email = (this.getNodeMailerPayload().to as string).replace(/.*\<|\>/g, "");

    if (!token) {
      return false;
    }

    return fetch(`${WEBSITE_URL}/service/users/notifications?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Cookie: `CSRF-TOKEN=${csrf};`,
        "x-csrf-token": csrf,
      },
    })
      .then((r) => r.json())
      .then((data: EmailSettings) => {
        return data.emailNotificationsEnabled && data.settings.appointmentNotificationEnabled;
      })
      .catch((e) => {
        console.error(`Failed Getting user notifications for user: ${email}`, e);
        return false;
      });
  }

  private async loginUserInApp() {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("cache-control", "no-cache");

    const formData = [
      `username=${encodeURIComponent(process.env.CALCOM_TECHNICAL_KEYCLOAK_USERNAME as string)}`,
      `password=${encodeURIComponent(process.env.CALCOM_TECHNICAL_KEYCLOAK_PASSWORD as string)}`,
      "client_id=app",
      "grant_type=password",
    ].join("&");
    return fetch(`${WEBSITE_URL}/auth/realms/online-beratung/protocol/openid-connect/token`, {
      method: "POST",
      headers,
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => res.access_token)
      .catch((e) => {
        console.error(`Failed login into keycloack with calcom technical user`, e);
        return null;
      });
  }

  /**
   * Generates the Csrf Token when not present
   * @returns
   */
  private generateCsrfToken() {
    let token = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 18; i++) {
      token += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return token;
  }

  protected getMailerOptions() {
    return {
      transport: serverConfig.transport,
      from: serverConfig.from,
    };
  }

  protected printNodeMailerError(error: Error): void {
    /** Don't clog the logs with unsent emails in E2E */
    if (process.env.NEXT_PUBLIC_IS_E2E) return;
    console.error(`${this.name}_ERROR`, error);
  }
}

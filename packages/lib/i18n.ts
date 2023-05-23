/* eslint-disable @typescript-eslint/no-var-requires */
import type { IncomingMessage } from "http";

export function getLocaleFromHeaders(req: IncomingMessage): string {
  return "de"; // preferredLocale ?? i18n.defaultLocale;
}

export const getDirFromLang = (locale: string | undefined) =>
  locale === "ar" || locale === "he" ? "rtl" : "ltr";

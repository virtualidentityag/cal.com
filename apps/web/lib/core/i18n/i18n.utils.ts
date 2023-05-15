import type { IncomingMessage } from "http";

import { getSession } from "@lib/auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getLocaleFromHeaders(req: IncomingMessage): string {
  // let preferredLocale: string | null | undefined;
  // if (req.headers["accept-language"]) {
  //   preferredLocale = parser.pick(i18n.locales, req.headers["accept-language"]) as Maybe<string>;
  // }
  return "de"; //preferredLocale ?? i18n.defaultLocale;
}

export const getOrSetUserLocaleFromHeaders = async (req: IncomingMessage): Promise<string> => {
  const prisma = (await import("@calcom/prisma")).default;
  const session = await getSession({ req });
  const preferredLocale = getLocaleFromHeaders(req);

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        locale: true,
      },
    });

    if (user?.locale) {
      return user.locale;
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        locale: preferredLocale,
      },
    });
  }

  return "de";
};

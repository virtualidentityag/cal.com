import type { TFunction } from "next-i18next";

import { guessEventLocationType } from "@calcom/app-store/locations";
import { getVideoCallUrl } from "@calcom/lib/CalEventParser";
import logger from "@calcom/lib/logger";
import type { CalendarEvent } from "@calcom/types/Calendar";

import { Info } from "./Info";

export function LocationInfo(props: { calEvent: CalendarEvent; t: TFunction }) {
  const { t } = props;

  // We would not be able to determine provider name for DefaultEventLocationTypes
  let providerName = guessEventLocationType(props.calEvent.location)?.label;
  if (props.calEvent.location?.match(/^https?:/)) {
    providerName = guessEventLocationType("integrations:daily")?.label;
  }
  logger.debug(`LocationInfo: ${JSON.stringify(props.calEvent)} ${providerName}`);

  const location = props.calEvent.location;
  let meetingUrl = location?.search(/^https?:/) !== -1 ? location : undefined;

  if (props.calEvent) {
    meetingUrl = getVideoCallUrl(props.calEvent) || meetingUrl;
  }

  const isPhone = location?.startsWith("+");

  const getMainLocation = () => {
    const location = getLocation(
      props.calEvent.locations as Array<{
        type: string;
        address: string;
        link: string;
        hostPhoneNumber: string;
      }>,
      (providerName || props.calEvent.location) as string
    );
    return location ? (
      <>
        {t(location) as string}
        <br />
      </>
    ) : null;
  };

  // Because of location being a value here, we can determine the app that generated the location only for Dynamic Link based apps where the value is integrations:*
  // For static link based location apps, the value is that URL itself. So, it is not straightforward to determine the app that generated the location.
  // If we know the App we can always provide the name of the app like we do it for Google Hangout/Google Meet

  if (meetingUrl) {
    return (
      <Info
        label={t("where")}
        withSpacer
        description={
          <>
            {getMainLocation()}
            {providerName || "Link"}
          </>
        }
        // extraInfo={
        //   meetingUrl && (
        //     <div style={{ color: "#494949", fontWeight: 400, lineHeight: "24px" }}>
        //       <>
        //         {t("meeting_url")}:{" "}
        //         <a href={meetingUrl} title={t("meeting_url")} style={{ color: "#3E3E3E" }}>
        //           {meetingUrl}
        //         </a>
        //       </>
        //     </div>
        //   )
        // }
      />
    );
  }

  if (isPhone) {
    return (
      <Info
        label={t("where")}
        withSpacer
        description={
          <a href={"tel:" + location} title="Phone" style={{ color: "#3E3E3E" }}>
            {location}
          </a>
        }
      />
    );
  }

  return (
    <Info
      label={t("where")}
      withSpacer
      description={
        <>
          {getMainLocation()}
          {providerName || location}
        </>
      }
      extraInfo={
        (providerName === "Zoom" || providerName === "Google") && props.calEvent.requiresConfirmation ? (
          <p style={{ color: "#494949", fontWeight: 400, lineHeight: "24px" }}>
            <>{t("meeting_url_provided_after_confirmed")}</>
          </p>
        ) : null
      }
    />
  );
}

const getLocation = (
  locations: Array<{
    type: string;
    address: string;
    link: string;
    hostPhoneNumber: string;
  }>,
  providerName: string
) => {
  for (const location of locations) {
    if (location.hostPhoneNumber === providerName) {
      return "audioCall";
    } else if (location.link === providerName) {
      return "chat";
    } else if (location.address === providerName) {
      return "inPerson";
    }
  }
  return null;
};

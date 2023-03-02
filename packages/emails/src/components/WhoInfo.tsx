import type { TFunction } from "next-i18next";

import type { CalendarEvent } from "@calcom/types/Calendar";

import { Info } from "./Info";

const PersonInfo = ({ name = "", role = "" }) => (
  <div style={{ color: "#101010", fontWeight: 400, lineHeight: "24px" }}>
    {name} - {role}{" "}
  </div>
);

export function WhoInfo(props: { calEvent: CalendarEvent; t: TFunction }) {
  const { t } = props;
  return (
    <Info
      label={t("who")}
      description={
        <>
          <PersonInfo name={props.calEvent.organizer.name} role={t("organizer")} />
          {props.calEvent.team?.members.map((member) => (
            <PersonInfo key={member.name} name={member.name} role={t("team_member")} />
          ))}
          {props.calEvent.attendees.map((attendee) => (
            <PersonInfo key={attendee.id || attendee.name} name={attendee.name} role={t("guest")} />
          ))}
        </>
      }
      withSpacer
    />
  );
}

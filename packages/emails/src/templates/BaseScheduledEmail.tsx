import type { TFunction } from "next-i18next";

import dayjs from "@calcom/dayjs";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";

import {
  BaseEmailHtml,
  CustomInputs,
  Info,
  LocationInfo,
  ManageLink,
  WhenInfo,
  WhoInfo,
} from "../components";

const Spacer = () => <p style={{ height: 12 }} />;

export const BaseScheduledEmail = (
  props: {
    calEvent: CalendarEvent & { rescheduled?: boolean };
    attendee: Person;
    timeZone: string;
    includeAppsStatus?: boolean;
    t: TFunction;
  } & Partial<React.ComponentProps<typeof BaseEmailHtml>>
) => {
  const { t, timeZone } = props;

  function getRecipientStart(format: string) {
    return dayjs(props.calEvent.startTime).tz(timeZone).format(format);
  }

  function getRecipientEnd(format: string) {
    return dayjs(props.calEvent.endTime).tz(timeZone).format(format);
  }

  const subject = t(props.subject || "confirmed_event_type_subject", {
    eventType: props.calEvent.type,
    name: props.calEvent.team?.name || props.calEvent.organizer.name,
    date: `${getRecipientStart("h:mma")} - ${getRecipientEnd("h:mma")}, ${t(
      getRecipientStart("dddd").toLowerCase()
    )}, ${t(getRecipientStart("MMMM").toLowerCase())} ${getRecipientStart("D, YYYY")}`,
  });

  return (
    <BaseEmailHtml
      t={t}
      headerType={props.headerType || "checkCircle"}
      subject={props.subject || subject}
      title={t(
        props.title
          ? props.title
          : props.calEvent.recurringEvent?.count
          ? "your_event_has_been_scheduled_recurring"
          : "your_event_has_been_scheduled"
      )}
      callToAction={
        props.callToAction === null
          ? null
          : props.callToAction || <ManageLink attendee={props.attendee} calEvent={props.calEvent} />
      }
      subtitle={props.subtitle || <>{t("emailed_you_and_any_other_attendees")}</>}>
      <Info
        label={t(props.calEvent?.rescheduled ? "reschedule_optional" : "cancellation_reason")}
        description={
          props.calEvent.cancellationReason && props.calEvent.cancellationReason.replace("$RCH$", "")
        } // Removing flag to distinguish reschedule from cancellation
        withSpacer
      />
      <Info label={t("rejection_reason")} description={props.calEvent.rejectionReason} withSpacer />
      <Info label={t("what")} description={props.calEvent.title} withSpacer />
      <WhenInfo calEvent={props.calEvent} t={t} timeZone={timeZone} />
      <WhoInfo calEvent={props.calEvent} t={t} />
      <LocationInfo calEvent={props.calEvent} t={t} />
      <Info label={t("description")} description={props.calEvent.description} withSpacer />
      <Info label={t("additional_notes")} description={props.calEvent.additionalNotes} withSpacer />
      {/* {props.includeAppsStatus && <AppsStatus calEvent={props.calEvent} t={t} />} */}
      <CustomInputs calEvent={props.calEvent} />
      <Spacer />
    </BaseEmailHtml>
  );
};

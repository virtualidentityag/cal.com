import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import type { Dayjs } from "@calcom/dayjs";
import dayjs from "@calcom/dayjs";
import { classNames } from "@calcom/lib";
import { daysInMonth, yyyymmdd } from "@calcom/lib/date-fns";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import useMediaQuery from "@calcom/lib/hooks/useMediaQuery";
import type { WorkingHours } from "@calcom/types/schedule";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogClose,
  Switch,
  Form,
  Button,
} from "@calcom/ui";

import DatePicker from "../../calendars/DatePicker";
import type { TimeRange } from "./Schedule";
import { DayRanges } from "./Schedule";

const ALL_DAY_RANGE = {
  start: new Date(dayjs.utc().hour(0).minute(0).second(0).format()),
  end: new Date(dayjs.utc().hour(0).minute(0).second(0).format()),
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const DateOverrideForm = ({
  value,
  workingHours,
  excludedDates,
  onChange,
  onClose = noop,
}: {
  workingHours?: WorkingHours[];
  onChange: (newValue: TimeRange[]) => void;
  excludedDates: string[];
  value?: TimeRange[];
  onClose?: () => void;
}) => {
  const [browsingDate, setBrowsingDate] = useState<Dayjs>();
  const { t, i18n, isLocaleReady } = useLocale();
  const [datesUnavailable, setDatesUnavailable] = useState(
    value &&
      value[0].start.getHours() === 0 &&
      value[0].start.getMinutes() === 0 &&
      value[0].end.getHours() === 0 &&
      value[0].end.getMinutes() === 0
  );

  const [date, setDate] = useState<Dayjs | null>(value ? dayjs(value[0].start) : null);
  const includedDates = useMemo(
    () =>
      workingHours
        ? workingHours.reduce((dates, workingHour) => {
            for (let dNum = 1; dNum <= daysInMonth(browsingDate || dayjs()); dNum++) {
              const d = browsingDate ? browsingDate.date(dNum) : dayjs.utc().date(dNum);
              if (workingHour.days.includes(d.day())) {
                dates.push(yyyymmdd(d));
              }
            }
            return dates;
          }, [] as string[])
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [browsingDate]
  );

  const form = useForm<{ range: TimeRange[] }>();
  const { reset } = form;

  useEffect(() => {
    if (value) {
      reset({
        range: value.map((range) => ({
          start: new Date(
            dayjs.utc().hour(range.start.getUTCHours()).minute(range.start.getUTCMinutes()).second(0).format()
          ),
          end: new Date(
            dayjs.utc().hour(range.end.getUTCHours()).minute(range.end.getUTCMinutes()).second(0).format()
          ),
        })),
      });
      return;
    }
    const dayRanges = (workingHours || []).reduce((dayRanges, workingHour) => {
      if (date && workingHour.days.includes(date.day())) {
        dayRanges.push({
          start: dayjs.utc().startOf("day").add(workingHour.startTime, "minute").toDate(),
          end: dayjs.utc().startOf("day").add(workingHour.endTime, "minute").toDate(),
        });
      }
      return dayRanges;
    }, [] as TimeRange[]);
    reset({
      range: dayRanges,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, value]);

  return (
    <Form
      form={form}
      handleSubmit={(values) => {
        if (!date) return;

        onChange(
          (datesUnavailable ? [ALL_DAY_RANGE] : values.range).map((item) => {
            console.log({
              test1: date.utc().hour(item.start.getUTCHours()).minute(item.start.getUTCMinutes()).toDate(),
              test2: date.hour(item.start.getUTCHours()).minute(item.start.getUTCMinutes()).toDate(),
              test3: date.hour(item.start.getUTCHours()).minute(item.start.getUTCMinutes()).utc().toDate(),
              test4: date.utc().hour(item.start.getHours()).minute(item.start.getMinutes()).toDate(),
              test5: date.hour(item.start.getHours()).minute(item.start.getMinutes()).toDate(),
              test6: dayjs
                .utc()
                .year(date.year())
                .month(date.month())
                .date(date.date())
                .hour(item.start.getUTCHours())
                .minute(item.start.getUTCMinutes())
                .second(0)
                .toDate(),
              test7: dayjs
                .utc()
                .year(date.year())
                .month(date.month())
                .date(date.date())
                .hour(item.start.getUTCHours())
                .minute(item.start.getUTCMinutes())
                .second(0)
                .toDate(),
              test8: dayjs
                .utc()
                .tz("Europe/Berlin")
                .year(date.year())
                .month(date.month())
                .date(date.date())
                .hour(item.start.getUTCHours())
                .minute(item.start.getUTCMinutes())
                .toDate(),
              test9: dayjs
                .utc()
                .tz("Europe/Berlin")
                .year(date.utc().year())
                .month(date.utc().month())
                .date(date.utc().date())
                .hour(item.start.getUTCHours())
                .minute(item.start.getUTCMinutes())
                .toDate(),
              test10: dayjs
                .utc()
                .year(date.year())
                .month(date.month())
                .date(date.date())
                .hour(item.start.getHours())
                .minute(item.start.getMinutes())
                .second(0)
                .toDate(),
            });

            return {
              start: dayjs
                .utc()
                .year(date.year())
                .month(date.month())
                .date(date.date())
                .hour(item.start.getUTCHours())
                .minute(item.start.getUTCMinutes())
                .second(0)
                .toDate(),
              end: dayjs
                .utc()
                .year(date.year())
                .month(date.month())
                .date(date.date())
                .hour(item.end.getUTCHours())
                .minute(item.end.getUTCMinutes())
                .second(0)
                .toDate(),
            };
          })
        );
        onClose();
      }}
      className="space-y-4 sm:flex sm:space-x-4">
      <div className={classNames(date && "w-full sm:border-r sm:pr-6")}>
        <DialogHeader title={t("date_overrides_dialog_title")} />
        <DatePicker
          includedDates={includedDates}
          excludedDates={excludedDates}
          weekStart={0}
          selected={date}
          onChange={(day) => {
            console.log({ day, dayutc: day.utc(), isLocaleReady, locale: i18n.language });
            setDate(day);
          }}
          onMonthChange={(newMonth) => {
            setBrowsingDate(newMonth);
          }}
          browsingDate={browsingDate}
          locale={isLocaleReady ? i18n.language : "de"}
        />
      </div>
      {date && (
        <div className="relative flex w-full flex-col sm:pl-2">
          <div className="mb-4 flex-grow space-y-4">
            <p className="text-medium text-sm">{t("date_overrides_dialog_which_hours")}</p>
            <div>
              {datesUnavailable ? (
                <p className="rounded border p-2 text-sm text-gray-500">{t("date_overrides_unavailable")}</p>
              ) : (
                <DayRanges name="range" />
              )}
            </div>
            <Switch
              label={t("date_overrides_mark_all_day_unavailable_one")}
              checked={datesUnavailable}
              onCheckedChange={setDatesUnavailable}
              data-testid="date-override-mark-unavailable"
            />
          </div>
          <div className="flex flex-row-reverse">
            <Button
              className="ml-2"
              color="primary"
              type="submit"
              disabled={!date}
              data-testid="add-override-submit-btn">
              {value ? t("date_overrides_update_btn") : t("date_overrides_add_btn")}
            </Button>
            <DialogClose onClick={onClose} />
          </div>
        </div>
      )}
    </Form>
  );
};

const DateOverrideInputDialog = ({
  Trigger,
  excludedDates = [],
  ...passThroughProps
}: {
  workingHours: WorkingHours[];
  excludedDates?: string[];
  Trigger: React.ReactNode;
  onChange: (newValue: TimeRange[]) => void;
  value?: TimeRange[];
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);
  {
    /* enableOverflow is used to allow overflow when there are too many overrides to show on mobile.
       ref:- https://github.com/calcom/cal.com/pull/6215
      */
  }
  const enableOverflow = isMobile;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>

      <DialogContent enableOverflow={enableOverflow} size="md">
        <DateOverrideForm
          excludedDates={excludedDates}
          {...passThroughProps}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DateOverrideInputDialog;

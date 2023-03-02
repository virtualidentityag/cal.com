import type { TFunction } from "next-i18next";

import { WEBAPP_URL } from "@calcom/lib/constants";
import type { CalendarEvent } from "@calcom/types/Calendar";

import Row from "../Row";

export const EmailFooterDigi = (props: { calEvent?: CalendarEvent; t: TFunction }) => {
  return (
    <div style={{ margin: "0px auto", maxWidth: 600, height: 41 }}>
      <Row align="center" border="0" style={{ width: "100%" }}>
        <td style={{ textAlign: "center", padding: 0 }}>
          <div
            style={{
              textAlign: "center",
              padding: "8px 0",
              backgroundColor: "#f2efea",
              fontFamily: "'Nunito', sans-serif",
            }}>
            <a
              href={`${WEBAPP_URL}/impressum`}
              target="_blank"
              style={{
                color: "#666",
                textDecoration: "none",
                fontSize: 14,
              }}
              rel="noreferrer">
              {props.t?.("imprint") as string}
            </a>
            <span
              style={{
                color: "#666",
                textDecoration: "none",
                fontSize: 14,
              }}>
              &nbsp; | &nbsp;
            </span>
            <a
              href={`${WEBAPP_URL}/datenschutz`}
              target="_blank"
              style={{
                color: "#666",
                textDecoration: "none",
                fontSize: 14,
              }}
              rel="noreferrer">
              {props.t?.("privacy") as string}
            </a>
          </div>
        </td>
      </Row>
    </div>
  );
};

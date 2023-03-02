import type { TFunction } from "next-i18next";
import type { CSSProperties } from "react";

import { WEBAPP_URL, IS_PRODUCTION } from "@calcom/lib/constants";

import EmailCommonDivider from "../EmailCommonDivider";
import Row from "../Row";

export type BodyHeadType = "checkCircle" | "xCircle" | "calendarCircle";

export const getHeadImage = (headerType: BodyHeadType): string => {
  switch (headerType) {
    case "checkCircle":
      return IS_PRODUCTION
        ? WEBAPP_URL + "/emails/checkCircle@2x.png"
        : "https://app.cal.com/emails/checkCircle@2x.png";
    case "xCircle":
      return IS_PRODUCTION
        ? WEBAPP_URL + "/emails/xCircle@2x.png"
        : "https://app.cal.com/emails/xCircle@2x.png";
    case "calendarCircle":
      return IS_PRODUCTION
        ? WEBAPP_URL + "/emails/calendarCircle@2x.png"
        : "https://app.cal.com/emails/calendarCircle@2x.png";
  }
};

const EmailSchedulingBodyHeaderDigi = (props: {
  headerType: BodyHeadType;
  headStyles?: CSSProperties;
  t?: TFunction;
}) => {
  const image = getHeadImage(props.headerType);

  return (
    <>
      <EmailCommonDivider headStyles={{ padding: "0", borderTop: "1px solid #E1E1E1" }}>
        <td
          align="left"
          style={{
            fontSize: "18px",
            padding: "45px 25px",
            wordBreak: "break-word",
            height: "100px",
            backgroundColor: "#225e65",
            color: "white",
            lineHeight: "5px",
            fontFamily: "'Nunito', sans-serif",
          }}>
          <h2>{props.t?.("tenant_name") as string}</h2>
          <small>{props.t?.("tenant_claim") as string}</small>
        </td>
      </EmailCommonDivider>
      <EmailCommonDivider headStyles={{ paddingTop: "10px" }}>
        <td
          align="center"
          style={{
            fontSize: "0px",
            padding: "10px 25px",
            wordBreak: "break-word",
          }}>
          <Row border="0" role="presentation" style={{ borderCollapse: "collapse", borderSpacing: "0px" }}>
            <td style={{ width: 64 }}>
              <img
                height="64"
                src={image}
                style={{
                  border: "0",
                  display: "block",
                  outline: "none",
                  textDecoration: "none",
                  height: "64px",
                  width: "100%",
                  fontSize: "13px",
                }}
                width="64"
                alt=""
              />
            </td>
          </Row>
        </td>
      </EmailCommonDivider>
    </>
  );
};

export default EmailSchedulingBodyHeaderDigi;

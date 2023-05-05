import { CallToActionIcon } from "./CallToActionIcon";

export const CallToAction = (props: {
  label: string;
  href: string;
  secondary?: boolean;
  startIconName?: string;
  endIconName?: string;
}) => {
  const { label, href, secondary, startIconName, endIconName } = props;

  const calculatePadding = () => {
    const paddingTop = "0.625rem";
    const paddingBottom = "0.625rem";
    let paddingLeft = "1rem";
    let paddingRight = "1rem";

    if (startIconName) {
      paddingLeft = "0.875rem";
    } else if (endIconName) {
      paddingRight = "0.875rem";
    }

    return `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;
  };

  return (
    <p
      style={{
        display: "inline-block",
        background: secondary ? "#FFFFFF" : "#292929",
        border: secondary ? "1px solid #d1d5db" : "",
        color: "#ffffff",
        fontFamily: "Nunito, sans-serif",
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: "1rem",
        margin: 0,
        textDecoration: "none",
        textTransform: "none",
        padding: calculatePadding(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        msoPaddingAlt: "0px",
        borderRadius: "6px",
        boxSizing: "border-box",
        height: "2.25rem",
      }}>
      <a
        style={{
          color: secondary ? "#292929" : "#FFFFFF",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
        }}
        href={href}
        target="_blank"
        rel="noreferrer">
        {startIconName && (
          <CallToActionIcon
            style={{
              marginRight: "0.5rem",
              marginLeft: 0,
            }}
            iconName={startIconName}
            secondary={secondary}
          />
        )}
        {label}
        {endIconName && <CallToActionIcon iconName={endIconName} secondary={secondary} />}
      </a>
    </p>
  );
};

const Spacer = () => <p style={{ height: 6 }} />;

export const Paragraph = (props: { content: string; withSpacer?: boolean; lineThrough?: boolean }) => {
  if (!props.content || props.content === "") return null;
  return (
    <>
      {props.withSpacer && <Spacer />}
      <p
        style={{
          color: "#494949",
          fontWeight: 400,
          whiteSpace: "pre-wrap",
          lineHeight: "12px",
          textDecoration: props.lineThrough ? "line-through" : undefined,
        }}>
        {props.content}
      </p>
    </>
  );
};

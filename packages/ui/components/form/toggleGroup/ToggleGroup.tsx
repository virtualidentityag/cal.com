import * as RadixToggleGroup from "@radix-ui/react-toggle-group";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { classNames } from "@calcom/lib";
import { Tooltip } from "@calcom/ui";

interface ToggleGroupProps extends Omit<RadixToggleGroup.ToggleGroupSingleProps, "type"> {
  options: { value: string; label: string | ReactNode; disabled?: boolean; tooltip?: string }[];
  isFullWidth?: boolean;
}

const OptionalTooltipWrapper = ({
  children,
  tooltipText,
}: {
  children: ReactNode;
  tooltipText?: ReactNode;
}) => {
  if (tooltipText) {
    return (
      <Tooltip delayDuration={150} sideOffset={12} side="bottom" content={tooltipText}>
        {children}
      </Tooltip>
    );
  }
  return <>{children}</>;
};

export const ToggleGroup = ({ options, onValueChange, isFullWidth, ...props }: ToggleGroupProps) => {
  const [value, setValue] = useState<string | undefined>(props.defaultValue);
  const [activeToggleElement, setActiveToggleElement] = useState<null | HTMLButtonElement>(null);

  useEffect(() => {
    if (value && onValueChange) onValueChange(value);
  }, [value, onValueChange]);

  return (
    <>
      <RadixToggleGroup.Root
        type="single"
        {...props}
        onValueChange={setValue}
        className={classNames(
          "min-h-9 bg-muted border-default relative inline-flex gap-0.5 rounded-md border p-1",
          props.className,
          isFullWidth && "w-full"
        )}>
        {/* Active toggle. It's a separate element so we can animate it nicely. */}
        <span
          aria-hidden
          className="bg-emphasis absolute top-[4px] bottom-[4px] left-0 z-[0] rounded-[4px] transition-all"
          style={{ left: activeToggleElement?.offsetLeft, width: activeToggleElement?.offsetWidth }}
        />
        {options.map((option) => (
          <OptionalTooltipWrapper key={option.value} tooltipText={option.tooltip}>
            <RadixToggleGroup.Item
              disabled={option.disabled}
              value={option.value}
              className={classNames(
                "relative rounded-[4px] px-3 py-1 text-sm leading-tight",
                option.disabled
                  ? "text-gray-400 hover:cursor-not-allowed"
                  : "text-default [&[aria-checked='false']]:hover:bg-subtle",
                isFullWidth && "w-full"
              )}
              ref={(node) => {
                if (node && value === option.value && activeToggleElement !== node) {
                  setActiveToggleElement(node);
                }
                return node;
              }}>
              {option.label}
            </RadixToggleGroup.Item>
          </OptionalTooltipWrapper>
        ))}
      </RadixToggleGroup.Root>
    </>
  );
};

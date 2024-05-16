import React from "react";

import { cn } from "@mc/ui";
import { Separator } from "@mc/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mc/ui/tooltip";

type ItemProps = {
  itemClassName?: string;
  icon?: string | React.ReactNode;
  run: () => void;
  name: string;
  isSelected?: boolean;
  notSelectable?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Item = (props: ItemProps) => {
  const { icon: icon, run, name, notSelectable, itemClassName } = props;
  let { isSelected } = props;

  if (notSelectable) isSelected = false;

  const itemImageStyle: React.CSSProperties =
    typeof icon === "string" ? { backgroundImage: `url('${icon}')` } : {};

  return (
    <>
      <div {...props} className={cn("relative")}>
        <div
          className={cn(
            "duration-[200ms] absolute mt-[4px] h-[40px] w-[4px] rounded-r-[12px]  bg-white transition-all ease-linear",
            {
              ["translate-x-[-15px]"]: !isSelected,
            },
          )}
        />
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "bg-[#424242]",
                  "background mx-3 flex h-[48px] w-[48px] cursor-pointer select-none overflow-hidden bg-contain bg-center",
                  "duration-[120px] transition-all",
                  "rounded-[100%] focus-within:rounded-[15px] hover:rounded-[15px]",
                  {
                    ["rounded-[15px]"]: isSelected,
                  },
                  itemClassName,
                )}
                style={itemImageStyle}
                onClick={run}
                onKeyDown={(e) => ["Enter", "Space"].includes(e.key) && run()}
                role="link"
                tabIndex={0}
                aria-label={name}
              >
                {icon == null ? (
                  <div
                    aria-hidden="true"
                    className="m-auto overflow-hidden text-ellipsis whitespace-nowrap p-1"
                  >
                    {name
                      .split(/\s+/g)
                      .map((x) => x[0])
                      .join("")}
                  </div>
                ) : (
                  typeof icon !== "string" && icon
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">{name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

type Props = {
  itemClassName?: string;
  pre: ItemProps[];
  guilds: ItemProps[];
} & React.HTMLAttributes<HTMLElement>;

const DSelector = (props: Props) => {
  const { guilds, pre, itemClassName } = props;

  return (
    <nav
      {...props}
      className={cn("my-3 flex w-[72px] flex-col gap-3", props.className)}
    >
      {pre.map((item, i) => (
        <Item {...item} key={i} itemClassName={itemClassName} />
      ))}
      {!!pre.length && (
        <Separator
          orientation="horizontal"
          className="m-auto h-0 w-10 border-t border-border/90 bg-inherit"
        />
      )}
      {guilds.map((item, i) => (
        <Item {...item} key={i} itemClassName={itemClassName} />
      ))}
    </nav>
  );
};

export default DSelector;

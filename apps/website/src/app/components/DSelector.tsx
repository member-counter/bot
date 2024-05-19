import React from "react";

import { cn } from "@mc/ui";
import { Separator } from "@mc/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mc/ui/tooltip";

interface ItemProps {
  classNameForItem?: string;
  icon?: string | React.ReactNode;
  run: () => void;
  name: string;
  isSelected?: boolean;
  notSelectable?: boolean;
}

const Item = (props: ItemProps) => {
  const { icon: icon, run, name, notSelectable, classNameForItem } = props;
  let { isSelected } = props;

  if (notSelectable) isSelected = false;

  const itemImageStyle: React.CSSProperties =
    typeof icon === "string" ? { backgroundImage: `url('${icon}')` } : {};

  return (
    <>
      <div className={cn("relative")}>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "group bg-[#424242]",
                  "background mx-3 flex h-[48px] w-[48px] cursor-pointer select-none overflow-hidden bg-contain bg-center",
                  "duration-[120px] transition-all",
                  "rounded-[100%] focus-within:rounded-[15px] hover:rounded-[15px]",
                  {
                    ["rounded-[15px]"]: isSelected,
                  },
                  classNameForItem,
                )}
                style={itemImageStyle}
                onClick={run}
                onKeyDown={(e) => ["Enter", "Space"].includes(e.key) && run()}
                role="link"
                tabIndex={0}
                aria-label={name}
              >
                <div className="absolute ml-[-12px] flex h-[48px] w-[8px] items-center justify-start">
                  <div
                    className={cn(
                      "duration-[150ms] transition-all ease-out",
                      "ml-[-4px] h-[8px] w-[8px] rounded-r-[4px] bg-white",
                      "translate-x-[-3px] opacity-0",
                      {
                        "group-hover:h-[20px] group-hover:translate-x-[0px] group-hover:opacity-100":
                          !isSelected,
                        "h-[40px] translate-x-[0px] opacity-100": isSelected,
                      },
                    )}
                  />
                </div>
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

interface Props {
  className: string;
  classNameForItem?: string;
  pre: ItemProps[];
  guilds: ItemProps[];
}

const DSelector = (props: Props) => {
  const { guilds, pre, classNameForItem } = props;

  return (
    <nav
      className={cn(
        "my-3 flex w-[72px] min-w-[72px] flex-col gap-3",
        props.className,
      )}
    >
      {pre.map((item, i) => (
        <Item {...item} key={i} classNameForItem={classNameForItem} />
      ))}
      {!!pre.length && <Separator orientation="horizontal" />}
      {guilds.map((item, i) => (
        <Item {...item} key={i} classNameForItem={classNameForItem} />
      ))}
    </nav>
  );
};

export default DSelector;

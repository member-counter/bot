import type { LucideIcon } from "lucide-react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import { cn } from "@mc/ui";
import { CardBorderIlluminated } from "@mc/ui/card";

interface Props {
  imgBgClassName?: string;
  imgBgSrc?: string | StaticImport;
  icon: React.ComponentType<{ className: string }> | LucideIcon;
  title: string;
  description: string;
}

export function SupportedCountersCard(props: Props) {
  return (
    <CardBorderIlluminated>
      <article className={"flex h-full w-full flex-row"}>
        <div className="w-[90px] flex-none ">
          <div className="relative flex h-full items-center justify-center [&>*]:rounded-l-lg">
            {props.imgBgSrc && (
              <Image
                alt=""
                src={props.imgBgSrc}
                className="h-full object-cover"
              />
            )}
            <div
              className={cn(
                "absolute h-full  w-full",
                { "bg-black opacity-70": props.imgBgSrc },
                props.imgBgClassName,
              )}
            />
            <props.icon className=" absolute h-12 w-12" />
          </div>
        </div>
        <div className="p-3">
          <h1 className="text-md font-semibold tracking-tight">
            {props.title}
          </h1>
          <p className="text-sm">{props.description}</p>
        </div>
      </article>
    </CardBorderIlluminated>
  );
}

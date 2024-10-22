"use client";

import type { DiscordUser } from "@mc/validators/DiscordUser";
 
import {
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mc/ui/dialog"; 

import { DisplayUsername } from "../components/DisplayUsername";
import { useTranslation } from "react-i18next";
import { Separator } from "@mc/ui/separator";

/* eslint-disable @next/next/no-img-element */
export function Donor({
  className,
  user,
  donations,
}: {
  className: string;
  user: DiscordUser;
  donations: {
    note: string;
    amount: number;
    currency: string;
    anonymous: boolean;
    date: Date;
  }[];
}) {
const { i18n } = useTranslation();

const dateFormatter = Intl.DateTimeFormat(i18n.language, {dateStyle: "short"  });
const currencyFormatter = (currency: string) => Intl.NumberFormat(i18n.language, { currency, style: "currency" });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={className}
          style={{
            backgroundImage: `url(${user.avatar})`,
          }}
        ></div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-2">
            <img
              src={user.avatar}
              alt={`${user.username}'s avatar`}
              className="h-8 w-8 rounded-full"
            />
            <DisplayUsername {...user} />
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          {donations.map((donation,i) => (
            <>  
            <div className="">
                <div className="flex justify-between text-muted-foreground">
                    <div>
                    {dateFormatter.format(donation.date)}
                    </div>
                    <div className="">
                        {currencyFormatter(donation.currency).format(donation.amount)} 
                    </div>
                </div>
              <div className="my-2">
                {donation.note}
              </div>
            </div>
            {i != donations.length - 1 && <Separator className="my-4 bg-accent-foreground" />}
            </>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

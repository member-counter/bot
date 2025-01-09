import Link from "next/link";
import { useTranslation } from "react-i18next";

import { CurrencyUtils } from "@mc/common/currencyUtils";
import { Card, CardContent, CardHeader } from "@mc/ui/card";

import type { RouterOutputs } from "~/trpc/react";
import { Routes } from "~/other/routes";
import { DisplayUser } from "../users/DisplayUser";

export function Donation(
  donation: RouterOutputs["donor"]["geAllDonations"][number],
) {
  const { i18n } = useTranslation();
  const { amount, currency, currencyDecimals } = donation;
  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    dateStyle: "short",
  });

  return (
    <Link href={Routes.ManageDonations(donation.id)}>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          {donation.user ? <DisplayUser {...donation.user} /> : donation.userId}
          <div className="flex-grow"></div>
          <div className="flex flex-col items-end gap-2 text-muted-foreground">
            <div>{dateFormatter.format(donation.date)}</div>
            <div className="">
              {CurrencyUtils.format(
                i18n.language,
                amount,
                currency,
                currencyDecimals,
              )}
            </div>
          </div>
        </CardHeader>
        {donation.note && <CardContent>{donation.note}</CardContent>}
      </Card>
    </Link>
  );
}

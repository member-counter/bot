import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { CurrencyUtils } from "@mc/common/currencyUtils";
import { routes } from "@mc/common/Routes";
import { Card, CardHeader } from "@mc/ui/card";

import type { RouterOutputs } from "~/lib/trpc";
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
    <Link
      to={routes.admin.donations.donation.$buildPath({
        params: { id: donation.id },
      })}
    >
      <Card>
        <CardHeader className="flex flex-row justify-between gap-2 space-y-0">
          <div className="flex flex-col gap-2 self-start">
            {donation.user ? (
              <DisplayUser {...donation.user} />
            ) : (
              donation.userId
            )}
            <p className="text-wrap break-all">{donation.note}</p>
          </div>
          <div className="flex-grow"></div>
          <div className="flex flex-col items-end gap-2 text-muted-foreground">
            <div>{dateFormatter.format(donation.date)}</div>
            <div>
              {CurrencyUtils.format(
                i18n.language,
                amount,
                currency,
                currencyDecimals,
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

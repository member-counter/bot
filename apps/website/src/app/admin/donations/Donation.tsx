import type { DonationData } from "@mc/services/donations";
import { useTranslation } from "react-i18next";

export function Donation(donation: DonationData) {
  const { i18n } = useTranslation();

  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    dateStyle: "short",
  });
  const currencyFormatter = (currency: string) =>
    Intl.NumberFormat(i18n.language, { currency, style: "currency" });

  return (
    <div className="">
      <div className="flex justify-between text-muted-foreground">
        <div>{dateFormatter.format(donation.date)}</div>
        <div className="">
          {currencyFormatter(donation.currency).format(donation.amount)}
        </div>
      </div>
      <div className="my-2">{donation.note}</div>
    </div>
  );
}

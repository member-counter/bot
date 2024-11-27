"use client";

import { useMemo } from "react";
import Link from "next/link";
import { DollarSignIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Skeleton } from "@mc/ui/skeleton";

import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import { Donation } from "./Donation";

function LoadingPage() {
  return new Array(5).fill(null).map((_) => <Skeleton className="h-[400px]" />);
}

export default function Page() {
  const { t } = useTranslation();
  const donations = api.donor.geAllDonations.useQuery();
  const total = donations.data?.length ?? "???";
  const totalValue = useMemo(
    () => donations.data?.reduce((acc, curr) => acc + curr.value, 0) ?? "???",
    [donations.data],
  );

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <span>
          {t("pages.admin.donations.totalDonations", { total, totalValue })}
        </span>
        <Link href={Routes.ManageDonationsNew()}>
          <Button icon={DollarSignIcon}>
            {t("pages.admin.donations.registerDonation", { total, totalValue })}
          </Button>
        </Link>
      </div>

      {donations.data ? (
        donations.data.map((donation) => (
          <Donation key={donation.id} {...donation} />
        ))
      ) : (
        <LoadingPage />
      )}
    </>
  );
}

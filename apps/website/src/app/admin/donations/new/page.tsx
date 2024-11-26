"use client";

import type { CreateDonationData } from "@mc/services/donations";
import { useState } from "react";
import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Card, CardHeader } from "@mc/ui/card";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import { api } from "~/trpc/react";
import { DonationForm } from "../DonationForm";

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();

  const [donation, setDonation] = useState<CreateDonationData>({
    userId: "",
    amount: 0,
    note: "",
    currency: "EUR",
    anonymous: false,
    date: new Date(),
  });

  const registerDonationMutation = api.donor.registerDonation.useMutation();

  const handleSubmit = async (donation: CreateDonationData) => {
    await registerDonationMutation.mutateAsync(donation);
    router.push(`/admin/donations`);
  };

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex h-20 flex-row items-center justify-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div className="grow"></div>
        <TypographyH4 className="mt-0">
          {t("pages.admin.donations.new.title")}
        </TypographyH4>
        <div className="grow"></div>
      </CardHeader>
      <DonationForm
        value={donation}
        onChange={setDonation}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}

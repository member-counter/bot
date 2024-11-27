"use client";

import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Card, CardContent, CardHeader } from "@mc/ui/card";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import type { RouterInputs } from "~/trpc/react";
import { FormManagerState } from "~/hooks/useFormManager";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import { DonationForm } from "../DonationForm";

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();

  const [donation, setDonation] = useState<
    RouterInputs["donor"]["registerDonation"]
  >({
    userId: "",
    amount: 0,
    note: "",
    currency: "EUR",
    anonymous: false,
    date: new Date(),
  });

  const registerDonationMutation = api.donor.registerDonation.useMutation();

  const handleSubmit = async (
    donation: RouterInputs["donor"]["registerDonation"],
  ) => {
    const { id } = await registerDonationMutation.mutateAsync(donation);
    router.replace(Routes.ManageDonations(id));
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
      <CardContent>
        <DonationForm
          formState={FormManagerState.UNSAVED}
          value={donation}
          onChange={setDonation}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}

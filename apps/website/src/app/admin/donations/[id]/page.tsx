"use client";;
import { use } from "react";

import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Card, CardContent, CardHeader } from "@mc/ui/card";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import { Errors } from "~/app/errors";
import { useFormManager } from "~/hooks/useFormManager";
import { api } from "~/trpc/react";
import { DonationForm } from "../DonationForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default function Page(props: Props) {
  const params = use(props.params);

  const {
    id
  } = params;

  const { t } = useTranslation();
  const donationQuery = api.donor.getDonation.useQuery({ id });
  const donationMutation = api.donor.updateDonation.useMutation();
  const router = useRouter();
  const [
    _donation,
    mutableDonation,
    setMutableDonation,
    saveDonation,
    formState,
  ] = useFormManager(donationQuery, donationMutation);

  if (!donationQuery.data && !donationQuery.isLoading) {
    throw new Error(Errors.NotFound);
  }

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex h-20 flex-row items-center justify-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div className="grow"></div>
        <TypographyH4 className="mt-0">
          {t("pages.admin.donations.edit.title")}
        </TypographyH4>
        <div className="grow"></div>
        {donationQuery.isLoading ? (
          <LoaderIcon className="h-5 w-5 animate-spin" />
        ) : (
          <div className="h-5 w-5"></div>
        )}
      </CardHeader>
      <CardContent>
        {mutableDonation && (
          <DonationForm
            formState={formState}
            value={mutableDonation}
            onChange={setMutableDonation}
            onSubmit={saveDonation}
          />
        )}
      </CardContent>
    </Card>
  );
}

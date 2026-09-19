import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@mc/common/Routes";
import { Errors } from "@mc/trpc-api/utils/errors";
import { Button } from "@mc/ui/button";
import { Card, CardContent, CardHeader } from "@mc/ui/card";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import { FormManagerProvider } from "~/app/components/FormManager";
import { useFormManager } from "~/lib/hooks/useFormManager";
import { usePrefersAutosave } from "~/lib/hooks/usePrefersAutosave";
import { useNavigate } from "~/lib/navigation";
import { api } from "~/lib/trpc";
import { DonationForm } from "../DonationForm";

export default function Page() {
  const { id } = useTypedParams(routes.admin.donations.donation);
  const { t } = useTranslation();
  const donationQuery = api.donor.getDonation.useQuery({ id });
  const donationMutation = api.donor.updateDonation.useMutation();
  const navigate = useNavigate();
  const prefersAutosave = usePrefersAutosave();

  const form = useFormManager(
    donationQuery,
    donationMutation,
    id,
    prefersAutosave,
  );
  const {
    value: mutableDonation,
    setValue: setMutableDonation,
    save: saveDonation,
  } = form;

  if (!donationQuery.data && !donationQuery.isLoading) {
    throw new Error(Errors.NotFound);
  }

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex h-20 flex-row items-center justify-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
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
          <FormManagerProvider value={form}>
            <DonationForm
              value={mutableDonation}
              onChange={setMutableDonation}
              onSubmit={saveDonation}
            />
          </FormManagerProvider>
        )}
      </CardContent>
    </Card>
  );
}

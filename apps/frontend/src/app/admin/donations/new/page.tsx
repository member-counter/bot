import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DEFAULT_CURRENCY,
  DEFAULT_CURRENCY_DECIMALS,
} from "@mc/common/Constants";
import { routes } from "@mc/common/Routes";
import { Button } from "@mc/ui/button";
import { Card, CardContent, CardHeader } from "@mc/ui/card";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import type { RouterInputs } from "~/lib/trpc";
import { FormManagerState } from "~/lib/hooks/useFormManager";
import useShowError from "~/lib/hooks/useShowError";
import { useNavigate } from "~/lib/navigation";
import { api } from "~/lib/trpc";
import { DonationForm } from "../DonationForm";

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showError = useShowError();

  const [donation, setDonation] = useState<
    RouterInputs["donor"]["registerDonation"]
  >({
    userId: "",
    amount: 0n,
    note: "",
    currency: DEFAULT_CURRENCY,
    currencyDecimals: DEFAULT_CURRENCY_DECIMALS,
    anonymous: false,
    date: new Date(),
  });

  const registerDonationMutation = api.donor.registerDonation.useMutation();

  const handleSubmit = async (
    donation: RouterInputs["donor"]["registerDonation"],
  ) => {
    try {
      const { id } = await registerDonationMutation.mutateAsync(donation);
      void navigate(
        routes.admin.donations.donation.$buildPath({ params: { id } }),
        { replace: true },
      );
    } catch (error) {
      showError(error);
    }
  };

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex h-20 flex-row items-center justify-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
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

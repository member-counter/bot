import { SaveIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Checkbox } from "@mc/ui/checkbox";
import { Form } from "@mc/ui/form";
import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import { Textarea } from "@mc/ui/textarea";

import type { RouterInputs } from "~/trpc/react";
import { FormManagerState } from "~/hooks/useFormManager";
import {
  addTimezoneOffset,
  subTimezoneOffset,
} from "~/other/fixTimezoneOffset";
import { DeleteButton } from "./DeleteButton";

export function DonationForm<
  T extends
    | RouterInputs["donor"]["registerDonation"]
    | RouterInputs["donor"]["updateDonation"],
>({
  formState,
  value,
  onChange,
  onSubmit,
}: {
  formState: FormManagerState;
  value: T;
  onChange: (newValue: T) => void;
  onSubmit: (newValue: T) => void;
}) {
  const { t } = useTranslation();

  return (
    <Form onSubmit={() => onSubmit(value)}>
      <Label>
        {t("pages.admin.donations.form.userId")}
        <Input
          required
          value={value.userId}
          onChange={(e) => {
            onChange({ ...value, userId: e.target.value });
          }}
        />
      </Label>
      <Checkbox
        checked={value.anonymous}
        onCheckedChange={(v) => onChange({ ...value, anonymous: !!v })}
      >
        {t("pages.admin.donations.form.anonymous")}
      </Checkbox>
      <div className="flex gap-2">
        <div className="flex-grow">
          <Label>
            {t("pages.admin.donations.form.amount")}
            <Input
              min={0}
              required
              type="number"
              value={Number(value.amount)}
              onChange={(e) =>
                onChange({
                  ...value,
                  amount: BigInt(e.target.value.replaceAll(/[^0-9]+/g, "")),
                })
              }
            />
          </Label>
        </div>
        <div className="flex-shrink">
          <Label>
            {t("pages.admin.donations.form.currency")}
            <Input
              value={value.currency}
              onChange={(e) => onChange({ ...value, currency: e.target.value })}
            />
          </Label>
        </div>
        <div className="flex-shrink">
          <Label>
            {t("pages.admin.donations.form.currencyDecimals")}
            <Input
              value={value.currencyDecimals}
              onChange={(e) =>
                onChange({
                  ...value,
                  currencyDecimals: Number(
                    e.target.value.replaceAll(/[^0-9]+/g, ""),
                  ),
                })
              }
            />
          </Label>
        </div>
      </div>
      <Label>
        {t("pages.admin.donations.form.note")}
        <Textarea
          value={value.note}
          onChange={(e) => onChange({ ...value, note: e.target.value })}
        />
      </Label>
      <Label>
        {t("pages.admin.donations.form.date")}
        <Input
          type="datetime-local"
          value={
            value.date
              ? subTimezoneOffset(value.date).toISOString().slice(0, 16)
              : ""
          }
          onChange={(e) =>
            onChange({
              ...value,
              date: addTimezoneOffset(e.target.valueAsNumber),
            })
          }
        />
      </Label>
      <div className="flex flex-row justify-between">
        {"id" in value && <DeleteButton donationId={value.id} />}
        <div className="grow"></div>
        <Button
          icon={SaveIcon}
          type="submit"
          disabled={[FormManagerState.SAVED, FormManagerState.SAVING].includes(
            formState,
          )}
        >
          {formState === FormManagerState.SAVED
            ? t("hooks.useFormManager.state.saved")
            : formState === FormManagerState.SAVING
              ? t("hooks.useFormManager.state.saving")
              : t("hooks.useFormManager.state.save")}
        </Button>
      </div>
    </Form>
  );
}

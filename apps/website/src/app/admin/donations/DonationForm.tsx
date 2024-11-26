import type {
  CreateDonationData,
  UpdateDonationData,
} from "@mc/services/donations";

export function DonationForm<
  T extends CreateDonationData | UpdateDonationData,
>({
  value,
  onChange,
  onSubmit,
}: {
  value: T;
  onChange: (newValue: T) => void;
  onSubmit: (newValue: T) => void;
}) {
  return <></>;
}

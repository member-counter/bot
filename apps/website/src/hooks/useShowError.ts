import { TRPCClientError } from "@trpc/client";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { KnownErrorsTypeNames } from "@mc/common/KnownError/index";
import { useToast } from "@mc/ui/hooks/use-toast";

export default function useShowError() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const showUnknown = (error: unknown): unknown => {
    toast({ title: t("common.unknownError"), variant: "destructive" });
    return error;
  };

  return (error: unknown) => {
    if (!(error instanceof TRPCClientError)) throw showUnknown(error);

    const errorMessage = z.enum(KnownErrorsTypeNames).safeParse(error.message);

    if (!errorMessage.success) throw showUnknown(error);

    toast({
      title: t(`common.knownError`),
      description: t(`common.knownErrors.${errorMessage.data}`),
      variant: "destructive",
    });
  };
}

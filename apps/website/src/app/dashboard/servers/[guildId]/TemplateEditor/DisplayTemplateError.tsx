import { useTranslation } from "react-i18next";
import { z } from "zod";

import { DataSourceErrorNames } from "@mc/common/KnownError/DataSourceError";
import { Card } from "@mc/ui/card";

export function DisplayTemplateError({ message }: { message: string }) {
  const { t } = useTranslation();
  let translationKey: (typeof DataSourceErrorNames)[number] = "UNKNOWN";

  const parsedError = z.enum(DataSourceErrorNames).safeParse(message);

  if (parsedError.success) {
    translationKey = parsedError.data;
  }
  return (
    <Card className="border border-destructive p-3">
      <pre className="w-full whitespace-pre-wrap">
        {t(`common.knownErrors.${translationKey}`)}
      </pre>
    </Card>
  );
}

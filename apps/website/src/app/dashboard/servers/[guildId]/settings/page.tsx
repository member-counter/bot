"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SaveIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { UserPermissions } from "@mc/common/UserPermissions";
import { Button } from "@mc/ui/button";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildParams } from "../layout";
import useConfirmOnLeave from "~/hooks/useConfirmOnLeave";
import { api } from "~/trpc/react";
import { LoadingPage } from "../LoadingPage";
import { UserPermissionsContext } from "../UserPermissionsContext";
import { BlockButton } from "./BlockButton";
import DemoFormattersProvider from "./DemoFormatters";
import { ResetSettings } from "./ResetButton";
import { CustomDigits } from "./sections/CustomDigits";
import { Locale } from "./sections/Locale";
import { UseCompactNotation } from "./sections/UseCompactNotation";

export default function Page() {
  const { t } = useTranslation();
  const userPermissions = useContext(UserPermissionsContext);
  const { guildId } = useParams<DashboardGuildParams>();
  const guildSettingsMutation = api.guild.update.useMutation();
  const guildSettingsQuery = api.guild.get.useQuery({
    discordGuildId: guildId,
  });
  const guildSettings = guildSettingsQuery.data;
  const [isDirty, setIsDirty] = useState(false);
  const [mutableGuildSettings, _setMutableGuildSettings] = useState<
    typeof guildSettings
  >(structuredClone(guildSettings));

  useConfirmOnLeave(isDirty);

  useEffect(() => {
    if (!guildSettings) return;
    if (isDirty) return;
    _setMutableGuildSettings(structuredClone(guildSettings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildSettings]);

  if (!mutableGuildSettings) return <LoadingPage />;

  const setMutableGuildSettings = (value: typeof guildSettings) => {
    _setMutableGuildSettings(value);
    setIsDirty(true);
  };

  const save = async () => {
    _setMutableGuildSettings(
      await guildSettingsMutation.mutateAsync({
        ...mutableGuildSettings,
      }),
    );
    setIsDirty(false);
  };

  return (
    <DemoFormattersProvider locale={mutableGuildSettings.formatSettings.locale}>
      <form
        action={save}
        className="m-auto flex min-h-full flex-col gap-5 p-3 sm:max-w-[600px]"
      >
        <UseCompactNotation
          value={mutableGuildSettings.formatSettings.compactNotation}
          onChange={(checked) =>
            setMutableGuildSettings({
              ...mutableGuildSettings,
              formatSettings: {
                ...mutableGuildSettings.formatSettings,
                compactNotation: !!checked,
              },
            })
          }
          disabled={!userPermissions.canModify}
        />
        <Separator />
        <Locale
          value={mutableGuildSettings.formatSettings.locale}
          onChange={(locale) =>
            setMutableGuildSettings({
              ...mutableGuildSettings,
              formatSettings: {
                ...mutableGuildSettings.formatSettings,
                locale,
              },
            })
          }
          disabled={!userPermissions.canModify}
        />
        <Separator />
        <CustomDigits
          readyToInitiate={guildSettingsQuery.isSuccess}
          value={mutableGuildSettings.formatSettings.digits}
          onChange={(digits) =>
            setMutableGuildSettings({
              ...mutableGuildSettings,
              formatSettings: {
                ...mutableGuildSettings.formatSettings,
                digits,
              },
            })
          }
          disabled={!userPermissions.canModify}
        />
        <div className="mt-auto flex flex-col flex-wrap justify-between gap-3 sm:flex-row-reverse">
          <Button
            icon={SaveIcon}
            type="submit"
            disabled={
              !userPermissions.canModify ||
              !isDirty ||
              guildSettingsMutation.isPending
            }
          >
            {isDirty
              ? t("pages.dashboard.servers.settings.save")
              : t("pages.dashboard.servers.settings.saved")}
          </Button>
          {userPermissions.user.has(UserPermissions.SeeGuilds) && (
            <BlockButton
              guildId={guildId}
              disabled={!userPermissions.user.has(UserPermissions.ManageGuilds)}
            />
          )}
          <ResetSettings
            guildId={guildId}
            disabled={
              !userPermissions.canModify || guildSettingsMutation.isPending
            }
          />
        </div>
      </form>
    </DemoFormattersProvider>
  );
}

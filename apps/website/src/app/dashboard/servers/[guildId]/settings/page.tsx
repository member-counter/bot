"use client";

import { useContext } from "react";
import { useParams } from "next/navigation";
import { SaveIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { UserPermissions } from "@mc/common/UserPermissions";
import { Button } from "@mc/ui/button";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildParams } from "../layout";
import { FormManagerState, useFormManager } from "~/hooks/useFormManager";
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
  const guildSettingsQuery = api.guild.get.useQuery({
    discordGuildId: guildId,
  });

  const [
    _guildSettings,
    mutableGuildSettings,
    setMutableGuildSettings,
    save,
    formState,
  ] = useFormManager(guildSettingsQuery, api.guild.update.useMutation());

  if (!mutableGuildSettings) return <LoadingPage />;

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
              [FormManagerState.SAVED, FormManagerState.SAVING].includes(
                formState,
              )
            }
          >
            {formState === FormManagerState.SAVED
              ? t("hooks.useFormManager.state.saved")
              : formState === FormManagerState.SAVING
                ? t("hooks.useFormManager.state.saving")
                : t("hooks.useFormManager.state.save")}
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
              !userPermissions.canModify ||
              formState === FormManagerState.SAVING
            }
          />
        </div>
      </form>
    </DemoFormattersProvider>
  );
}

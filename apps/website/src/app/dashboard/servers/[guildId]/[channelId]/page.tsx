"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SaveIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildChannelParams } from "./layout";
import useConfirmOnLeave from "~/hooks/useConfirmOnLeave";
import { api } from "~/trpc/react";
import { LoadingPage } from "../LoadingPage";
import { UserPermissionsContext } from "../UserPermissionsContext";
import { EditTemplate } from "./sections/EditTemplate";
import { EnableTemplate } from "./sections/EnableTemplate";
import { TemplateError } from "./sections/TemplateError";
// TODO fix: enable status is being set to its initial state when template content is changed
export default function Page() {
  const { t } = useTranslation();
  const { guildId, channelId } = useParams<DashboardGuildChannelParams>();
  const trpcUtils = api.useUtils();
  const userPermissions = useContext(UserPermissionsContext);
  const [isDirty, setIsDirty] = useState(false);

  const { data: channelSettings } = api.guild.channels.get.useQuery({
    discordGuildId: guildId,
    discordChannelId: channelId,
  });
  const [mutableChannelSettings, _setMutableChannelSettings] = useState(
    structuredClone(channelSettings),
  );
  const channelSettingsMutation = api.guild.channels.update.useMutation({
    onSuccess() {
      void trpcUtils.guild.invalidate();
    },
  });

  useConfirmOnLeave(isDirty);

  useEffect(() => {
    if (!channelSettings) return;
    if (isDirty) return;
    _setMutableChannelSettings(structuredClone(channelSettings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelSettings]);

  if (!mutableChannelSettings) return <LoadingPage />;

  const setMutableGuildSettings = (value: typeof channelSettings) => {
    _setMutableChannelSettings(value);
    setIsDirty(true);
  };

  const save = async () => {
    _setMutableChannelSettings(
      await channelSettingsMutation.mutateAsync({
        ...mutableChannelSettings,
      }),
    );
    setIsDirty(false);
  };

  return (
    <form
      action={save}
      className="m-auto flex min-h-full flex-col gap-5 p-3 sm:max-w-[600px]"
    >
      <EnableTemplate
        disabled={!userPermissions.canModify}
        value={mutableChannelSettings.isTemplateEnabled}
        onChange={(value) =>
          setMutableGuildSettings({
            ...mutableChannelSettings,
            isTemplateEnabled: value,
          })
        }
      />
      <Separator />
      <EditTemplate
        disabled={!userPermissions.canModify}
        value={mutableChannelSettings.template}
        onChange={(value) =>
          setMutableGuildSettings({
            ...mutableChannelSettings,
            template: value,
          })
        }
      />
      <TemplateError />
      <div className="mt-auto flex flex-col justify-between gap-3 sm:flex-row-reverse">
        <Button
          icon={SaveIcon}
          type="submit"
          disabled={
            !userPermissions.canModify ||
            !isDirty ||
            channelSettingsMutation.isPending
          }
        >
          {isDirty
            ? t("pages.dashboard.servers.channels.save")
            : t("pages.dashboard.servers.channels.saved")}
        </Button>
      </div>
    </form>
  );
}

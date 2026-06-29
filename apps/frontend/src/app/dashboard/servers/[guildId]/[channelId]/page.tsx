import { useContext } from "react";
import { SaveIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTypedParams } from "react-router-typesafe-routes";
import invariant from "tiny-invariant";

import { isBotSupportedChannel } from "@mc/common/channelType";
import { routes } from "@mc/common/Routes";
import { Button } from "@mc/ui/button";
import { Separator } from "@mc/ui/separator";

import { FormManagerState, useFormManager } from "~/lib/hooks/useFormManager";
import { api } from "~/lib/trpc";
import { LoadingPage } from "../../../../components/LoadingPage";
import { UserPermissionsContext } from "../UserPermissionsContext";
import { EditTemplate } from "./sections/EditTemplate";
import { EnableTemplate } from "./sections/EnableTemplate";
import MissingPermissionsWarning from "./sections/MissingPermissionsWarning";
import { TemplateError } from "./sections/TemplateError";

export default function Page() {
  const { t } = useTranslation();
  const { guildId, channelId } = useTypedParams(
    routes.dashboard.servers.server.channel,
  );
  invariant(channelId, "Expected channelId to be defined");
  invariant(guildId, "Expected guildId to be defined");
  const trpcUtils = api.useUtils();
  const userPermissions = useContext(UserPermissionsContext);
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channel = guild.data?.channels.get(channelId);

  const [
    _channelSettings,
    mutableChannelSettings,
    setMutableGuildSettings,
    save,
    formState,
  ] = useFormManager(
    api.guild.channels.get.useQuery({
      discordGuildId: guildId,
      discordChannelId: channelId,
    }),
    api.guild.channels.update.useMutation({
      onSuccess() {
        void trpcUtils.guild.invalidate();
      },
    }),
    channelId,
  );

  if (!mutableChannelSettings) return <LoadingPage />;

  if (channel && !isBotSupportedChannel(channel.type)) {
    return (
      <div className="m-auto flex min-h-full flex-col items-center justify-center gap-2 p-3 text-center text-muted-foreground">
        <p>
          {t("pages.dashboard.servers.ChannelNavItem.unsupportedChannelType")}
        </p>
        <p className="text-sm">
          {t(
            "pages.dashboard.servers.ChannelNavItem.unsupportedChannelTypeHint",
          )}
        </p>
      </div>
    );
  }

  return (
    <form
      action={save}
      className="m-auto flex min-h-full flex-col gap-5 p-3 sm:max-w-[600px]"
    >
      <MissingPermissionsWarning />
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
      </div>
    </form>
  );
}

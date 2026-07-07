import { useContext } from "react";
import { useTypedParams } from "react-router-typesafe-routes";
import invariant from "tiny-invariant";

import { routes } from "@mc/common/Routes";
import { UserPermissions } from "@mc/common/UserPermissions";
import { Separator } from "@mc/ui/separator";

import { FormManagerProvider, SaveButton } from "~/app/components/FormManager";
import { FormManagerState, useFormManager } from "~/lib/hooks/useFormManager";
import { usePrefersAutosave } from "~/lib/hooks/usePrefersAutosave";
import { api } from "~/lib/trpc";
import { LoadingPage } from "../../../../components/LoadingPage";
import { UserPermissionsContext } from "../UserPermissionsContext";
import { BlockButton } from "./BlockButton";
import DemoFormattersProvider from "./DemoFormatters";
import { ResetSettings } from "./ResetButton";
import { CustomDigits } from "./sections/CustomDigits";
import { Locale } from "./sections/Locale";
import { UseCompactNotation } from "./sections/UseCompactNotation";

export default function Page() {
  const userPermissions = useContext(UserPermissionsContext);
  const prefersAutosave = usePrefersAutosave();
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  invariant(guildId, "Expected guildId to be defined");
  const guildSettingsQuery = api.guild.get.useQuery({
    discordGuildId: guildId,
  });

  const form = useFormManager(
    guildSettingsQuery,
    api.guild.update.useMutation(),
    guildId,
    prefersAutosave,
  );
  const {
    value: mutableGuildSettings,
    setValue: setMutableGuildSettings,
    save,
    state: formState,
  } = form;

  if (!mutableGuildSettings) return <LoadingPage />;

  return (
    <DemoFormattersProvider locale={mutableGuildSettings.formatSettings.locale}>
      <FormManagerProvider value={form}>
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
            <SaveButton disabled={!userPermissions.canModify} />
            {userPermissions.user.has(UserPermissions.SeeGuilds) && (
              <BlockButton
                guildId={guildId}
                disabled={
                  !userPermissions.user.has(UserPermissions.ManageGuilds)
                }
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
      </FormManagerProvider>
    </DemoFormattersProvider>
  );
}

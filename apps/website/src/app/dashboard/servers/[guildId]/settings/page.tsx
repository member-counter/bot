"use client";

import { useContext, useEffect, useId, useState } from "react";
import { useParams } from "next/navigation";
import { SaveIcon, ServerCogIcon } from "lucide-react";

import { Button } from "@mc/ui/button";
import { Checkbox } from "@mc/ui/checkbox";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildParams } from "../layout";
import { api } from "~/trpc/react";
import { MenuButton } from "../../../MenuButton";
import { LoadingPage } from "../LoadingPage";
import { UserPermissionsContext } from "../UserPermissionsContext";
import { ResetSettings } from "./ResetButton";

export default function Page() {
  const compactNotationCheckbox = useId();
  const userPermissions = useContext(UserPermissionsContext);
  const { guildId } = useParams<DashboardGuildParams>();
  const guildSettingsMutation = api.guild.update.useMutation();
  const [guildSettings] = api.guild.get.useSuspenseQuery({
    discordGuildId: guildId,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [mutableGuildSettings, _setMutableGuildSettings] =
    useState<typeof guildSettings>(null);

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
    await guildSettingsMutation.mutateAsync({
      ...mutableGuildSettings,
    });
    setIsDirty(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[48px] w-full flex-shrink-0 flex-row items-center justify-center pl-3 pr-1 font-semibold">
        <ServerCogIcon className="mr-3 h-5 w-5" />
        <div>Server Settings</div>
        <MenuButton />
      </div>
      <Separator orientation="horizontal" />
      <div className="grow overflow-hidden">
        <form
          action={save}
          className="m-auto flex h-full  flex-col  gap-3 overflow-auto p-3 sm:max-w-[500px]"
          onInput={() => setIsDirty(true)}
        >
          <Checkbox
            id={compactNotationCheckbox}
            checked={mutableGuildSettings.formatSettings.compactNotation}
            onCheckedChange={(checked) =>
              setMutableGuildSettings({
                ...mutableGuildSettings,
                formatSettings: {
                  ...mutableGuildSettings.formatSettings,
                  compactNotation: !!checked,
                },
              })
            }
            disabled={!userPermissions.canModify}
          >
            Use compact notation for numbers
          </Checkbox>
          <div className="mt-auto flex flex-col gap-3 sm:flex-row-reverse">
            <Button
              className="w-auto"
              icon={SaveIcon}
              type="submit"
              disabled={
                !userPermissions.canModify ||
                !isDirty ||
                guildSettingsMutation.isPending
              }
            >
              {guildSettingsMutation.isSuccess && !isDirty ? "Saved" : "Save"}
            </Button>
            <ResetSettings className="w-auto sm:mr-auto" guildId={guildId} />
          </div>
        </form>
      </div>
    </div>
  );
}

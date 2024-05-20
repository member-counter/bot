"use client";

import { useEffect, useId, useState } from "react";
import { useParams } from "next/navigation";
import { ServerCogIcon } from "lucide-react";

import { Checkbox } from "@mc/ui/checkbox";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildParams } from "../layout";
import { api } from "~/trpc/react";
import { MenuButton } from "../../../MenuButton";

export default function Page() {
  const compactNotationCheckbox = useId();

  const { guildId } = useParams<DashboardGuildParams>();
  const guildSettingsMutation = api.guild.update.useMutation();
  const [guildSettings, guildSettingsQuery] = api.guild.get.useSuspenseQuery({
    discordGuildId: guildId,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [mutableGuildSettings, setMutableGuildSettings] =
    useState<typeof guildSettings>(null);

  useEffect(() => {
    if (!guildSettings) return;
    if (isDirty) return;
    setMutableGuildSettings(structuredClone(guildSettings));
  }, [guildSettings, isDirty]);

  useEffect(() => {
    setIsDirty(true);
  }, [mutableGuildSettings]);

  if (!mutableGuildSettings) return; // TODO skeleton

  const save = async () => {
    await guildSettingsMutation.mutateAsync({
      ...mutableGuildSettings,
    });
    setIsDirty(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[48px] w-full flex-shrink-0 flex-row items-center pl-3 pr-1 font-semibold">
        <ServerCogIcon className="mr-3 h-5 w-5" />
        <div>Server Settings</div>
        <MenuButton />
      </div>
      <Separator orientation="horizontal" />
      <div className="grow overflow-hidden">
        <div className="h-full overflow-auto p-3">
          <div className="max-w-[400px] space-y-4">
            <Checkbox id={compactNotationCheckbox}>
              Use compact notation for numbers
            </Checkbox>
          </div>
        </div>
      </div>
    </div>
  );
}

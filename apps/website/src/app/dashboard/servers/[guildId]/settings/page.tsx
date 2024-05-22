"use client";

import { useContext, useEffect, useId, useState } from "react";
import { useParams } from "next/navigation";
import { SaveIcon, ServerCogIcon } from "lucide-react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";
import { Checkbox } from "@mc/ui/checkbox";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildParams } from "../layout";
import AutocompleteInput from "~/app/components/AutocompleteInput";
import { searchableLocales } from "~/other/locales";
import { api } from "~/trpc/react";
import { MenuButton } from "../../../MenuButton";
import { LoadingPage } from "../LoadingPage";
import {
  AutocompleteLocaleItemRenderer,
  localeItemRenderer,
} from "../TemplateEditor/DataSource/Format/DataSourceFormat";
import DataSourceFormatDigitInput from "../TemplateEditor/DataSource/Format/DataSourceFormatDigitInput";
import { UserPermissionsContext } from "../UserPermissionsContext";
import { ResetSettings } from "./ResetButton";

export default function Page() {
  const compactNotationCheckbox = useId();
  const [guildSettingsDataId, setGuildSettingsDataId] = useState(0);
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
    setGuildSettingsDataId(Math.random());
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
    <div className="flex h-full flex-col">
      <div className="flex h-[48px] w-full flex-shrink-0 flex-row items-center justify-center pl-3 pr-1 font-semibold">
        <ServerCogIcon className="mr-3 h-5 w-5 sm:hidden" aria-hidden />
        <h1>Server Settings</h1>
        <MenuButton />
      </div>
      <Separator orientation="horizontal" />
      <div className="grow overflow-hidden">
        <form
          action={save}
          className="m-auto flex h-full  flex-col  gap-5 overflow-auto p-3 sm:max-w-[500px]"
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
          <Label className="flex flex-col gap-3">
            Locale
            {mutableGuildSettings.formatSettings.locale &&
              [mutableGuildSettings.formatSettings.locale].map(
                localeItemRenderer({
                  remove: () =>
                    setMutableGuildSettings({
                      ...mutableGuildSettings,
                      formatSettings: {
                        ...mutableGuildSettings.formatSettings,
                        locale: "",
                      },
                    }),
                  update: (locale) =>
                    setMutableGuildSettings({
                      ...mutableGuildSettings,
                      formatSettings: {
                        ...mutableGuildSettings.formatSettings,
                        locale,
                      },
                    }),
                }),
              )}
            {!mutableGuildSettings.formatSettings.locale && (
              <AutocompleteInput
                itemRenderer={AutocompleteLocaleItemRenderer}
                placeholder="Search locale..."
                onAdd={(locale) => {
                  setMutableGuildSettings({
                    ...mutableGuildSettings,
                    formatSettings: {
                      ...mutableGuildSettings.formatSettings,
                      locale,
                    },
                  });
                }}
                suggestLimit={10}
                suggestableItems={searchableLocales}
                allowSearchedItem={true}
              />
            )}
          </Label>
          <div className="flex flex-col gap-3">
            <Label>Custom digits</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {new Array(10).fill("").map((_, i) => {
                return (
                  <DataSourceFormatDigitInput
                    key={i}
                    className={cn({ "col-span-3": i === 0 })}
                    initialValue={
                      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                      mutableGuildSettings.formatSettings.digits[i] ||
                      i.toString()
                    }
                    readAgainInitialValue={guildSettingsDataId}
                    onChange={(digit) => {
                      mutableGuildSettings.formatSettings.digits[i] =
                        digit || i.toString();
                      setMutableGuildSettings({
                        ...mutableGuildSettings,
                      });
                    }}
                    placeholder={i.toString()}
                  />
                );
              })}
            </div>
          </div>
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
              {isDirty ? "Save" : "Saved"}
            </Button>
            <ResetSettings
              className="w-auto sm:mr-auto"
              guildId={guildId}
              disabled={
                !userPermissions.canModify || guildSettingsMutation.isPending
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useContext, useEffect, useId, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { SaveIcon, ServerCogIcon } from "lucide-react";

import { UserPermissions } from "@mc/common/UserPermissions";
import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";
import { Label } from "@mc/ui/label";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";
import { Separator } from "@mc/ui/separator";
import { Switch } from "@mc/ui/switch";

import type { DashboardGuildParams } from "../layout";
import { Combobox } from "~/app/components/Combobox";
import {
  renderLocaleItem,
  renderSelectedLocaleItem,
} from "~/app/components/Combobox/renderers/localeItemRenderer";
import useConfirmOnLeave from "~/hooks/useConfirmOnLeave";
import { searchableLocales } from "~/other/locales";
import { api } from "~/trpc/react";
import { MenuButton } from "../../../MenuButton";
import { LoadingPage } from "../LoadingPage";
import DataSourceFormatDigitInput from "../TemplateEditor/DataSource/Format/DataSourceFormatDigitInput";
import { UserPermissionsContext } from "../UserPermissionsContext";
import { BlockButton } from "./BlockButton";
import { ResetSettings } from "./ResetButton";

export default function Page() {
  const compactNotationSwitch = useId();
  const localeInput = useId();
  const [guildSettingsDataId, setGuildSettingsDataId] = useState(0);
  const userPermissions = useContext(UserPermissionsContext);
  const { guildId } = useParams<DashboardGuildParams>();
  const guildSettingsMutation = api.guild.update.useMutation();
  const { data: guildSettings } = api.guild.get.useQuery({
    discordGuildId: guildId,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [mutableGuildSettings, _setMutableGuildSettings] = useState<
    typeof guildSettings
  >(structuredClone(guildSettings));

  useConfirmOnLeave(isDirty);

  useEffect(() => {
    if (!guildSettings) return;
    if (isDirty) return;
    _setMutableGuildSettings(structuredClone(guildSettings));
    setGuildSettingsDataId(Math.random());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildSettings]);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(
        mutableGuildSettings?.formatSettings.locale as Intl.LocalesArgument,
        {
          notation: "compact",
        },
      ),
    [mutableGuildSettings?.formatSettings.locale],
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(
        mutableGuildSettings?.formatSettings.locale as Intl.LocalesArgument,
        {
          hour: "numeric",
          minute: "numeric",
        },
      ),
    [mutableGuildSettings?.formatSettings.locale],
  );

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
        <div className="h-full  overflow-auto">
          <form
            action={save}
            className="m-auto flex  flex-col  gap-5  p-3 sm:max-w-[600px]"
          >
            <div className="mt-auto flex items-center justify-between">
              <div>
                <Label htmlFor={compactNotationSwitch}>
                  Use compact notation for numbers
                </Label>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Counters that returns numbers will be displayed in a more
                    compact way.
                  </p>
                  <ul className="ml-4 mt-1 list-disc">
                    <li>
                      12300 will be displayed as {numberFormatter.format(12300)}
                    </li>
                    <li>
                      439212 will be displayed as{" "}
                      {numberFormatter.format(439212)}
                    </li>
                    <li>
                      1500000 will be displayed as{" "}
                      {numberFormatter.format(1500000)}
                    </li>
                  </ul>
                </div>
              </div>
              <Switch
                id={compactNotationSwitch}
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
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-3">
              <Label htmlFor={localeInput}>Locale</Label>
              <div className="text-sm text-muted-foreground">
                <p>
                  Changing this will affect how some counters are displayed.
                </p>
                <ul className="ml-4 mt-1 list-disc">
                  <li>
                    15:30h (or 3:30 PM) will be displayed as{" "}
                    {timeFormatter.format(new Date("2024 15:30"))}
                  </li>
                  <li>
                    439212 will be displayed as {numberFormatter.format(439212)}
                  </li>
                </ul>
              </div>
              <Combobox
                id={localeInput}
                allowSearchedItem
                items={searchableLocales}
                placeholder="Search locale..."
                onItemSelect={(locale) => {
                  setMutableGuildSettings({
                    ...mutableGuildSettings,
                    formatSettings: {
                      ...mutableGuildSettings.formatSettings,
                      locale,
                    },
                  });
                }}
                selectedItem={mutableGuildSettings.formatSettings.locale}
                onItemRender={renderLocaleItem}
                onSelectedItemRender={renderSelectedLocaleItem}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-3">
              <Label>Custom digits</Label>{" "}
              <p className="text-sm text-muted-foreground">
                In counters that return a number, Member counter will replace
                each digit with the ones you provide. This is useful if you want
                to display custom emojis or something else, such as "unicode
                style fonts."
              </p>
              <p className="text-sm text-muted-foreground">
                <b>
                  Keep in mind that users using a screen reader (text-to-speech)
                  may not be able to understand the customized digits and{" "}
                  <LinkUnderlined
                    href="https://x.com/kentcdodds/status/1083073242330361856"
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    may hear something unintelligible
                  </LinkUnderlined>
                  . Screen readers are often used by people with visual
                  disabilities.{" "}
                </b>
              </p>
              <p className="text-sm text-muted-foreground">
                We do not recommend customizing any digit unless you are certain
                that nobody using a screen reader will have access to any
                counter.
              </p>
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
                      digitNumber={i}
                    />
                  );
                })}
              </div>
            </div>
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
                {isDirty ? "Save" : "Saved"}
              </Button>
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
                  !userPermissions.canModify || guildSettingsMutation.isPending
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

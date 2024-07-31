import type { DataSource, DataSourceGame } from "@mc/common/DataSource";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import type { Searchable } from "~/app/components/Combobox";
import { Combobox } from "~/app/components/Combobox";
import { gamedigWithDataSourceItem } from "~/app/components/Combobox/renderers/gameWithDataSourceItem";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { api } from "~/trpc/react";
import { useKnownSearcheableDataSource } from "../../metadata";
import useDataSourceOptions from "../useDataSourceOptions";

type DataSourceType = DataSourceGame;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    game: options.game,
    address: options.address,
    port: options.port,
  };
};

export function GameOptions({
  options: unmergedOptions,
  onOptionsChange,
}: SetupOptionsInterface<DataSourceType>) {
  const { t } = useTranslation();
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  const { data: games } = api.bot.gamedigGames.useQuery();

  const knownSearcheableDataSources = useKnownSearcheableDataSource();

  const searchableGames = useMemo<Searchable<string | DataSource>[]>(
    () => [
      ...Object.entries(games ?? {}).map(([id, game]) => ({
        value: id,
        keywords: game.name.split(/\s+/),
      })),
      ...knownSearcheableDataSources,
    ],
    [games, knownSearcheableDataSources],
  );

  useEffect(() => {
    if (typeof options.game !== "string") return;
    const selectedGame = games?.[options.game];
    if (!selectedGame) return;
    setOptions({
      port: options.port ?? selectedGame.port,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.game]);

  return (
    <div>
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.GameOptions.game",
          )}
        </Label>
        <Combobox
          items={searchableGames}
          placeholder={t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.GameOptions.searchPlaceholder",
          )}
          prefillSelectedItemOnSearchOnFocus
          selectedItem={options.game}
          onItemSelect={(game) => {
            setOptions({
              game,
            });
          }}
          onItemRender={gamedigWithDataSourceItem()}
          onSelectedItemRender={gamedigWithDataSourceItem({
            onUpdate: (game) => {
              setOptions({
                game,
              });
            },
            onRemove: () => {
              setOptions({
                game: undefined,
              });
            },
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.GameOptions.gameWarning",
            ),
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.GameOptions.address",
          )}
        </Label>
        <Combobox
          items={knownSearcheableDataSources}
          allowSearchedTerm
          placeholder=""
          prefillSelectedItemOnSearchOnFocus
          selectedItem={options.address}
          onItemSelect={(address) => {
            setOptions({
              address,
            });
          }}
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate: (address) => {
              setOptions({
                address,
              });
            },
            onRemove: () => {
              setOptions({
                address: undefined,
              });
            },
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.GameOptions.addressWarning",
            ),
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.GameOptions.port",
          )}
        </Label>
        <Combobox
          items={knownSearcheableDataSources}
          placeholder=""
          allowSearchedTerm
          prefillSelectedItemOnSearchOnFocus
          selectedItem={
            typeof options.port === "number"
              ? options.port.toString()
              : options.port
          }
          onItemSelect={(item) => {
            if (typeof item === "string") {
              if (!isNaN(Number(item)))
                setOptions({
                  port: Number(item),
                });
            } else {
              setOptions({
                port: item,
              });
            }
          }}
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate: (item) => {
              if (typeof item === "string") {
                if (!isNaN(Number(item)))
                  setOptions({
                    port: Number(item),
                  });
              } else {
                setOptions({
                  port: item,
                });
              }
            },
            onRemove: () => {
              setOptions({ port: undefined });
            },
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.GameOptions.portWarning",
            ),
          })}
        />
      </div>
    </div>
  );
}

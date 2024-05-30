import type { DataSource, DataSourceGame } from "@mc/common/DataSource";
import { useEffect, useMemo } from "react";

import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import type { Searchable } from "~/app/components/Combobox";
import { Combobox } from "~/app/components/Combobox";
import { gameWithDataSourceItem } from "~/app/components/Combobox/renderers/gameWithDataSourceItem";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import {
  knownSearcheableDataSources,
  searcheableDataSources,
} from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";

type DataSourceType = DataSourceGame;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    game: options.game,
    address: options.address,
    port: options.port,
  };
};

// TODO
interface GameSpec {
  name: string;
  release_year?: number;
  options: {
    protocol: string;
    port?: number;
    port_query?: number;
    port_query_offset?: number | number[];
  };
}

export function GameOptions({
  options: unmergedOptions,
  onOptionsChange,
}: SetupOptionsInterface<DataSourceType>) {
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  // TODO fetch games
  const games: Record<string, GameSpec> = useMemo(() => ({}), []);

  const searchableGames = useMemo<Searchable<string | DataSource>[]>(
    () => [
      ...Object.entries(games).map(([key, gameSpec]) => ({
        value: key,
        keywords: gameSpec.name.split(" "),
      })),
      ...searcheableDataSources,
    ],
    [games],
  );

  useEffect(() => {
    if (typeof options.game !== "string") return;
    const selectedGame = games[options.game];
    if (!selectedGame) return;
    setOptions({
      port:
        options.port ??
        selectedGame.options.port ??
        selectedGame.options.port_query,
    });
  }, [games, options.game, options.port, setOptions]);

  return (
    <div>
      <div>
        <Label>Game ID</Label>
        <Combobox
          items={searchableGames}
          placeholder=""
          prefillSelectedItemOnSearchOnFocus
          selectedItem={options.game}
          onItemSelect={(game) => {
            setOptions({
              game,
            });
          }}
          onItemRender={gameWithDataSourceItem()}
          onSelectedItemRender={gameWithDataSourceItem({
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
            dataSourceConfigWarning:
              "Remember to return a valid node-gamedig game type",
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>Address</Label>
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
            dataSourceConfigWarning: "Remember to return a valid address",
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>Port (or query port)</Label>
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
            dataSourceConfigWarning: "Remember to return a valid port number",
          })}
        />
      </div>
    </div>
  );
}

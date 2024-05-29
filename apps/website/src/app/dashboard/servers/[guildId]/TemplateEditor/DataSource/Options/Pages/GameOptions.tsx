import type { DataSource, DataSourceGame } from "@mc/common/DataSource";
import { useEffect, useMemo } from "react";

import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { Searchable } from "../../../../../../../components/Combobox";
import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { searcheableDataSources } from "../../dataSourcesMetadata";
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

// TODO use new combobox
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
        {options.game &&
          [options.game].map(
            gameItemRendererFactory({
              remove: () => setOptions({ game: undefined }),
              update: (game) => setOptions({ game }),
              dataSourceConfigWarning:
                "Remember to return a valid node-gamedig game type",
              games,
            }),
          )}
        {!options.game && (
          <Combobox
            itemRenderer={AutocompleteGameItemRenderer}
            placeholder="Search game..."
            onAdd={(game) => {
              setOptions({ game });
            }}
            suggestableItems={searchableGames}
          />
        )}
      </div>
      <Separator />
      <div>
        <Label>Address</Label>
        {options.address &&
          [options.address].map(
            textItemRendererFactory({
              remove: () => setOptions({ address: undefined }),
              update: (address) => setOptions({ address }),
              dataSourceConfigWarning: "Remember to return a valid address",
            }),
          )}
        {!options.address && (
          <Combobox
            itemRenderer={AutocompleteTextItemRenderer}
            placeholder=""
            onAdd={(address) => {
              setOptions({ address });
            }}
            allowSearchedItem={true}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>
      <Separator />
      <div>
        <Label>Port (or query port)</Label>
        {options.port &&
          [options.port].map(
            numberItemRendererFactory({
              remove: () => setOptions({ port: undefined }),
              update: (port) => setOptions({ port }),
            }),
          )}
        {!options.port && (
          <Combobox
            itemRenderer={AutocompleteTextItemRenderer}
            placeholder=""
            onAdd={(port) => {
              if (typeof port === "string") {
                if (!isNaN(Number(port))) setOptions({ port: Number(port) });
              } else {
                setOptions({ port });
              }
            }}
            allowSearchedItem={true}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>
    </div>
  );
}

export const gameItemRendererFactory =
  ({
    remove,
    update,
    dataSourceConfigWarning,
    games,
  }: {
    update?: (value: string | DataSource, index: number) => void;
    remove?: (index: number) => void;
    dataSourceConfigWarning?: string;
    games: Record<string, GameSpec>;
  }) =>
  (item: string | DataSource, index: number) => {
    if (typeof item === "string") {
      const gameSpec = games[item];
      return (
        <TextItem
          key={index}
          label={gameSpec?.name ?? "Unknown game"}
          onClickDelete={remove && (() => remove(index))}
        />
      );
    } else {
      return (
        <DataSourceItem
          key={index}
          dataSource={item}
          configWarning={dataSourceConfigWarning}
          onClickDelete={remove && (() => remove(index))}
          onChangeDataSource={
            update && ((dataSource) => update(dataSource, index))
          }
        />
      );
    }
  };

export const AutocompleteGameItemRenderer = (
  item: string | DataSource,
  index: number,
  isSelected: boolean,
  onClick: () => void,
) => {
  // TODO fetch games
  const games: Record<string, GameSpec> = useMemo(() => ({}), []);

  if (typeof item === "string") {
    const gameSpec = games[item];
    return (
      <TextItem
        key={index}
        label={gameSpec?.name ?? "Unknown game"}
        isSelected={isSelected}
        onClick={onClick}
      />
    );
  } else {
    return (
      <DataSourceItem
        key={index}
        dataSource={item}
        isSelected={isSelected}
        onClick={onClick}
      />
    );
  }
};

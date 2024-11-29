import assert from "assert";
import { GameDig } from "gamedig";

import { DataSourceId } from "@mc/common/DataSource";
import { KnownError } from "@mc/common/KnownError/index";

import { DataSourceEvaluator } from "..";

export const gameEvaluator = new DataSourceEvaluator({
  id: DataSourceId.GAME,
  execute: async ({ options }) => {
    assert(
      options.address,
      new KnownError({ type: "DataSourceError", name: "GAME_MISSING_ADDRESS" }),
    );
    assert(
      options.port,
      new KnownError({ type: "DataSourceError", name: "GAME_MISSING_PORT" }),
    );
    assert(
      options.game,
      new KnownError({ type: "DataSourceError", name: "GAME_MISSING_GAME_ID" }),
    );

    const response = await GameDig.query({
      type: options.game,
      host: options.address,
      port: options.port,
      maxRetries: 5,
    });

    return response.numplayers;
  },
});

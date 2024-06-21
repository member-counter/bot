import assert from "assert";
import { GameDig } from "gamedig";

import { DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";
import { DataSourceError } from "../DataSourceError";

// TODO add support again for `ragemp` (https://cdn.rage.mp/master/) and `minecraft-alt` (https://api.mcsrvstat.us/2/${hostname}) in a fork of node-gamedig
export const gameEvaluator = new DataSourceEvaluator({
  id: DataSourceId.GAME,
  execute: async ({ options }) => {
    assert(options.address, new DataSourceError("GAME_MISSING_ADDRESS"));
    assert(options.port, new DataSourceError("GAME_MISSING_PORT"));
    assert(options.game, new DataSourceError("GAME_MISSING_GAME_ID"));

    const response = await GameDig.query({
      type: options.game,
      host: options.address,
      port: options.port,
      maxRetries: 5,
    });

    return response.numplayers;
  },
});

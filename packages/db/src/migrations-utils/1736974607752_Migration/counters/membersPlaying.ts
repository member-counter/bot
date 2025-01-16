import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const MembersPlayingCounter: ConvertCounter = {
  aliases: ["membersplaying"],
  convert: ({ format, args }) => {
    const games = args[0]?.map((game) => game.trim().toLowerCase());

    return {
      id: DataSourceId.MEMBERS,
      format,
      options: {
        playing: games,
      },
    };
  },
};

export default MembersPlayingCounter;

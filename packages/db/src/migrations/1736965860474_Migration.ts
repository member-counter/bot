/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

const oldDefaultDigits = [
  "<a:0G:469275067969306634>",
  "<a:1G:469275169190445056>",
  "<a:2G:469275085451034635>",
  "<a:3G:469275208684011550>",
  "<a:4G:469275195170095124>",
  "<a:5G:469282528088293377>",
  "<a:6G:469275153038049280>",
  "<a:7G:469275104933838858>",
  "<a:8G:469275116988137482>",
  "<a:9G:469275181135691777>",
];
const newDefaultDigits = [
  "<a:0G:701869754616512672>",
  "<a:1G:701869754578894939>",
  "<a:2G:701869754641547324>",
  "<a:3G:701869754717175828>",
  "<a:4G:701869754880753824>",
  "<a:5G:701869754763182080>",
  "<a:6G:701869754641809529>",
  "<a:7G:701869754402734183>",
  "<a:8G:701869754356596869>",
  "<a:9G:701869754687815720>",
];

export class Migration1736965860474 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // Guild Settings
    const guildsCollection = db.collection("guilds");

    await guildsCollection.updateMany(
      {},
      {
        $rename: {
          guild_id: "guild",
          lang: "language",
          topicCounterCustomNumbers: "digits",
        },
      },
    );

    const guildsCursor = guildsCollection.find();

    while (await guildsCursor.hasNext()) {
      const oldSettings: any = await guildsCursor.next();

      const counters = {} as Record<string, string>;
      const digits: (string | undefined | null)[] = [];

      const oldMainTopic = (
        (oldSettings.mainTopicCounter as string) || "Members: {count}"
      ).replace(/\{count\}/gi, "{members}");

      if ("topicCounterChannels" in oldSettings)
        Object.entries(
          oldSettings.topicCounterChannels as Record<
            string,
            Record<string, unknown>
          >,
        ).forEach(([channelId, channelConfig]) => {
          let topic;

          if (typeof channelConfig.topic === "string") {
            topic = channelConfig.topic.replace(/\{count\}/gi, "{members}");
          } else {
            topic = oldMainTopic;
          }

          counters[channelId] = topic;
        });

      if ("channelNameCounters" in oldSettings)
        Object.entries(
          oldSettings.channelNameCounters as Record<
            string,
            {
              channelName: string;
              type: string;
              otherConfig?: { roles: string[] };
            }
          >,
        ).forEach(([channelId, channelConfig]) => {
          let name = channelConfig.channelName;
          let type = channelConfig.type;

          if (
            channelConfig.type === "memberswithrole" &&
            channelConfig.otherConfig
          ) {
            type += ":" + channelConfig.otherConfig.roles.join(",");
          }

          name = name.replace(/\{count\}/gi, "{" + type + "}");

          counters[channelId] = name;
        });

      if ("topicCounterCustomNumbers" in oldSettings) {
        for (const [iString, value] of Object.entries(
          oldSettings.topicCounterCustomNumbers as string[],
        )) {
          const i = Number(iString);

          if (value === oldDefaultDigits[i]) {
            digits[i] = newDefaultDigits[i];
          } else {
            digits[i] = value;
          }
        }
      }

      await guildsCollection.findOneAndUpdate(
        {
          guild: oldSettings.guild,
        },
        {
          $set: { counters, digits },
          $unset: {
            mainTopicCounter: 1,
            topicCounterChannels: 1,
            channelNameCounters: 1,
          },
        },
      );
    }

    // User settings
    const usersCollection = db.collection("users");
    await usersCollection.dropIndexes();

    await usersCollection.updateMany(
      {},
      {
        $rename: {
          user_id: "user",
        },
      },
    );
    await usersCollection.updateMany(
      { premium: true },
      { $bit: { badges: { or: 0b1 } }, $unset: { premium: 1 } },
    );
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}

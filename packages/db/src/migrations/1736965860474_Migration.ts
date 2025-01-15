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

    const guildsCursor = guildsCollection.find();

    while (await guildsCursor.hasNext()) {
      const oldSettings: any = await guildsCursor.next();

      const newSettings = {
        guild: oldSettings.guild_id,
        counters: {},
      } as Record<string, any>;

      if ("premium" in oldSettings) {
        newSettings.premium = oldSettings.premium;
      }
      if ("lang" in oldSettings) {
        newSettings.language = oldSettings.lang;
      }
      if ("prefix" in oldSettings) {
        newSettings.prefix = oldSettings.prefix;
      }
      if ("topicCounterCustomNumbers" in oldSettings) {
        const newDigitsArray: (string | undefined)[] = [];
        for (const [iString, value] of Object.entries(
          oldSettings.topicCounterCustomNumbers as string[],
        )) {
          const i = Number(iString);

          if (value === oldDefaultDigits[i]) {
            newDigitsArray[i] = newDefaultDigits[i];
          } else {
            newDigitsArray[i] = value;
          }
        }
        newSettings.digits = newDigitsArray;
      }

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

          newSettings.counters[channelId] = topic;
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

          newSettings.counters[channelId] = name;
        });

      await guildsCollection.insertOne(newSettings);
      await guildsCollection.findOneAndDelete({
        guild_id: oldSettings.guild_id,
      });
    }

    // User settings
    const usersCollection = db.collection("users");

    const userCursor = usersCollection.find();

    while (await userCursor.hasNext()) {
      const oldUser: any = await userCursor.next();

      const newUser = {
        user: oldUser.user_id,
      } as Record<string, unknown>;

      if ("availableServerUpgrades" in oldUser) {
        newUser.availableServerUpgrades = oldUser.availableServerUpgrades;
      }

      if ("premium" in oldUser && oldUser.premium) {
        newUser.badges = 0b1;
      }

      await usersCollection.insertOne(newUser);
      await usersCollection.findOneAndDelete({ user_id: oldUser.user_id });
    }
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}

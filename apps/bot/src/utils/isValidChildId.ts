import type { BotInstanceOptions } from "@mc/common/bot/BotInstanceOptions";

export function makeIsValidChild(botInstanceOptions: BotInstanceOptions) {
  const instanceCount = Math.ceil(
    botInstanceOptions.shardCount / botInstanceOptions.shards.length,
  );

  return (entry: string) => {
    const id = Number(entry);
    return Number.isInteger(id) && id >= 0 && id < instanceCount;
  };
}

import { IntentsBitField } from "discord.js";

export function generateBotIntents({
  isPrivileged,
  isPremium,
}: {
  isPrivileged: boolean;
  isPremium: boolean;
}) {
  const intents = new IntentsBitField();

  intents.add("Guilds");
  intents.add("GuildEmojisAndStickers");

  intents.add("GuildMessages");

  intents.add("GuildModeration");

  if (isPrivileged && isPremium) {
    intents.add("GuildMembers");
    intents.add("GuildPresences");
  }

  if (isPremium) {
    intents.add("GuildVoiceStates");
  }

  return intents;
}

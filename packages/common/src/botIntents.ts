import { IntentsBitField } from "discord.js";

export function generateBotIntents(isPrivileged: boolean) {
  const intents = new IntentsBitField();

  intents.add("Guilds");
  intents.add("GuildEmojisAndStickers");

  intents.add("GuildMessages");

  // TODO check how cache works
  intents.add("GuildModeration");

  if (isPrivileged) {
    intents.add("GuildMembers");
    intents.add("GuildPresences");
  }

  intents.add("GuildVoiceStates");

  return intents;
}

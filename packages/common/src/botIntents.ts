import { IntentsBitField } from "discord.js";

export function generateBotIntents(isPremium: boolean, isPrivileged: boolean) {
  const intents = new IntentsBitField();

  intents.add("Guilds");

  // TODO check how cache works
  intents.add("GuildModeration");

  if (isPremium && isPrivileged) {
    intents.add("GuildMembers");
    intents.add("GuildPresences");
  }

  if (isPremium) {
    intents.add("GuildVoiceStates");
  }

  return intents;
}

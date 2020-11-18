import Bot from "../client";

// TODO
setInterval(() => {
  const { client } = Bot;
  if (FOSS_MODE || PREMIUM_BOT) return;
  const botUser = client.users.get(client.user.id);
  client.users.clear();
  client.users.add(botUser);

  client.guilds.forEach((guild) => {
    const botMember = guild.members.get(client.user.id);
    guild.members.clear();
    guild.members.add(botMember);
  });
}, 30 * 1000);
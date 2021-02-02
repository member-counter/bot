import Eris from "eris";
const cache = new Map<string, any>();
const emojis = (guilds: Eris.Collection<Eris.Guild>) => {
  const emojiGuild = guilds.get(process.env.DISCORD_OFFICIAL_SERVER_ID);

  const getEmoji = (name: string) => {
    if (cache.has(name)) {
      return cache.get(name);
    } else {
      const emoji = emojiGuild.emojis.find((e) => e.name === name);
      if (emoji) {
        cache.set(name, {
          ...emoji,
          string: emoji.animated
            ? "<a:" + emoji.name + ":" + emoji.id + ">"
            : "<:" + emoji.name + ":" + emoji.id + ">",
        });
        return {
          ...emoji,
          string: emoji.animated
            ? "<a:" + emoji.name + ":" + emoji.id + ">"
            : "<:" + emoji.name + ":" + emoji.id + ">",
        };
      } else {
        return null;
      }
    }
  };

  return {
    firstPage: getEmoji("firstpage"),
    previousPage: getEmoji("previouspage"),
    nextPage: getEmoji("nextpage"),
    lastPage: getEmoji("lastpage"),
    jumpPage: getEmoji("jumppage"),
    loading: getEmoji("loading"),
    bin: getEmoji("bin"),
    check: getEmoji("Check"),
    cross_mark: getEmoji("cross_mark"),
    queue_repeat: getEmoji("queue_repeat"),
    track_repeat: getEmoji("track_repeat"),
    eraser: getEmoji("eraser"),
    backArrow: getEmoji("backarrow"),
    upArrow: getEmoji("uparrow"),
    downArrow: getEmoji("downarrow"),
    stop: getEmoji("stop"),
    note: getEmoji("note"),
    404: getEmoji("404"),
    warning: getEmoji("warning"),
    rock: getEmoji("rock"),
    paper: getEmoji("paper"),
    scissors: getEmoji("scissors"),
    typescript: getEmoji("typescript"),
    incoming: getEmoji("incoming"),
    outgoing: getEmoji("outgoing"),
  };
};
export default emojis;

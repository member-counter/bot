import Eris from 'eris';

const channelUpdate = (channel: Eris.AnyChannel) => {
  // TODO
  // const { guild, name, topic } = channel;
  // if (guild) {
  //     fetchGuildSettings(guild.id)
  //         .then(guildSettings => {
  //             const { channelNameCounters } = guildSettings;
  //             const channelNameCounterToUpdate = channelNameCounters.get(channel.id);
  //             if (channelNameCounterToUpdate && /\{count\}/gi.test(name)) {
  //                 channelNameCounters.set(channel.id, {
  //                     ...channelNameCounterToUpdate,
  //                     channelName: name
  //                 })
  //             }
  //             guildSettings.save()
  //                 .then(() => updateCounter({ client, guildSettings }))
  //                 .catch(console.error)
  //         })
  //         .catch(console.error);
  // }
};

export default channelUpdate;

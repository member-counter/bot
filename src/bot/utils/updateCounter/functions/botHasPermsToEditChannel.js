/**
 * Checks if the bot is able to edit the given channel
 * @param {Client} Client
 * @param {GuildChannel} channel
 */
module.exports = (client, channel) => {
    const botPermissionsInThisChannel = channel.permissionsOf(client.user.id);

    return (
        botPermissionsInThisChannel.has('manageChannels')
        && ((channel.type === 0 || channel.type === 4 || channel.type === 5 ) ? botPermissionsInThisChannel.has('readMessages') : true)
        && ((channel.type === 2) ? (botPermissionsInThisChannel.has('voiceConnect')) : true)
    )
}
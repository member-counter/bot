const updateCounter = require("../utils/updateCounter");

module.exports = (client, member, oldMember) => {

    if (!(oldMember && member)) return;

    const { guild } = member;
    let newStatus = member.status;
    let oldStatus = oldMember.status;

    //convert dnd/idle to online
    if (oldStatus !== "offline") oldStatus = "online";
    if (newStatus !== "offline") newStatus = "online";

    if (oldStatus !== newStatus) updateCounter({client, guildSettings: guild.id});
}
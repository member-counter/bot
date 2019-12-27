const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("presenceUpdate", (oldMember, newMember) => {
        const { guild } = newMember;
        let newStatus = newMember.presence.status;
        let oldStatus = oldMember.presence.status;

        //convert dnd/idle to online
        if (oldStatus !== "offline") oldStatus = "online";
        if (newStatus !== "offline") newStatus = "online";

        if (oldStatus !== newStatus) updateCounter(client, guild.id);
    });
};

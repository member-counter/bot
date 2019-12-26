const fetchGuildSettings = require("../utils/fetchGuildSettings");
const updateCounter = require("../utils/updateCounter");

const TIME_BETWEEN_EVERY_UPDATE = parseInt(process.env.TIME_BETWEEN_USER_STATUS_UPDATE) * 1000;
const GuildsToUpdate = new Map();

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

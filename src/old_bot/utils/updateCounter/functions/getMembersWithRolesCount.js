const PREMIUM_BOT = JSON.parse(process.env.PREMIUM_BOT);

module.exports = (guild, targetRoles) => {
    if (PREMIUM_BOT) {
        const count = new Map();

        guild.members.forEach((member) => {
            targetRoles.forEach((targetRole) => {
                if (member.roles.includes(targetRole)) count.set(member.id);
            })
        });
        return count.size
    } else {
        return 'Only Premium';
    }
}
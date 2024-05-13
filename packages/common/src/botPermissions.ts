import { PermissionsBitField } from "discord.js";

export const botPermissions = new PermissionsBitField();

// TODO check needed permissions

// Used to update the name/description of the channels to update the counters
botPermissions.add("ViewChannel");
botPermissions.add("ManageChannels");
botPermissions.add("Connect");

// Used to update counters in messages/embeds
botPermissions.add("SendMessages");
botPermissions.add("ReadMessageHistory");
botPermissions.add("EmbedLinks");

// Used by the setup command and to update channel permissions when you add a Premium bot
botPermissions.add("ManageRoles");

// Used to display the amount of banned members in the banned members counter
botPermissions.add("BanMembers");

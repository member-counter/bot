import { PermissionFlagsBits } from "discord-api-types/v10";

import { BitField } from "../BitField";

export const botPermissions = new BitField(0n);

// Used to update the name/description of the channels to update the counters
botPermissions.add(PermissionFlagsBits.ViewChannel);
botPermissions.add(PermissionFlagsBits.ManageChannels);
botPermissions.add(PermissionFlagsBits.Connect);

// Used to update counters in messages/embeds
botPermissions.add(PermissionFlagsBits.SendMessages);
botPermissions.add(PermissionFlagsBits.ReadMessageHistory);
botPermissions.add(PermissionFlagsBits.EmbedLinks);

// Used by the setup command
botPermissions.add(PermissionFlagsBits.ManageRoles);

// Used to display the amount of banned members in the banned members counter
botPermissions.add(PermissionFlagsBits.BanMembers);

import { Message, GuildTextableChannel } from "eris";
import { ErisClient } from "../bot";
import LanguagePack from "./LanguagePack";
import GuildService from "../services/GuildService";

interface ctx {
	client: ErisClient;
	message: Message;
	languagePack: LanguagePack;
	guildService?: GuildService;
}
interface guildCtx extends Omit<ctx, "message"> {
	message: Message<GuildTextableChannel>;
	guildService: GuildService;
}

interface anyChannelCommand {
	aliases: string[];
	denyDm: false;
	run: (ctx: ctx) => void | Promise<void>;
}
interface guildChannelCommand extends Omit<anyChannelCommand, "denyDm"> {
	denyDm: true;
	onlyAdmin?: boolean;
	run: (guildCtx: guildCtx) => void | Promise<void>;
}

type Command = anyChannelCommand | guildChannelCommand;

export default Command;

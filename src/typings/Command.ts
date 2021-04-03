import { Message, GuildTextableChannel } from "eris";
import { ErisClient } from "../bot";
import LanguagePack from "./LanguagePack";
import GuildService from "../services/GuildService";

interface ctx {
	client: ErisClient;
	message: Message;
	languagePack: LanguagePack;
}
interface guildCtx extends Omit<ctx, "message"> {
	message: Message<GuildTextableChannel>;
	guildService: GuildService;
}

interface AnyChannelCommand {
	aliases: string[];
	denyDm: false;
	run: (ctx: ctx) => void | Promise<void>;
}
interface GuildChannelCommand extends Omit<AnyChannelCommand, "denyDm"> {
	denyDm: true;
	onlyAdmin?: boolean;
	run: (guildCtx: guildCtx) => void | Promise<void>;
}

type Command = AnyChannelCommand | GuildChannelCommand;

export default Command;
export { Command, AnyChannelCommand, GuildChannelCommand };

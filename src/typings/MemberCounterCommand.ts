import { Message } from "eris";
import { ErisClient } from "../bot";
import LanguagePack from "./LanguagePack";

interface runArgs {
	client: ErisClient;
	message: Message;
	languagePack: LanguagePack;
}

interface runFunction {
	({ message, languagePack }: runArgs): Promise<void>;
}

interface MemberCounterCommand {
	aliases: string[];
	denyDm: boolean;
	onlyAdmin: boolean;
	run: runFunction;
}

export default MemberCounterCommand;

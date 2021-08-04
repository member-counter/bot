import Command from "../typings/Command";

// Commands
import statusCommands from "./status";
import patpatCommands from "./patpat";
import userCommands from "./user";
import infoCommands from "./info";
import helpCommands from "./help";
import settingsCommands from "./settings";
import countCommands from "./counts";
import utilCommands from "./utils";
import guideCommand from "./guide";
import setupCommand from "./setup";
import premiumCommands from "./premium";

const commands: Array<Command> = [
	...userCommands,
	...statusCommands,
	...patpatCommands,
	...infoCommands,
	...helpCommands,
	...settingsCommands,
	...countCommands,
	...utilCommands,
	...guideCommand,
	...setupCommand,
	...premiumCommands
];

export default commands;

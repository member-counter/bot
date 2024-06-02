import { Client } from "discord.js";

interface runArgs {
	client: Client;
}

interface runFunction {
	({ client }: runArgs): Promise<void>;
}

interface Job {
	locked?: boolean;
	time: string;
	runAtStartup: boolean;
	runInOnlyFirstThread: boolean;
	run: runFunction;
}

export default Job;

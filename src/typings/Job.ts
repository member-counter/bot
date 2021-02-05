import { ErisClient } from "../bot";

interface runArgs {
	client: ErisClient;
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

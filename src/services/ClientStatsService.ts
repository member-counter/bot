import ClientStatsModel, {
	CommandUsage,
	CommandUsageStatsByDate,
	ClientStatsDocument
} from "../models/ClientStats";

class ClientStatsService {
	private constructor(
		public command: string,
		private doc: ClientStatsDocument
	) {}

	public static async init(id: string): Promise<ClientStatsService> {
		const doc = await ClientStatsModel.findOneAndUpdate(
			{ id: id },
			{},
			{ new: true, upsert: true }
		);
		return new ClientStatsService(id, doc);
	}

	public get commandsRun(): number {
		return this.doc.commandsRun;
	}
	public async incrementCommandsRun(): Promise<number> {
		this.doc.commandsRun++;
		await this.doc.save();
		return this.doc.commandsRun;
	}
	public get commandUsageStats(): Map<string, CommandUsage> {
		return this.doc.commandUsageStats;
	}

	public async setCommandStats(
		command: string,
		usage: CommandUsage
	): Promise<CommandUsage> {
		this.doc.commandUsageStats.set(command, usage);
		await this.doc.save();
		return this.doc.commandUsageStats.get(command);
	}
	public get commandUsageStatsByDate(): Map<string, CommandUsageStatsByDate> {
		return this.doc.commandUsageStatsByDate;
	}
	public async setCommandUsageByDate(
		date: string,
		usage: CommandUsageStatsByDate
	): Promise<CommandUsageStatsByDate> {
		this.doc.commandUsageStatsByDate.set(date, usage);
		await this.doc.save();
		return this.doc.commandUsageStatsByDate.get(date);
	}
	public async remove(): Promise<void> {
		await this.doc.remove();
	}
}

export default ClientStatsService;

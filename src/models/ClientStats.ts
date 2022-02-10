import { Map } from "mongodb";
import { model, Schema, Document } from "mongoose";
interface CommandUsageStats {
	engagedUsers: Array<string>;
	uses: Map<string, number>;
}
export interface CommandUsage {
	hourlyUsage: number;
	hourlyUsageDate: Date;
	dailyUsage: number;
	dailyUsageDate: Date;
	weeklyUsage: number;
	weeklyUsageDate: Date;
	monthlyUsage: number;
	monthlyUsageDate: Date;
	totalUsage: number;
	stats: Map<string, CommandUsageStats>;
}
export interface CommandUsageStatsByDate {
	engagedUsers: Array<string>;
	uses: number;
}
interface ClientStatsDocument extends Document {
	id: string;
	commandsRun: number;
	commandUsageStats: Map<string, CommandUsage>;
	commandUsageStatsByDate: Map<string, CommandUsageStatsByDate>;
}

const ClientStatsSchema = new Schema({
	id: { type: String, require: true },
	commandsRun: { type: Number, default: 0 },
	commandUsageStats: {
		type: Map,
		of: new Schema({
			hourlyUsage: { type: Number, require: true, default: 0 },
			hourlyUsageDate: { type: Date, require: true, default: new Date() },
			dailyUsage: { type: Number, require: true, default: 0 },
			dailyUsageDate: { type: Date, require: true, default: new Date() },
			weeklyUsage: { type: Number, require: true, default: 0 },
			weeklyUsageDate: { type: Date, require: true, default: new Date() },
			monthlyUsage: { type: Number, require: true, default: 0 },
			monthlyUsageDate: { type: Date, require: true, default: new Date() },
			totalUsage: { type: Number, require: true, default: 0 },
			stats: {
				type: Map,
				of: new Schema({
					engagedUsers: {
						type: Array,
						of: String,
						default: [],
						require: false
					},
					uses: { type: Map, of: Number, require: false }
				}),
				default: new Map<string, CommandUsageStats>()
			}
		}),
		default: new Map<string, CommandUsage>(),
		require: false
	},
	commandUsageStatsByDate: {
		type: Map,
		of: new Schema({
			engagedUsers: { type: Array, default: [] },
			uses: { type: Number, default: 0 }
		}),
		default: new Map<string, CommandUsageStatsByDate>()
	}
});

const ClientStatsModel = model<ClientStatsDocument>(
	"clientStats",
	ClientStatsSchema
);

export { ClientStatsModel, ClientStatsDocument };
export default ClientStatsModel;

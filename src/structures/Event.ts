import {
	PermissionsBitField,
	IntentsBitField,
	ClientEvents,
	PermissionResolvable,
	BitFieldResolvable,
	GatewayIntentsString
} from "discord.js";

interface EventOptions<E extends keyof ClientEvents> {
	name: E;
	handler: (...args: ClientEvents[E]) => void | Promise<void>;
	neededIntents?: BitFieldResolvable<GatewayIntentsString, number>[];
	neededPermissions?: PermissionResolvable[];
}

export class Event<E extends keyof ClientEvents> {
	name: E;
	handler: (...args: ClientEvents[E]) => void | Promise<void>;
	neededPermissions: PermissionsBitField;
	neededIntents: IntentsBitField;

	constructor(options: EventOptions<E>) {
		this.name = options.name;
		this.handler = options.handler;

		const neededPermissions = new PermissionsBitField(
			options.neededPermissions
		);

		this.neededIntents = new IntentsBitField(options.neededIntents);
		this.neededPermissions = neededPermissions;
	}
}

export default Event;

import {
	PermissionsBitField,
	IntentsBitField,
	GatewayIntentsString,
	GatewayDispatchEvents,
	ClientEvents,
	PermissionResolvable
} from "discord.js";
import { IntentsEventMap } from "../Constants";

interface EventOptions<E extends keyof ClientEvents> {
	name: E;
	handler: (...args: ClientEvents[E]) => void | Promise<void>;
	neededPermissions?: PermissionResolvable[];
	extraIntents?: IntentsBitField;
}

export class Event<E extends keyof ClientEvents> {
	name: E;
	handler: (...args: ClientEvents[E]) => void | Promise<void>;
	neededPermissions: PermissionsBitField;
	private extraIntents: IntentsBitField;

	constructor(options: EventOptions<E>) {
		this.name = options.name;
		this.handler = options.handler;

		const neededPermissions = new PermissionsBitField();
		(options.neededPermissions ?? []).forEach((permission) => {
			neededPermissions.add(permission);
		});
		this.neededPermissions = neededPermissions;

		this.extraIntents = new IntentsBitField(options.extraIntents);
	}

	get neededIntents(): IntentsBitField {
		const neededIntents = new IntentsBitField();
		for (const [intent, events] of Object.entries(IntentsEventMap) as [
			GatewayIntentsString,
			GatewayDispatchEvents[]
		][]) {
			for (const event of events) {
				if (this.name.includes(GatewayDispatchEvents[event])) {
					neededIntents.add(intent);
					break;
				}
			}
		}

		neededIntents.add(this.extraIntents);
		return neededIntents;
	}
}

export default Event;

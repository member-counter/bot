import http from 'http';
import Eris from 'eris';
import mongoose, { Mongoose } from 'mongoose';
import getEnv from '../utils/getEnv';
import path from 'path';
import { createReadStream } from 'fs';
import express from 'express';
import WebSocket from 'ws';

const { PORT, DISCORD_CLIENT_ID } = getEnv();

function startstatusWS(discordClient: Eris.Client) {
	const app = express();

	app.get('/', (req, res) => {
		res.setHeader('Content-Type', 'text/html');
		createReadStream(path.resolve(__dirname, './status.html')).pipe(res);
	});

	app.get('/invite-link', (req, res) => {
		res.send(
			`https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&scope=bot&permissions=8`,
		);
	});

	const server = http.createServer(app).listen(PORT || 8080, () => {
		console.log(
			`Basic status website ready (try visiting http://127.0.0.1:${PORT} ?)`,
		);
	});

	const wss = new WebSocket.Server({ path: '/ws', server });
	wss.on('connection', (client) => client.send(generatePayload()));

	setInterval(() => {
		const payload = generatePayload();
		wss.clients.forEach((client) => client.send(payload));
	}, 5000);

	function generatePayload() {
		let discordShards = new Map<number, any>();
		let dbStatus: string;

		switch (mongoose.connection.readyState) {
			case mongoose.connection.states.uninitialized:
				dbStatus = 'uninitialized';
				break;

			case mongoose.connection.states.connecting:
				dbStatus = 'connecting';
				break;

			case mongoose.connection.states.connected:
				dbStatus = 'connected';
				break;

			case mongoose.connection.states.disconnecting:
				dbStatus = 'disconnecting';
				break;

			case mongoose.connection.states.disconnected:
				dbStatus = 'disconnected';
				break;

			default:
				break;
		}

		discordClient.shards.forEach((shard) => {
			discordShards.set(shard.id, {
				status: shard.status,
				availableGuilds: [],
				unavailableGuilds: [],
			});
		});

		discordClient.guilds.forEach((guild) => {
			if (guild.shard) {
				const shard = discordShards.get(guild.shard.id);
				shard.availableGuilds.push(guild.id);
			}
		});

		discordClient.unavailableGuilds.forEach((guild) => {
			if (guild.shard) {
				const shard = discordShards.get(guild.shard.id);
				shard.unavailableGuilds.push(guild.id);
			}
		});

		return JSON.stringify({
			db: dbStatus,
			discord: Array.from(discordShards),
		});
	}
}

export default startstatusWS;

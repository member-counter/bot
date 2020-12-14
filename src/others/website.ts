import http from 'http';
import mongoose, { Mongoose } from 'mongoose';
import getEnv from '../utils/getEnv';
import path from 'path';
import { createReadStream } from 'fs';
import Bot from '../bot';
import getBotInviteLink from '../utils/getBotInviteLink';

const { PORT, DISCORD_CLIENT_ID } = getEnv();

class Website {
	static init() {
		http
			.createServer((req, res) => {
				res.writeHead(302, {
					'Location': getBotInviteLink()
				});
				res.end();
			})
			.listen(PORT || 8080);
	}
}

export default Website;

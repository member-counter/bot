import http from "http";
import getEnv from "../utils/getEnv";
import getBotInviteLink from "../utils/getBotInviteLink";

const { PORT } = getEnv();

class Website {
	static init() {
		http
			.createServer((req, res) => {
				res.writeHead(302, {
					Location: getBotInviteLink()
				});
				res.end();
			})
			.listen(PORT || 8080);
	}
}

export default Website;

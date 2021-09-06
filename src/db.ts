import mongoose from "mongoose";
import getEnv from "./utils/getEnv";

const { DB_URI } = getEnv();

class DatabaseClient {
	static init() {
		// Mongoose connection
		mongoose
			.connect(DB_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
				reconnectTries: Infinity,
			})
			.then(() => {
				console.log("Database connection ready");
			})
			.catch(console.error);
	}
}

export default DatabaseClient;

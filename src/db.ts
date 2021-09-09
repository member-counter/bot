import mongoose from "mongoose";
import getEnv from "./utils/getEnv";

const { DB_URI } = getEnv();

class DatabaseClient {
	static init() {
		// Mongoose connection
		mongoose
			.connect(DB_URI)
			.then(() => {
				console.log("Database connection ready");
			})
			.catch(console.error);
	}
}

export default DatabaseClient;

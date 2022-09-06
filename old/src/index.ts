#!/usr/bin/env node
import getEnv from "./utils/getEnv";
import Bot from "./bot";
import DatabaseClient from "./db";
import mongoose from "mongoose";
import Website from "./others/website";
import checkConfig from "./others/checkConfig";
const { NODE_ENV } = getEnv();

checkConfig();
DatabaseClient.init();
Bot.init();
Website.init();

if (NODE_ENV === "production") {
	process
		.on("unhandledRejection", (reason, p) => {
			console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
		})
		.on("uncaughtException", (exception) => {
			console.error("Uncaught Exception ", exception);
		})
		.on("SIGTERM", async () => {
			Bot.client.editStatus("dnd", { type: 0, name: "going offline" });
			Bot.client.disconnect({ reconnect: false });
			await mongoose.disconnect();
			process.exit(0);
		});
}

#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const JsonToTS = require("json-to-ts");
const languagePack = require("../src/lang/en_US.json");

const file = fs.createWriteStream(
	path.join(__dirname, "..", "src", "typings", "LanguagePack.ts")
);

const header = `export default LanguagePack;

// This file has been auto-generated with json-to-ts (https://www.npmjs.com/package/json-to-ts)
// It is auto-generated when you create a commit, or by running manually 'npm run generateLPTypings'

`;

file.on("open", () => {
	file.write(header);
	JsonToTS(languagePack, { rootName: "LanguagePack" }).forEach((interface) =>
		file.write(interface + "\n")
	);
});

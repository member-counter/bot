/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const nodeExternals = require("webpack-node-externals");
module.exports = {
	target: "node",
	mode: "development",
	entry: "./src/index.ts",
	externals: [nodeExternals()],
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules|\.d\.ts$/,
				use: ["ts-loader"]
			},
			{
				test: /\.d\.ts$/,
				loader: "ignore-loader"
			}
		]
	},
	resolve: {
		modules: [__dirname, path.resolve(__dirname, "src"), "node_modules"],
		extensions: [".ts", ".js"]
	},
	output: {
		path: __dirname + "/dist",
		filename: "[name].js",
		publicPath: __dirname + "/dist"
	},
	devServer: {
		static: __dirname
	},
	devtool: "source-map"
};

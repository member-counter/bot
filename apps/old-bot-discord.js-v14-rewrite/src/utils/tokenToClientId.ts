export function tokenToClientId(token: string): string {
	return Buffer.from(token.split(".")[0], "base64").toString("utf-8");
}

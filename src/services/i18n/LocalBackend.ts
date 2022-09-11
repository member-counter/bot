import { availableLocales } from ".";

export const LocalBackend: {
	cache: {
		[K in typeof availableLocales[number]]?: typeof import("../../locales/en-US.json");
	};
	type: "backend";
	read: (
		language: typeof availableLocales[number],
		namespace: any,
		callback: any
	) => Promise<void>;
} = {
	cache: {},
	type: "backend",
	read: async function (
		language: typeof availableLocales[number],
		namespace,
		callback
	) {
		callback(
			null,
			(LocalBackend.cache[language] ??= await import(
				`../../locales/${language}`
			))
		);
	}
};

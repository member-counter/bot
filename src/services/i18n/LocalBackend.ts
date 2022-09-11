import { availableLocales } from ".";

export const LocalBackend: {
	cache: {
		"ca-ES"?: typeof import("../../locales/ca-ES.json");
		"cs-CZ"?: typeof import("../../locales/cs-CZ.json");
		"de-DE"?: typeof import("../../locales/de-DE.json");
		"en-US"?: typeof import("../../locales/en-US.json");
		"es-ES"?: typeof import("../../locales/es-ES.json");
		"fa-IR"?: typeof import("../../locales/fa-IR.json");
		"fr-FR"?: typeof import("../../locales/fr-FR.json");
		"he-IL"?: typeof import("../../locales/he-IL.json");
		"hi-IN"?: typeof import("../../locales/hi-IN.json");
		"it-IT"?: typeof import("../../locales/it-IT.json");
		"pl-PL"?: typeof import("../../locales/pl-PL.json");
		"pt-BR"?: typeof import("../../locales/pt-BR.json");
		"ru-RU"?: typeof import("../../locales/ru-RU.json");
		"tr-TR"?: typeof import("../../locales/tr-TR.json");
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

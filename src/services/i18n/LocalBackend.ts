export const LocalBackend = {
	cache: {},
	type: "backend",
	read: async function (language, namespace, callback) {
		callback(
			null,
			(LocalBackend.cache[language] ??= await import(
				`../../locales/${language}`
			))
		);
	}
};

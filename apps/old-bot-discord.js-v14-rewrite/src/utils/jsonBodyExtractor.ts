const propExp =
	/^(?<propName>[^.[]+)|\["(?<propNameDoubleQuotes>.+)"\]|\['(?<propNameSingleQuotes>.+)'\]|^\[(?<indexSelector>\d)\]/;
const allowedReturnTypes = ["number", "string"];

function jsonBodyExtractor(body: any, path: string) {
	let cwo = body;
	let pathLeft = path;
	let pathTraveled = "";

	let iterationsLeft = 50;
	while (iterationsLeft) {
		if (!--iterationsLeft) throw new Error("Path length exceeded");

		const { groups: matchGroups } = pathLeft.match(propExp) ?? { groups: {} };

		let matched;
		if (matchGroups?.propName) {
			// if .foo
			matched = matchGroups.propName;
			pathLeft = pathLeft.slice(matched.length);

			if (!Object.prototype.hasOwnProperty.call(cwo, matched))
				throw new Error(
					`"${matched}" doesn't exists in ${
						pathTraveled ? pathTraveled : "the response"
					}`
				);

			pathTraveled += (pathTraveled ? "." : "") + `${matched}`;
		} else if (
			matchGroups?.propNameDoubleQuotes ??
			matchGroups?.propNameSingleQuotes
		) {
			// if ["foo"] or ['foo']
			matched =
				matchGroups.propNameDoubleQuotes ?? matchGroups.propNameSingleQuotes;
			pathLeft = pathLeft.slice(matched.length + 4);

			if (!Object.prototype.hasOwnProperty.call(cwo, matched))
				throw new Error(
					`"${matched}" doesn't exists in ${
						pathTraveled ? pathTraveled : "the response"
					}`
				);

			pathTraveled += `["${matched}"]`;
		} else if (matchGroups?.indexSelector) {
			// if [bar]
			matched = matchGroups.indexSelector;
			pathLeft = pathLeft.slice(matched.length + 2);
			if (isNaN(Number(matched)))
				throw new Error(
					`"${matched}" is not a number! Did you want to use ["${matched}"] instead of [${matched}]?`
				);

			if (!Object.prototype.hasOwnProperty.call(cwo, matched))
				throw new Error(
					`"${matched}" doesn't exists in ${
						pathTraveled ? pathTraveled : "the response"
					}`
				);

			pathTraveled += `[${matched}]`;
		} else {
			break;
		}

		cwo = cwo[matched];

		if (pathLeft.startsWith(".")) pathLeft = pathLeft.slice(1);
	}

	if (allowedReturnTypes.includes(typeof cwo)) {
		return cwo;
	} else {
		throw new Error(
			`Only ${allowedReturnTypes.join(
				", "
			)} values can be returned, but got ${typeof cwo}`
		);
	}
}

export default jsonBodyExtractor;

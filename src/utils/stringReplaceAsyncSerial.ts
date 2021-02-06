async function stringReplaceAsyncSerial(
	str: string,
	regex: RegExp | string,
	asyncFn: Function
): Promise<string> {
	const pendingToBeRun = [];

	//@ts-ignore
	str.replace(regex, (match, ...args) => {
		pendingToBeRun.push([match, args]);
	});

	const data = [];

	for (const [match, args] of pendingToBeRun) {
		data.push(await asyncFn(match, ...args));
	}

	return str.replace(regex, () => data.shift());
}

export default stringReplaceAsyncSerial;

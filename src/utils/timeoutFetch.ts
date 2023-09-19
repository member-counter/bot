import { Response } from "node-fetch";

// https://github.com/github/fetch/issues/175#issuecomment-216791333
function timeoutFetch(
	ms: number,
	request: Promise<Response>,
	controller?: AbortController
): Promise<Response> {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			if (controller) controller.abort();
			reject(new Error("Fetch timeout"));
		}, ms);
		request.then(
			(res) => {
				clearTimeout(timeoutId);
				resolve(res);
			},
			(err) => {
				clearTimeout(timeoutId);
				reject(err);
			}
		);
	});
}

export default timeoutFetch;

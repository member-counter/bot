import query from 'samp-query';

export default (resource: string): Promise<number> =>
	new Promise((resolve, reject) => {
		let [host, port] = resource.split(':');
		query({ host, port: parseInt(port, 10) }, function (error, response) {
			if (error) reject(error);
			resolve(response?.online);
		});
	});

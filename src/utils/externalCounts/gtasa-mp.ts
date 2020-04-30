import query from 'samp-query';

export default (resource: string): Promise<number> => {
  let [host, port] = resource.split(':');

  return new Promise((resolve) => {
    query({ host, port: parseInt(port) }, function (error, response) {
      if (error) return resolve(-2);
      resolve(response.online);
    });
  });
};

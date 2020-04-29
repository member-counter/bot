import query from 'mta-query';

export default (resource: string): Promise<number> =>
  new Promise((resolve) => {
    query({ host: resource }, function (error, response) {
      if (error) return resolve(-2);
      resolve(response.online);
    });
  });

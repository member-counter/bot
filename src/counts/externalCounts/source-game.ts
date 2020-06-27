//@ts-ignore
import query from 'source-server-query';

export default async (resource: string): Promise<number> => {
  let count = 0;
  let [host, port] = resource.split(':');

  const response = await query.info(host, parseInt(port, 10), 2000);

  if (response.constructor.name === 'Error') {
    throw response;
  } else {
    count = Number(response?.playersnum);
  }

  return count;
};

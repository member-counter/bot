//@ts-ignore
import query from 'source-server-query';

export default async (resource: string): Promise<number> => {
  let count = 0;
  let [host, port] = resource.split(':');

  const response = await query.info(host, parseInt(port, 10), 2000);

  if (response.constructor.name === 'Error') {
    count = -2;
  } else {
    count = response.playersnum;
  }

  return count;
};

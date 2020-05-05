async function stringReplaceAsync(
  str: string,
  regex: RegExp | string,
  asyncFn: Function,
) {
  const promises = [];
  //@ts-ignore
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });

  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

export default stringReplaceAsync;

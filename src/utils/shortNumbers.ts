function short(n: number, decimals: number = 1): number {
  return Math.trunc(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function shortNumber(n: number, decimals: number = 1): string {
  let result: string;

  if (n >= 1000000000000) {
    n = n / 1000000000000;
    n = short(n, decimals);
    result = `${n}T`;
  } else if (n >= 1000000000) {
    n = n / 1000000000;
    n = short(n, decimals);
    result = `${n}B`;
  } else if (n >= 1000000) {
    n = n / 1000000;
    n = short(n, decimals);
    result = `${n}M`;
  } else if (n >= 1000) {
    n = n / 1000;
    n = short(n, decimals);
    result = `${n}K`;
  } else {
    result = n.toString();
  }
  return result;
}

export default shortNumber;

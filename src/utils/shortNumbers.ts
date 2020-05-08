function short(n: number): number {
  return Math.trunc(n * Math.pow(10, 2)) / Math.pow(10, 2);
}

function shortNumber(n: number): string {
  let result: string;

  if (n >= 1000000000) {
    n = n / 1000000000;
    n = short(n);
    result = `${n}B`;
  } else if (n >= 1000000) {
    n = n / 1000000;
    n = short(n);
    result = `${n}M`;
  } else if (n >= 1000) {
    n = n / 1000;
    n = short(n);
    result = `${n}K`;
  } else {
    result = n.toString();
  }
  return result;
}

export default shortNumber;

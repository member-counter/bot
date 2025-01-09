import assert from "assert";

export class CurrencyUtils {
  /**
   * Converts a string (e.g., "10.44") or BigInt to a Number.
   * @param {string | bigint} value - The monetary value as a string or BigInt.
   * @param {number} decimals - Currency decimals.
   * @returns {number} - The monetary value as a Number.
   */
  static toNumber(value: string | bigint, decimals = 2): number {
    if (typeof value === "string") {
      return parseFloat(value);
    }
    if (typeof value === "bigint") {
      return Number(value) / Math.pow(10, decimals);
    }
    throw new TypeError("Invalid type for conversion to Number");
  }

  /**
   * Converts a string (e.g., "10.44") to a BigInt representing the smallest unit.
   * @param {string} value - The monetary value as a string.
   * @param {number} decimals - Currency decimals.
   * @returns {bigint} - The amount in the smallest unit as a BigInt.
   */
  static toBigInt(value: string, decimals = 2): bigint {
    const [whole, fraction = "0"] = value.split(".");
    assert(whole);
    const fractionPadded = fraction.padEnd(decimals, "0"); // Ensure required decimals
    return (
      BigInt(whole) * BigInt(Math.pow(10, decimals)) +
      BigInt(fractionPadded.slice(0, decimals))
    );
  }

  /**
   * Converts a BigInt to a string with the appropriate decimal places.
   * @param {bigint} value - The amount in the smallest unit as a BigInt.
   * @param {number} decimals - Currency decimals.
   * @returns {string} - The monetary value as a string.
   */
  static toString(value: bigint, decimals = 2): string {
    const isNegative = value < 0n;
    const absoluteValue = isNegative ? -value : value;

    const divisor = BigInt(Math.pow(10, decimals));
    const whole = absoluteValue / divisor;
    const fraction = absoluteValue % divisor;

    const result = `${whole}.${fraction.toString().padStart(decimals, "0")}`;
    return isNegative ? `-${result}` : result;
  }

  static format(
    locale: string,
    amount: bigint,
    currency: string,
    currencyDecimals: number,
  ) {
    // Convert the amount to a floating-point number with appropriate precision
    const amountInUnits = Number(amount) / Math.pow(10, currencyDecimals);

    // Handle the case where the value has many decimal places for small units (e.g., BTC, ETH)
    return Intl.NumberFormat(locale, {
      currency,
      style: "currency",
      minimumFractionDigits: Math.min(2, currencyDecimals), // Ensure minimum fraction digits
      maximumFractionDigits: currencyDecimals, // Format using the given currency decimals
    }).format(amountInUnits);
  }
}

import type { DataSource, DataSourceFormatSettings } from "./DataSource";

interface ConvertArgs {
  /**
   * @description Formatting settings for the counter
   */
  format: DataSourceFormatSettings | undefined;

  /**
   * @description The args but splitted depending on which separator has been used
   */
  args: (DataSource | string)[][];

  /**
   * @description The alias that was used
   */
  aliasUsed: string;
}

type ConvertFunction = (args: ConvertArgs) => DataSource | string;

interface ConvertCounter {
  /**
   * @description The name of the counter or counters, case insensitive, don't include the curly braces
   */
  aliases: string[];

  /**
   * @returns {number|string|object} When a number is returned, it will be processed depending on the guild settings, when a string is returned, it will be displayed directly, if it's a object, the keys (counter name) and it's values (string|number) will be added to the cache
   */
  convert: ConvertFunction;
}

export default ConvertCounter;

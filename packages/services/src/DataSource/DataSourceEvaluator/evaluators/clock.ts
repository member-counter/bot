import { DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const clockEvaluator = new DataSourceEvaluator({
  id: DataSourceId.CLOCK,
  execute({ options, format }) {
    const coeff = 1000 * 60 * 5;
    const date = new Date();
    const rounded = new Date(Math.round(date.getTime() / coeff) * coeff);

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const formatString = options.format || "%f";

    // Get default formatted time for %f placeholder
    const defaultFormatted = new Intl.DateTimeFormat(format.locale, {
      hour: "numeric",
      minute: "numeric",
      timeZone: options.timezone,
    }).format(rounded);

    // Get time parts in the specified timezone
    const timeInTimezone = new Intl.DateTimeFormat(format.locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: options.timezone,
    });

    const parts = timeInTimezone.formatToParts(rounded);
    const hour = parts.find((p) => p.type === "hour")?.value ?? "";
    const minute = parts.find((p) => p.type === "minute")?.value ?? "";
    const second = parts.find((p) => p.type === "second")?.value ?? "";

    // Get 12-hour format
    const time12 = new Intl.DateTimeFormat(format.locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: options.timezone,
    });

    const parts12 = time12.formatToParts(rounded);
    const hour12 = parts12.find((p) => p.type === "hour")?.value ?? "";
    const dayPeriod = parts12.find((p) => p.type === "dayPeriod")?.value ?? "";

    // Replace format placeholders
    const formatted = formatString
      .replace(/%f/g, defaultFormatted) // Default locale-based formatting
      .replace(/%H/g, hour) // Hour with leading zero, 24-hour format (00-23)
      .replace(/%h/g, () => String(parseInt(hour, 10))) // Hour without leading zero, 24-hour format (0-23)
      .replace(/%I/g, hour12) // Hour with leading zero, 12-hour format (01-12)
      .replace(/%i/g, () => String(parseInt(hour12, 10))) // Hour without leading zero, 12-hour format (1-12)
      .replace(/%M/g, minute) // Minute with leading zero (00-59)
      .replace(/%m/g, () => String(parseInt(minute, 10))) // Minute without leading zero (0-59)
      .replace(/%S/g, second) // Second with leading zero (00-59)
      .replace(/%s/g, () => String(parseInt(second, 10))) // Second without leading zero (0-59)
      .replace(/%p/g, dayPeriod.toLowerCase()) // am/pm
      .replace(/%P/g, dayPeriod.toUpperCase()); // AM/PM

    return formatted;
  },
});

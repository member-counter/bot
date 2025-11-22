import { DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const dateEvaluator = new DataSourceEvaluator({
  id: DataSourceId.DATE,
  execute({ options, format }) {
    const coeff = 1000 * 60 * 5;
    const date = new Date();
    const rounded = new Date(Math.round(date.getTime() / coeff) * coeff);

    const formatString = options.format ?? "%f";

    // If format is %f, use default Intl formatting
    if (formatString === "%f") {
      return new Intl.DateTimeFormat(format.locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: options.timezone,
      }).format(rounded);
    }

    // Get date parts in the specified timezone
    const dateInTimezone = new Intl.DateTimeFormat(format.locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: options.timezone,
    });

    const parts = dateInTimezone.formatToParts(rounded);
    const year = parts.find((p) => p.type === "year")?.value ?? "";
    const month = parts.find((p) => p.type === "month")?.value ?? "";
    const day = parts.find((p) => p.type === "day")?.value ?? "";

    // Get month name
    const monthName = () =>
      new Intl.DateTimeFormat(format.locale, {
        month: "long",
        timeZone: options.timezone,
      }).format(rounded);

    const monthNameShort = () =>
      new Intl.DateTimeFormat(format.locale, {
        month: "short",
        timeZone: options.timezone,
      }).format(rounded);

    // Get day of week
    const weekdayName = () =>
      new Intl.DateTimeFormat(format.locale, {
        weekday: "long",
        timeZone: options.timezone,
      }).format(rounded);

    const weekdayNameShort = () =>
      new Intl.DateTimeFormat(format.locale, {
        weekday: "short",
        timeZone: options.timezone,
      }).format(rounded);

    // Get day of week number (0=Sunday, 6=Saturday)
    const dayOfWeek = () =>
      new Date(rounded.toLocaleString("en-US", { timeZone: options.timezone }))
        .getDay()
        .toString();

    // Replace format placeholders
    const formatted = formatString
      .replace(/%Y/g, year) // Full year (e.g., 2025)
      .replace(/%y/g, () => year.slice(-2)) // 2-digit year (e.g., 25)
      .replace(/%Ms/g, monthName) // Full month name (e.g., November)
      .replace(/%ms/g, monthNameShort) // Short month name (e.g., Nov)
      .replace(/%M/g, month) // Month number with leading zero (e.g., 01, 11)
      .replace(/%m/g, () => String(parseInt(month, 10))) // Month number without leading zero (e.g., 1, 11)
      .replace(/%Ws/g, weekdayName) // Full day of week name (e.g., Monday)
      .replace(/%ws/g, weekdayNameShort) // Short day of week name (e.g., Mon)
      .replace(/%w/g, dayOfWeek) // Day of week number (0=Sunday, 6=Saturday)
      .replace(/%D/g, day) // Day with leading zero (e.g., 05)
      .replace(/%d/g, () => String(parseInt(day, 10))); // Day without leading zero (e.g., 5)

    return formatted;
  },
});

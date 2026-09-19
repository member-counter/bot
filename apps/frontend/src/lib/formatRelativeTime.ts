// https://blog.webdevsimplified.com/2020-07/relative-time-format/
const timeDivisions: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

export default function formatRelativeTime(
  locale: Intl.LocalesArgument,
  date: Date,
) {
  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  });
  let duration = (date.getTime() - Date.now()) / 1000;

  for (const division of timeDivisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}

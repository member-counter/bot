import type { Searchable } from "~/app/components/AutocompleteInput";

export const timezones: Record<string, { label: string; keywords: string[] }> =
  {
    "Pacific/Pago_Pago": {
      label: "Pago Pago",
      keywords: ["-", "11:00", "Pago", "Pago", "Pacific"],
    },
    "Pacific/Honolulu": {
      label: "Hawaii Time",
      keywords: ["-", "10:00", "Hawaii", "Time", "Pacific"],
    },
    "America/Los_Angeles": {
      label: "Pacific Time",
      keywords: ["-", "08:00", "8:00", "Pacific", "Time", "America"],
    },
    "America/Tijuana": {
      label: "Pacific Time - Tijuana",
      keywords: [
        "-",
        "08:00",
        "8:00",
        "Pacific",
        "Time",
        "-",
        "Tijuana",
        "America",
      ],
    },
    "America/Denver": {
      label: "Mountain Time",
      keywords: ["-", "07:00", "7:00", "Mountain", "Time", "America"],
    },
    "America/Phoenix": {
      label: "Mountain Time - Arizona",
      keywords: [
        "-",
        "07:00",
        "7:00",
        "Mountain",
        "Time",
        "-",
        "Arizona",
        "America",
      ],
    },
    "America/Mazatlan": {
      label: "Mountain Time - Chihuahua, Mazatlan",
      keywords: [
        "-",
        "07:00",
        "7:00",
        "Mountain",
        "Time",
        "-",
        "Chihuahua,",
        "Mazatlan",
        "America",
      ],
    },
    "America/Chicago": {
      label: "Central Time",
      keywords: ["-", "06:00", "6:00", "Central", "Time", "America"],
    },
    "America/Mexico_City": {
      label: "Central Time - Mexico City",
      keywords: [
        "-",
        "06:00",
        "6:00",
        "Central",
        "Time",
        "-",
        "Mexico",
        "City",
        "America",
      ],
    },
    "America/Regina": {
      label: "Central Time - Regina",
      keywords: [
        "-",
        "06:00",
        "6:00",
        "Central",
        "Time",
        "-",
        "Regina",
        "America",
      ],
    },
    "America/Guatemala": {
      label: "Guatemala",
      keywords: ["-", "06:00", "6:00", "Guatemala", "America"],
    },
    "America/Bogota": {
      label: "Bogota",
      keywords: ["-", "05:00", "5:00", "Bogota", "America"],
    },
    "America/New_York": {
      label: "Eastern Time",
      keywords: ["-", "05:00", "5:00", "Eastern", "Time", "America"],
    },
    "America/Lima": {
      label: "Lima",
      keywords: ["-", "05:00", "5:00", "Lima", "America"],
    },
    "America/Caracas": {
      label: "Caracas",
      keywords: ["-", "04:00", "4:00", "Caracas", "America"],
    },
    "America/Halifax": {
      label: "Atlantic Time - Halifax",
      keywords: [
        "-",
        "04:00",
        "4:00",
        "Atlantic",
        "Time",
        "-",
        "Halifax",
        "America",
      ],
    },
    "America/Guyana": {
      label: "Guyana",
      keywords: ["-", "04:00", "4:00", "Guyana", "America"],
    },
    "America/La_Paz": {
      label: "La Paz",
      keywords: ["-", "04:00", "4:00", "La", "Paz", "America"],
    },
    "America/Argentina/Buenos_Aires": {
      label: "Buenos Aires",
      keywords: ["-", "03:00", "3:00", "Buenos", "Aires", "America"],
    },
    "America/Godthab": {
      label: "Godthab",
      keywords: ["-", "03:00", "3:00", "Godthab", "America"],
    },
    "America/Montevideo": {
      label: "Montevideo",
      keywords: ["-", "03:00", "3:00", "Montevideo", "America"],
    },
    "America/St_Johns": {
      label: "Newfoundland Time - St. Johns",
      keywords: [
        "-",
        "03:00",
        "3:00",
        "Newfoundland",
        "Time",
        "-",
        "St.",
        "Johns",
        "America",
      ],
    },
    "America/Santiago": {
      label: "Santiago",
      keywords: ["-", "03:00", "3:00", "Santiago", "America"],
    },
    "America/Sao_Paulo": {
      label: "Sao Paulo",
      keywords: ["-", "02:00", "2:00", "Sao", "Paulo", "America"],
    },
    "Atlantic/South_Georgia": {
      label: "South Georgia",
      keywords: ["-", "02:00", "2:00", "South", "Georgia", "Atlantic"],
    },
    "Atlantic/Azores": {
      label: "Azores",
      keywords: ["-", "01:00", "1:00", "Azores", "Atlantic"],
    },
    "Atlantic/Cape_Verde": {
      label: "Cape Verde",
      keywords: ["-", "01:00", "1:00", "Cape", "Verde", "Atlantic"],
    },
    "Africa/Casablanca": {
      label: "Casablanca",
      keywords: ["+", "00:00", "0:00", "Casablanca", "Africa"],
    },
    "Europe/Dublin": {
      label: "Dublin",
      keywords: ["+", "00:00", "0:00", "Dublin", "Europe"],
    },
    "Europe/Lisbon": {
      label: "Lisbon",
      keywords: ["+", "00:00", "0:00", "Lisbon", "Europe"],
    },
    "Europe/London": {
      label: "London",
      keywords: ["+", "00:00", "0:00", "London", "Europe"],
    },
    "Africa/Monrovia": {
      label: "Monrovia",
      keywords: ["+", "00:00", "0:00", "Monrovia", "Africa"],
    },
    "Africa/Algiers": {
      label: "Algiers",
      keywords: ["+", "01:00", "1:00", "Algiers", "Africa"],
    },
    "Europe/Amsterdam": {
      label: "Amsterdam",
      keywords: ["+", "01:00", "1:00", "Amsterdam", "Europe"],
    },
    "Europe/Berlin": {
      label: "Berlin",
      keywords: ["+", "01:00", "1:00", "Berlin", "Europe"],
    },
    "Europe/Brussels": {
      label: "Brussels",
      keywords: ["+", "01:00", "1:00", "Brussels", "Europe"],
    },
    "Europe/Budapest": {
      label: "Budapest",
      keywords: ["+", "01:00", "1:00", "Budapest", "Europe"],
    },
    "Europe/Belgrade": {
      label: "Central European Time - Belgrade",
      keywords: [
        "+",
        "01:00",
        "1:00",
        "Central",
        "European",
        "Time",
        "-",
        "Belgrade",
        "Europe",
      ],
    },
    "Europe/Prague": {
      label: "Central European Time - Prague",
      keywords: [
        "+",
        "01:00",
        "1:00",
        "Central",
        "European",
        "Time",
        "-",
        "Prague",
        "Europe",
      ],
    },
    "Europe/Copenhagen": {
      label: "Copenhagen",
      keywords: ["+", "01:00", "1:00", "Copenhagen", "Europe"],
    },
    "Europe/Madrid": {
      label: "Madrid",
      keywords: ["+", "01:00", "1:00", "Madrid", "Europe"],
    },
    "Europe/Paris": {
      label: "Paris",
      keywords: ["+", "01:00", "1:00", "Paris", "Europe"],
    },
    "Europe/Rome": {
      label: "Rome",
      keywords: ["+", "01:00", "1:00", "Rome", "Europe"],
    },
    "Europe/Stockholm": {
      label: "Stockholm",
      keywords: ["+", "01:00", "1:00", "Stockholm", "Europe"],
    },
    "Europe/Vienna": {
      label: "Vienna",
      keywords: ["+", "01:00", "1:00", "Vienna", "Europe"],
    },
    "Europe/Warsaw": {
      label: "Warsaw",
      keywords: ["+", "01:00", "1:00", "Warsaw", "Europe"],
    },
    "Europe/Athens": {
      label: "Athens",
      keywords: ["+", "02:00", "2:00", "Athens", "Europe"],
    },
    "Europe/Bucharest": {
      label: "Bucharest",
      keywords: ["+", "02:00", "2:00", "Bucharest", "Europe"],
    },
    "Africa/Cairo": {
      label: "Cairo",
      keywords: ["+", "02:00", "2:00", "Cairo", "Africa"],
    },
    "Asia/Jerusalem": {
      label: "Jerusalem",
      keywords: ["+", "02:00", "2:00", "Jerusalem", "Asia"],
    },
    "Africa/Johannesburg": {
      label: "Johannesburg",
      keywords: ["+", "02:00", "2:00", "Johannesburg", "Africa"],
    },
    "Europe/Helsinki": {
      label: "Helsinki",
      keywords: ["+", "02:00", "2:00", "Helsinki", "Europe"],
    },
    "Europe/Kiev": {
      label: "Kiev",
      keywords: ["+", "02:00", "2:00", "Kiev", "Europe"],
    },
    "Europe/Kaliningrad": {
      label: "Moscow-01 - Kaliningrad",
      keywords: [
        "+",
        "02:00",
        "2:00",
        "Moscow-01",
        "-",
        "Kaliningrad",
        "Europe",
      ],
    },
    "Europe/Riga": {
      label: "Riga",
      keywords: ["+", "02:00", "2:00", "Riga", "Europe"],
    },
    "Europe/Sofia": {
      label: "Sofia",
      keywords: ["+", "02:00", "2:00", "Sofia", "Europe"],
    },
    "Europe/Tallinn": {
      label: "Tallinn",
      keywords: ["+", "02:00", "2:00", "Tallinn", "Europe"],
    },
    "Europe/Vilnius": {
      label: "Vilnius",
      keywords: ["+", "02:00", "2:00", "Vilnius", "Europe"],
    },
    "Europe/Istanbul": {
      label: "Istanbul",
      keywords: ["+", "03:00", "3:00", "Istanbul", "Europe"],
    },
    "Asia/Baghdad": {
      label: "Baghdad",
      keywords: ["+", "03:00", "3:00", "Baghdad", "Asia"],
    },
    "Africa/Nairobi": {
      label: "Nairobi",
      keywords: ["+", "03:00", "3:00", "Nairobi", "Africa"],
    },
    "Europe/Minsk": {
      label: "Minsk",
      keywords: ["+", "03:00", "3:00", "Minsk", "Europe"],
    },
    "Asia/Riyadh": {
      label: "Riyadh",
      keywords: ["+", "03:00", "3:00", "Riyadh", "Asia"],
    },
    "Europe/Moscow": {
      label: "Moscow+00 - Moscow",
      keywords: ["+", "03:00", "3:00", "Moscow+00", "-", "Moscow", "Europe"],
    },
    "Asia/Tehran": {
      label: "Tehran",
      keywords: ["+", "03:00", "3:00", "Tehran", "Asia"],
    },
    "Asia/Baku": {
      label: "Baku",
      keywords: ["+", "04:00", "4:00", "Baku", "Asia"],
    },
    "Europe/Samara": {
      label: "Moscow+01 - Samara",
      keywords: ["+", "04:00", "4:00", "Moscow+01", "-", "Samara", "Europe"],
    },
    "Asia/Tbilisi": {
      label: "Tbilisi",
      keywords: ["+", "04:00", "4:00", "Tbilisi", "Asia"],
    },
    "Asia/Yerevan": {
      label: "Yerevan",
      keywords: ["+", "04:00", "4:00", "Yerevan", "Asia"],
    },
    "Asia/Kabul": {
      label: "Kabul",
      keywords: ["+", "04:00", "4:00", "Kabul", "Asia"],
    },
    "Asia/Karachi": {
      label: "Karachi",
      keywords: ["+", "05:00", "5:00", "Karachi", "Asia"],
    },
    "Asia/Yekaterinburg": {
      label: "Moscow+02 - Yekaterinburg",
      keywords: [
        "+",
        "05:00",
        "5:00",
        "Moscow+02",
        "-",
        "Yekaterinburg",
        "Asia",
      ],
    },
    "Asia/Tashkent": {
      label: "Tashkent",
      keywords: ["+", "05:00", "5:00", "Tashkent", "Asia"],
    },
    "Asia/Colombo": {
      label: "Colombo",
      keywords: ["+", "05:00", "5:00", "Colombo", "Asia"],
    },
    "Asia/Almaty": {
      label: "Almaty",
      keywords: ["+", "06:00", "6:00", "Almaty", "Asia"],
    },
    "Asia/Dhaka": {
      label: "Dhaka",
      keywords: ["+", "06:00", "6:00", "Dhaka", "Asia"],
    },
    "Asia/Rangoon": {
      label: "Rangoon",
      keywords: ["+", "06:00", "6:00", "Rangoon", "Asia"],
    },
    "Asia/Bangkok": {
      label: "Bangkok",
      keywords: ["+", "07:00", "7:00", "Bangkok", "Asia"],
    },
    "Asia/Jakarta": {
      label: "Jakarta",
      keywords: ["+", "07:00", "7:00", "Jakarta", "Asia"],
    },
    "Asia/Krasnoyarsk": {
      label: "Moscow+04 - Krasnoyarsk",
      keywords: ["+", "07:00", "7:00", "Moscow+04", "-", "Krasnoyarsk", "Asia"],
    },
    "Asia/Shanghai": {
      label: "China Time - Beijing",
      keywords: ["+", "08:00", "8:00", "China", "Time", "-", "Beijing", "Asia"],
    },
    "Asia/Hong_Kong": {
      label: "Hong Kong",
      keywords: ["+", "08:00", "8:00", "Hong", "Kong", "Asia"],
    },
    "Asia/Kuala_Lumpur": {
      label: "Kuala Lumpur",
      keywords: ["+", "08:00", "8:00", "Kuala", "Lumpur", "Asia"],
    },
    "Asia/Irkutsk": {
      label: "Moscow+05 - Irkutsk",
      keywords: ["+", "08:00", "8:00", "Moscow+05", "-", "Irkutsk", "Asia"],
    },
    "Asia/Singapore": {
      label: "Singapore",
      keywords: ["+", "08:00", "8:00", "Singapore", "Asia"],
    },
    "Asia/Taipei": {
      label: "Taipei",
      keywords: ["+", "08:00", "8:00", "Taipei", "Asia"],
    },
    "Asia/Ulaanbaatar": {
      label: "Ulaanbaatar",
      keywords: ["+", "08:00", "8:00", "Ulaanbaatar", "Asia"],
    },
    "Australia/Perth": {
      label: "Western Time - Perth",
      keywords: [
        "+",
        "08:00",
        "8:00",
        "Western",
        "Time",
        "-",
        "Perth",
        "Australia",
      ],
    },
    "Asia/Yakutsk": {
      label: "Moscow+06 - Yakutsk",
      keywords: ["+", "09:00", "9:00", "Moscow+06", "-", "Yakutsk", "Asia"],
    },
    "Asia/Seoul": {
      label: "Seoul",
      keywords: ["+", "09:00", "9:00", "Seoul", "Asia"],
    },
    "Asia/Tokyo": {
      label: "Tokyo",
      keywords: ["+", "09:00", "9:00", "Tokyo", "Asia"],
    },
    "Australia/Darwin": {
      label: "Central Time - Darwin",
      keywords: [
        "+",
        "09:00",
        "9:00",
        "Central",
        "Time",
        "-",
        "Darwin",
        "Australia",
      ],
    },
    "Australia/Brisbane": {
      label: "Eastern Time - Brisbane",
      keywords: ["+", "10:00", "Eastern", "Time", "-", "Brisbane", "Australia"],
    },
    "Pacific/Guam": {
      label: "Guam",
      keywords: ["+", "10:00", "Guam", "Pacific"],
    },
    "Asia/Magadan": {
      label: "Moscow+07 - Magadan",
      keywords: ["+", "10:00", "Moscow+07", "-", "Magadan", "Asia"],
    },
    "Asia/Vladivostok": {
      label: "Moscow+07 - Yuzhno-Sakhalinsk",
      keywords: ["+", "10:00", "Moscow+07", "-", "Yuzhno-Sakhalinsk", "Asia"],
    },
    "Pacific/Port_Moresby": {
      label: "Port Moresby",
      keywords: ["+", "10:00", "Port", "Moresby", "Pacific"],
    },
    "Australia/Adelaide": {
      label: "Central Time - Adelaide",
      keywords: ["+", "10:00", "Central", "Time", "-", "Adelaide", "Australia"],
    },
    "Australia/Hobart": {
      label: "Eastern Time - Hobart",
      keywords: ["+", "11:00", "Eastern", "Time", "-", "Hobart", "Australia"],
    },
    "Australia/Sydney": {
      label: "Eastern Time - Melbourne, Sydney",
      keywords: [
        "+",
        "11:00",
        "Eastern",
        "Time",
        "-",
        "Melbourne,",
        "Sydney",
        "Australia",
      ],
    },
    "Pacific/Guadalcanal": {
      label: "Guadalcanal",
      keywords: ["+", "11:00", "Guadalcanal", "Pacific"],
    },
    "Pacific/Noumea": {
      label: "Noumea",
      keywords: ["+", "11:00", "Noumea", "Pacific"],
    },
    "Pacific/Majuro": {
      label: "Majuro",
      keywords: ["+", "12:00", "Majuro", "Pacific"],
    },
    "Asia/Kamchatka": {
      label: "Moscow+09 - Petropavlovsk-Kamchatskiy",
      keywords: [
        "+",
        "12:00",
        "Moscow+09",
        "-",
        "Petropavlovsk-Kamchatskiy",
        "Asia",
      ],
    },
    "Pacific/Auckland": {
      label: "Auckland",
      keywords: ["+", "13:00", "Auckland", "Pacific"],
    },
    "Pacific/Fakaofo": {
      label: "Fakaofo",
      keywords: ["+", "13:00", "Fakaofo", "Pacific"],
    },
    "Pacific/Fiji": {
      label: "Fiji",
      keywords: ["+", "13:00", "Fiji", "Pacific"],
    },
    "Pacific/Tongatapu": {
      label: "Tongatapu",
      keywords: ["+", "13:00", "Tongatapu", "Pacific"],
    },
    "Pacific/Apia": {
      label: "Apia",
      keywords: ["+", "14:00", "Apia", "Pacific"],
    },
  };

export const searchableTimezones: Searchable<string>[] = Object.entries(
  timezones,
).map(([value, { keywords }]) => ({ value, keywords }));

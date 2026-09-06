const MONTHS_SHORT = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
] as const;

const WEEKDAYS = [
  "DIMANCHE",
  "LUNDI",
  "MARDI",
  "MERCREDI",
  "JEUDI",
  "VENDREDI",
  "SAMEDI",
] as const;

const MONTHS_LONG = [
  "JANVIER",
  "FÉVRIER",
  "MARS",
  "AVRIL",
  "MAI",
  "JUIN",
  "JUILLET",
  "AOÛT",
  "SEPTEMBRE",
  "OCTOBRE",
  "NOVEMBRE",
  "DÉCEMBRE",
] as const;

const THIN_SPACE = "\u202f";

/** Prices carry cents (see `parsePriceInput`) — shown only when non-zero, so a whole euro amount still reads as "649 €". */
export function formatEuro(amount: number): string {
  const cents = Math.round(amount * 100);
  const whole = Math.trunc(cents / 100);
  const fraction = Math.abs(cents % 100);
  const wholeFormatted = whole
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, THIN_SPACE);
  if (fraction === 0) return `${wholeFormatted} €`;
  return `${wholeFormatted},${fraction.toString().padStart(2, "0")} €`;
}

export function formatShortDate(isoDate: string): string {
  const date = parseDate(isoDate);
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatEyebrowDate(date: Date = new Date()): string {
  const weekday = WEEKDAYS[date.getDay()];
  const day = date.getDate();
  const month = MONTHS_LONG[date.getMonth()];
  return `${weekday} ${day} ${month}`;
}

export function initialsFrom(
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
): string {
  const first = firstName?.trim();
  const last = lastName?.trim();

  if (first && last) {
    return `${first[0]}${last[0]}`.toUpperCase();
  }

  if (first) {
    return first.slice(0, 2).toUpperCase();
  }

  if (last) {
    return last.slice(0, 2).toUpperCase();
  }

  const local = email?.split("@")[0]?.trim();
  if (!local) return "??";

  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return local.slice(0, 2).toUpperCase();
}

function parseDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}

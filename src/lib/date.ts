import { format, isValid, parseISO } from "date-fns";

type DateInput = Date | string | null | undefined;

function toDate(value: DateInput) {
  if (!value) return null;

  const parsed = value instanceof Date ? value : parseISO(value);
  return isValid(parsed) ? parsed : null;
}

// Global UI date style:
// - Date only: 20 Oct 2025
// - Date + time: 20 Oct 2025 • 10:57
export function formatUiDate(value: DateInput, fallback = "—") {
  const date = toDate(value);
  return date ? format(date, "d MMM yyyy") : fallback;
}

export function formatUiDateTime(value: DateInput, fallback = "—") {
  const date = toDate(value);
  return date ? format(date, "d MMM yyyy • HH:mm") : fallback;
}

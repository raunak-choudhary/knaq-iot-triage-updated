import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatRelativeTime(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || isNaN(ms)) return "—";
  try {
    const date = dayjs(ms);
    if (!date.isValid()) return "—";
    return date.fromNow();
  } catch {
    return "—";
  }
}

export function formatLocalDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const date = dayjs(iso);
    if (!date.isValid()) return "—";
    return date.format("MMM D, YYYY h:mm A");
  } catch {
    return "—";
  }
}

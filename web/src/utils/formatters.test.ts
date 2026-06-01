import { formatRelativeTime, formatLocalDate } from "./formatters";

describe("formatRelativeTime", () => {
  const now = Date.now();

  it("returns relative time for 3 minutes ago", () => {
    const result = formatRelativeTime(now - 3 * 60 * 1000);
    expect(result).toMatch(/\d+.*minute|a few seconds/i);
  });

  it("returns relative time for 2 hours ago", () => {
    const result = formatRelativeTime(now - 2 * 60 * 60 * 1000);
    expect(result).toMatch(/\d+.*hour/i);
  });

  it("returns relative time for 1 day ago", () => {
    const result = formatRelativeTime(now - 24 * 60 * 60 * 1000);
    expect(result).toMatch(/day|hour/i);
  });

  it("returns relative time for 3 days ago", () => {
    const result = formatRelativeTime(now - 3 * 24 * 60 * 60 * 1000);
    expect(result).toMatch(/day/i);
  });

  it("returns — for null", () => {
    expect(formatRelativeTime(null)).toBe("—");
  });

  it("returns — for undefined", () => {
    expect(formatRelativeTime(undefined)).toBe("—");
  });

  it("returns — for NaN", () => {
    expect(formatRelativeTime(NaN)).toBe("—");
  });
});

describe("formatLocalDate", () => {
  it("formats a valid ISO date string", () => {
    const result = formatLocalDate("2026-01-15T10:30:00-05:00");
    expect(result).not.toBe("—");
    expect(typeof result).toBe("string");
  });

  it("returns — for null", () => {
    expect(formatLocalDate(null)).toBe("—");
  });

  it("returns — for undefined", () => {
    expect(formatLocalDate(undefined)).toBe("—");
  });

  it("returns — for empty string", () => {
    expect(formatLocalDate("")).toBe("—");
  });

  it("returns — for invalid date string", () => {
    expect(formatLocalDate("not-a-date")).toBe("—");
  });
});

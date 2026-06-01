import { render, screen } from "@testing-library/react";
import { AlertTimeline } from "./AlertTimeline";
import type { TimelineEntry } from "@/features/alerts/types";

const now = Date.now();

const makeEntry = (overrides: Partial<TimelineEntry>): TimelineEntry => ({
  id: 1,
  timestamp: now - 3 * 60 * 1000,
  action: "created",
  user_name: null,
  details: null,
  note: null,
  ...overrides,
});

describe("AlertTimeline", () => {
  it("renders gracefully with empty entries", () => {
    render(<AlertTimeline entries={[]} />);
    expect(screen.getByText(/No timeline entries yet/i)).toBeInTheDocument();
  });

  it("renders created action", () => {
    render(<AlertTimeline entries={[makeEntry({ action: "created" })]} />);
    expect(screen.getByText("Created")).toBeInTheDocument();
  });

  it("renders acknowledged action with user name", () => {
    render(
      <AlertTimeline
        entries={[
          makeEntry({
            id: 2,
            action: "acknowledged",
            user_name: "Alice Chen",
          }),
        ]}
      />
    );
    expect(screen.getByText("Acknowledged")).toBeInTheDocument();
    expect(screen.getByText(/Alice Chen/)).toBeInTheDocument();
  });

  it("renders assigned action with details", () => {
    render(
      <AlertTimeline
        entries={[
          makeEntry({
            id: 3,
            action: "assigned",
            details: "Assigned to Bob Martinez",
          }),
        ]}
      />
    );
    expect(screen.getByText("Assigned")).toBeInTheDocument();
    expect(screen.getByText(/Assigned to Bob Martinez/)).toBeInTheDocument();
  });

  it("renders resolved action", () => {
    render(<AlertTimeline entries={[makeEntry({ id: 4, action: "resolved", details: "repaired" })]} />);
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it('shows human-readable label for "Resolved: replaced_part" details', () => {
    render(
      <AlertTimeline
        entries={[
          makeEntry({
            id: 10,
            action: "resolved",
            details: "Resolved: replaced_part",
          }),
        ]}
      />
    );
    expect(screen.getByText("Resolved: Replaced Part")).toBeInTheDocument();
    expect(screen.queryByText("Resolved: replaced_part")).not.toBeInTheDocument();
  });

  it("passes through details that do not match the Resolved: pattern unchanged", () => {
    render(
      <AlertTimeline
        entries={[
          makeEntry({
            id: 11,
            action: "assigned",
            details: "Assigned to Bob Martinez",
          }),
        ]}
      />
    );
    expect(screen.getByText("Assigned to Bob Martinez")).toBeInTheDocument();
  });

  it("renders note action with note text", () => {
    render(
      <AlertTimeline
        entries={[
          makeEntry({ id: 5, action: "note", note: "Checked the unit" }),
        ]}
      />
    );
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("Checked the unit")).toBeInTheDocument();
  });

  it("renders dismissed action", () => {
    render(<AlertTimeline entries={[makeEntry({ id: 6, action: "dismissed" })]} />);
    expect(screen.getByText("Dismissed")).toBeInTheDocument();
  });

  it("renders reopened action", () => {
    render(<AlertTimeline entries={[makeEntry({ id: 7, action: "reopened" })]} />);
    expect(screen.getByText("Reopened")).toBeInTheDocument();
  });

  it("renders entries in chronological order", () => {
    const entries: TimelineEntry[] = [
      makeEntry({ id: 1, timestamp: now - 5000, action: "created" }),
      makeEntry({ id: 2, timestamp: now - 2000, action: "acknowledged" }),
      makeEntry({ id: 3, timestamp: now - 1000, action: "resolved" }),
    ];
    render(<AlertTimeline entries={entries} />);
    const texts = screen
      .getAllByText(/Created|Acknowledged|Resolved/)
      .map((el) => el.textContent);
    expect(texts[0]).toBe("Created");
    expect(texts[1]).toBe("Acknowledged");
    expect(texts[2]).toBe("Resolved");
  });

  it("shows relative time for entries", () => {
    render(
      <AlertTimeline
        entries={[makeEntry({ timestamp: now - 3 * 60 * 1000 })]}
      />
    );
    const timeEls = screen.getAllByTestId("timeline-relative-time");
    expect(timeEls.length).toBeGreaterThan(0);
    expect(timeEls[0].textContent).not.toBe("—");
  });
});

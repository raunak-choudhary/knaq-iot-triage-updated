import { render, screen, fireEvent } from "@testing-library/react";
import { AlertTable } from "./AlertTable";
import type { AlertListItem } from "@/features/alerts/types";

jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

const makeAlert = (overrides: Partial<AlertListItem>): AlertListItem => ({
  id: "a1",
  device_id: "ELV-001",
  device_name: "Elevator 1",
  device_location: "Building A",
  alert_type: "temperature",
  severity: "warning",
  title: "Test alert",
  status: "new",
  timestamp_utc: Date.now(),
  timestamp_local: new Date().toISOString(),
  assigned_to: null,
  assignee_name: null,
  reading_value: null,
  threshold: null,
  reading_name: null,
  ...overrides,
});

const defaultProps = {
  alerts: [makeAlert({})],
  sortBy: "time" as const,
  sortDir: "desc" as const,
  onSortChange: jest.fn(),
  onAcknowledge: jest.fn(),
  onAssign: jest.fn(),
  selectedIds: new Set<string>(),
  onToggleSelect: jest.fn(),
  onToggleAll: jest.fn(),
  onBulkAcknowledge: jest.fn(),
};

describe("AlertTable", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders alert rows", () => {
    render(<AlertTable {...defaultProps} />);
    expect(screen.getByText("Test alert")).toBeInTheDocument();
  });

  it("shows acknowledge button only for new alerts", () => {
    render(
      <AlertTable
        {...defaultProps}
        alerts={[
          makeAlert({ id: "a1", status: "new" }),
          makeAlert({ id: "a2", status: "acknowledged" }),
        ]}
      />
    );
    expect(screen.getByTestId("ack-btn-a1")).toBeInTheDocument();
    expect(screen.queryByTestId("ack-btn-a2")).not.toBeInTheDocument();
  });

  it("calls onAcknowledge when button clicked", () => {
    const onAcknowledge = jest.fn();
    render(
      <AlertTable {...defaultProps} onAcknowledge={onAcknowledge} />
    );
    fireEvent.click(screen.getByTestId("ack-btn-a1"));
    expect(onAcknowledge).toHaveBeenCalledWith("a1");
  });
});

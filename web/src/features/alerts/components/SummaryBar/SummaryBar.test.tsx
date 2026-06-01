import { render, screen, fireEvent } from "@testing-library/react";
import { SummaryBar } from "./SummaryBar";
import type { StatusCounts } from "@/features/alerts/types";

const statusCounts: StatusCounts = {
  new: 2,
  acknowledged: 1,
  resolved: 1,
  dismissed: 0,
};

describe("SummaryBar", () => {
  it("shows correct counts per status", () => {
    render(
      <SummaryBar statusCounts={statusCounts} selectedStatus={[]} onStatusClick={jest.fn()} />
    );
    expect(screen.getByTestId("summary-chip-new")).toHaveTextContent("New: 2");
    expect(screen.getByTestId("summary-chip-acknowledged")).toHaveTextContent("Acknowledged: 1");
    expect(screen.getByTestId("summary-chip-resolved")).toHaveTextContent("Resolved: 1");
    expect(screen.getByTestId("summary-chip-dismissed")).toHaveTextContent("Dismissed: 0");
  });

  it("calls onStatusClick when chip is clicked", () => {
    const onStatusClick = jest.fn();
    render(
      <SummaryBar statusCounts={statusCounts} selectedStatus={[]} onStatusClick={onStatusClick} />
    );
    fireEvent.click(screen.getByTestId("summary-chip-new"));
    expect(onStatusClick).toHaveBeenCalledWith("new");
  });
});

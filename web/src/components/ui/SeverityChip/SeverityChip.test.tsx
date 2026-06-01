import { render, screen } from "@testing-library/react";
import { SeverityChip } from "./SeverityChip";

describe("SeverityChip", () => {
  it("renders Critical label for critical severity", () => {
    render(<SeverityChip severity="critical" />);
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("renders Warning label for warning severity", () => {
    render(<SeverityChip severity="warning" />);
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("renders Info label for info severity", () => {
    render(<SeverityChip severity="info" />);
    expect(screen.getByText("Info")).toBeInTheDocument();
  });

  it("applies error color for critical", () => {
    const { container } = render(<SeverityChip severity="critical" />);
    const chip = container.querySelector(".MuiChip-colorError");
    expect(chip).toBeInTheDocument();
  });

  it("applies warning color for warning", () => {
    const { container } = render(<SeverityChip severity="warning" />);
    const chip = container.querySelector(".MuiChip-colorWarning");
    expect(chip).toBeInTheDocument();
  });

  it("applies info color for info", () => {
    const { container } = render(<SeverityChip severity="info" />);
    const chip = container.querySelector(".MuiChip-colorInfo");
    expect(chip).toBeInTheDocument();
  });
});

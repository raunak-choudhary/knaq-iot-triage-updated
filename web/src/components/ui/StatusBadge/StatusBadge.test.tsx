import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders New label", () => {
    render(<StatusBadge status="new" />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders Acknowledged label", () => {
    render(<StatusBadge status="acknowledged" />);
    expect(screen.getByText("Acknowledged")).toBeInTheDocument();
  });

  it("renders Resolved label", () => {
    render(<StatusBadge status="resolved" />);
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it("renders Dismissed label", () => {
    render(<StatusBadge status="dismissed" />);
    expect(screen.getByText("Dismissed")).toBeInTheDocument();
  });
});

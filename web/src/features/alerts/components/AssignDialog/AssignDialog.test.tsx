import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssignDialog } from "./AssignDialog";
import type { User } from "@/features/alerts/types";

const mockUsers: User[] = [
  { id: "user-1", name: "Alice Chen", role: "Building Manager", company: "Brookfield Properties" },
  { id: "user-2", name: "Bob Martinez", role: "Technician", company: "Brookfield Properties" },
  { id: "user-3", name: "Carol Kim", role: "Building Manager", company: "Hines" },
];

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn().mockResolvedValue(undefined),
  users: mockUsers,
  currentAssigneeId: null,
};

describe("AssignDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user list", () => {
    render(<AssignDialog {...defaultProps} />);
    expect(screen.getByText("Alice Chen")).toBeInTheDocument();
    expect(screen.getByText("Bob Martinez")).toBeInTheDocument();
    expect(screen.getByText("Carol Kim")).toBeInTheDocument();
  });

  it("highlights current assignee", () => {
    render(<AssignDialog {...defaultProps} currentAssigneeId="user-1" />);
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("search filters displayed users", async () => {
    const user = userEvent.setup();
    render(<AssignDialog {...defaultProps} />);
    await user.type(screen.getByRole("textbox", { name: /search users/i }), "Bob");
    expect(screen.getByText("Bob Martinez")).toBeInTheDocument();
    expect(screen.queryByText("Carol Kim")).not.toBeInTheDocument();
  });

  it("assign button is disabled when no user selected", () => {
    render(<AssignDialog {...defaultProps} />);
    expect(screen.getByRole("button", { name: /assign button/i })).toBeDisabled();
  });

  it("assign button is enabled after selecting a user", async () => {
    render(<AssignDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /assign to Alice Chen/i }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /assign button/i })).not.toBeDisabled()
    );
  });

  it("calls assign mutation with correct assignee_id and note", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AssignDialog {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /assign to Bob Martinez/i }));
    await user.type(
      screen.getByRole("textbox", { name: /assignment note/i }),
      "Urgent fix needed"
    );
    fireEvent.click(screen.getByRole("button", { name: /assign button/i }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        assignee_id: "user-2",
        note: "Urgent fix needed",
      })
    );
  });

  it("closes on successful submit", async () => {
    const onClose = jest.fn();
    render(<AssignDialog {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /assign to Alice Chen/i }));
    fireEvent.click(screen.getByRole("button", { name: /assign button/i }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddNoteForm } from "./AddNoteForm";

describe("AddNoteForm", () => {
  it("submit button is disabled when input is empty", () => {
    render(<AddNoteForm onSubmit={jest.fn()} />);
    const btn = screen.getByRole("button", { name: /submit note/i });
    expect(btn).toBeDisabled();
  });

  it("submit button is enabled when input has text", async () => {
    const user = userEvent.setup();
    render(<AddNoteForm onSubmit={jest.fn()} />);
    await user.type(screen.getByRole("textbox", { name: /note/i }), "test note");
    expect(screen.getByRole("button", { name: /submit note/i })).not.toBeDisabled();
  });

  it("calls onSubmit with the note text", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AddNoteForm onSubmit={onSubmit} />);
    await user.type(screen.getByRole("textbox", { name: /note/i }), "my note");
    await user.click(screen.getByRole("button", { name: /submit note/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith("my note"));
  });

  it("clears the input after successful submit", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AddNoteForm onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox", { name: /note/i });
    await user.type(input, "test");
    await user.click(screen.getByRole("button", { name: /submit note/i }));
    await waitFor(() => expect(input).toHaveValue(""));
  });

  it("shows loading state while submitting", async () => {
    let resolve: () => void = () => undefined;
    const onSubmit = jest.fn(
      () => new Promise<void>((res) => { resolve = res; })
    );
    const user = userEvent.setup();
    render(<AddNoteForm onSubmit={onSubmit} />);
    await user.type(screen.getByRole("textbox", { name: /note/i }), "test");
    fireEvent.click(screen.getByRole("button", { name: /submit note/i }));
    await waitFor(() => expect(screen.getByRole("progressbar")).toBeInTheDocument());
    resolve();
  });
});

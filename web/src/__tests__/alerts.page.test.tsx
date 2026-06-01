import { screen, waitFor, fireEvent } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "./setup";
import { renderWithProviders } from "./testUtils";
import AlertsPage from "@/app/alerts/page";
import { mockAlerts } from "./handlers/alertHandlers";

jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
}));

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

describe("AlertsPage", () => {
  it("shows loading skeleton initially", () => {
    renderWithProviders(<AlertsPage />);
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("renders alert rows after loading", async () => {
    renderWithProviders(<AlertsPage />);
    await waitFor(() =>
      expect(screen.getByText("High Temperature Alert")).toBeInTheDocument()
    );
    expect(screen.getByText("Door Fault Detected")).toBeInTheDocument();
  });

  it("shows summary counts", async () => {
    renderWithProviders(<AlertsPage />);
    await waitFor(() =>
      expect(screen.getByTestId("summary-bar")).toBeInTheDocument()
    );
    expect(screen.getByTestId("summary-chip-new")).toHaveTextContent("New: 1");
    expect(screen.getByTestId("summary-chip-acknowledged")).toHaveTextContent("Acknowledged: 1");
  });

  it("filters by New status chip click", async () => {
    renderWithProviders(<AlertsPage />);
    // Wait for initial data
    await waitFor(() =>
      expect(screen.getByTestId("summary-chip-new")).toBeInTheDocument()
    );
    // Click the New chip to filter
    fireEvent.click(screen.getByTestId("summary-chip-new"));
    // Wait until only new alerts are shown
    await waitFor(
      () => {
        expect(screen.getByText("High Temperature Alert")).toBeInTheDocument();
        expect(screen.queryByText("Door Fault Detected")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows acknowledge button only for new alerts", async () => {
    renderWithProviders(<AlertsPage />);
    await waitFor(() =>
      expect(screen.getByText("High Temperature Alert")).toBeInTheDocument()
    );
    expect(screen.getByTestId("ack-btn-alert-1")).toBeInTheDocument();
    expect(screen.queryByTestId("ack-btn-alert-2")).not.toBeInTheDocument();
  });

  it("clicking acknowledge updates row", async () => {
    renderWithProviders(<AlertsPage />);
    await waitFor(() =>
      expect(screen.getByTestId("ack-btn-alert-1")).toBeInTheDocument()
    );
    fireEvent.click(screen.getByTestId("ack-btn-alert-1"));
    await waitFor(() =>
      expect(screen.queryByTestId("ack-btn-alert-1")).not.toBeInTheDocument()
    );
  });

  it("shows error state on 500", async () => {
    server.use(
      http.get(`${BASE}/alerts`, () =>
        HttpResponse.json({ detail: "Server error" }, { status: 500 })
      )
    );
    renderWithProviders(<AlertsPage />);
    await waitFor(() =>
      expect(screen.getByTestId("error-state")).toBeInTheDocument()
    );
  });

  it("shows empty state when no alerts returned", async () => {
    server.use(
      http.get(`${BASE}/alerts`, () => HttpResponse.json([]))
    );
    renderWithProviders(<AlertsPage />);
    await waitFor(() =>
      expect(screen.getByTestId("empty-state")).toBeInTheDocument()
    );
  });

  it("search sends q param to API", async () => {
    let capturedQ: string | null = null;
    server.use(
      http.get(`${BASE}/alerts`, ({ request }) => {
        const url = new URL(request.url);
        capturedQ = url.searchParams.get("q");
        return HttpResponse.json(mockAlerts);
      })
    );
    renderWithProviders(<AlertsPage />);
    await waitFor(() => screen.getByRole("textbox", { name: /search alerts/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /search alerts/i }), {
      target: { value: "temperature" },
    });
    await waitFor(() => expect(capturedQ).toBe("temperature"), { timeout: 2000 });
  });
});

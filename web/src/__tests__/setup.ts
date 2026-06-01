import { setupServer } from "msw/node";
import { alertHandlers, resetAlertState } from "./handlers/alertHandlers";
import { deviceHandlers } from "./handlers/deviceHandlers";
import { userHandlers } from "./handlers/userHandlers";

export const server = setupServer(
  ...alertHandlers,
  ...deviceHandlers,
  ...userHandlers
);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  server.resetHandlers();
  resetAlertState();
});
afterAll(() => server.close());

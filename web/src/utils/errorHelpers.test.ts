import { extractApiError } from "./errorHelpers";

describe("extractApiError", () => {
  it("extracts detail string from 409 error", () => {
    const error = { status: 409, data: { detail: "Alert is already acknowledged." } };
    expect(extractApiError(error)).toBe("Alert is already acknowledged.");
  });

  it("returns generic message for 409 without detail", () => {
    const error = { status: 409, data: {} };
    expect(extractApiError(error)).toMatch(/conflict/i);
  });

  it("extracts first validation message from 422 error with array detail", () => {
    const error = {
      status: 422,
      data: {
        detail: [
          { msg: "Field required", loc: ["body", "root_cause"] },
        ],
      },
    };
    expect(extractApiError(error)).toBe("Field required");
  });

  it("extracts detail string from 422 error", () => {
    const error = { status: 422, data: { detail: "Validation failed." } };
    expect(extractApiError(error)).toBe("Validation failed.");
  });

  it("returns generic network error message for FETCH_ERROR", () => {
    const error = { status: "FETCH_ERROR", error: "TypeError: Failed to fetch" };
    expect(extractApiError(error)).toMatch(/network|connect/i);
  });

  it("returns generic fallback for unknown error shape", () => {
    expect(extractApiError({ foo: "bar" })).toMatch(/unexpected|error/i);
  });

  it("returns generic fallback for null", () => {
    expect(extractApiError(null)).toMatch(/unknown/i);
  });

  it("returns generic fallback for string error", () => {
    expect(extractApiError("some error")).toMatch(/unexpected|error/i);
  });
});

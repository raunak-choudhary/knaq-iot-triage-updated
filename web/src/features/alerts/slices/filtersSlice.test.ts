import filtersReducer, {
  clearFilters,
  setDeviceId,
  setSearchQuery,
  setSeverity,
  setSortBy,
  setSortDir,
  setStatus,
  type FiltersState,
} from "./filtersSlice";

const initialState: FiltersState = {
  severity: [],
  status: [],
  deviceId: null,
  searchQuery: "",
  sortBy: "time",
  sortDir: "desc",
};

describe("filtersSlice", () => {
  it("returns initial state with defaults time/desc", () => {
    const state = filtersReducer(undefined, { type: "@@INIT" });
    expect(state).toEqual(initialState);
    expect(state.sortBy).toBe("time");
    expect(state.sortDir).toBe("desc");
  });

  it("setSeverity updates severity filter", () => {
    const state = filtersReducer(initialState, setSeverity(["critical"]));
    expect(state.severity).toEqual(["critical"]);
  });

  it("setStatus updates status filter", () => {
    const state = filtersReducer(initialState, setStatus(["new"]));
    expect(state.status).toEqual(["new"]);
  });

  it("setDeviceId updates deviceId", () => {
    const state = filtersReducer(initialState, setDeviceId("ELV-001"));
    expect(state.deviceId).toBe("ELV-001");
  });

  it("setSearchQuery updates searchQuery", () => {
    const state = filtersReducer(initialState, setSearchQuery("temperature"));
    expect(state.searchQuery).toBe("temperature");
  });

  it("setSortBy updates sortBy to severity", () => {
    const state = filtersReducer(initialState, setSortBy("severity"));
    expect(state.sortBy).toBe("severity");
  });

  it("setSortBy updates sortBy to status", () => {
    const state = filtersReducer(initialState, setSortBy("status"));
    expect(state.sortBy).toBe("status");
  });

  it("setSortDir updates sortDir to asc", () => {
    const state = filtersReducer(initialState, setSortDir("asc"));
    expect(state.sortDir).toBe("asc");
  });

  it("clearFilters resets all fields including sort", () => {
    const modifiedState: FiltersState = {
      severity: ["critical"],
      status: ["new"],
      deviceId: "ELV-001",
      searchQuery: "temp",
      sortBy: "severity",
      sortDir: "asc",
    };
    const state = filtersReducer(modifiedState, clearFilters());
    expect(state).toEqual(initialState);
  });
});

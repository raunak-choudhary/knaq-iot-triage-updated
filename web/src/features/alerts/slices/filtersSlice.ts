import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  severity: string[];
  status: string[];
  deviceId: string | null;
  searchQuery: string;
  sortBy: "severity" | "time" | "status";
  sortDir: "asc" | "desc";
}

const initialState: FiltersState = {
  severity: [],
  status: [],
  deviceId: null,
  searchQuery: "",
  sortBy: "time",
  sortDir: "desc",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSeverity(state, action: PayloadAction<string[]>) {
      state.severity = action.payload;
    },
    setStatus(state, action: PayloadAction<string[]>) {
      state.status = action.payload;
    },
    setDeviceId(state, action: PayloadAction<string | null>) {
      state.deviceId = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSortBy(state, action: PayloadAction<"severity" | "time" | "status">) {
      state.sortBy = action.payload;
    },
    setSortDir(state, action: PayloadAction<"asc" | "desc">) {
      state.sortDir = action.payload;
    },
    clearFilters(state) {
      state.severity = [];
      state.status = [];
      state.deviceId = null;
      state.searchQuery = "";
      state.sortBy = "time";
      state.sortDir = "desc";
    },
  },
});

export const {
  setSeverity,
  setStatus,
  setDeviceId,
  setSearchQuery,
  setSortBy,
  setSortDir,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;

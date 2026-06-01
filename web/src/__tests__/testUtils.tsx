import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { alertsApi } from "@/features/alerts/api/alertsApi";
import filtersReducer from "@/features/alerts/slices/filtersSlice";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "@/lib/theme";
import { AppToastProvider } from "@/components/ui/AppToast";

function makeTestStore() {
  return configureStore({
    reducer: {
      [alertsApi.reducerPath]: alertsApi.reducer,
      filters: filtersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(alertsApi.middleware),
  });
}

function AllProviders({ children }: { children: React.ReactNode }) {
  const store = makeTestStore();
  const theme = getTheme("light");
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AppToastProvider>{children}</AppToastProvider>
      </ThemeProvider>
    </Provider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

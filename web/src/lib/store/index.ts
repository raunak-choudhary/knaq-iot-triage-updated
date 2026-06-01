import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { alertsApi } from "@/features/alerts/api/alertsApi";
import filtersReducer from "@/features/alerts/slices/filtersSlice";

export const store = configureStore({
  reducer: {
    [alertsApi.reducerPath]: alertsApi.reducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(alertsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

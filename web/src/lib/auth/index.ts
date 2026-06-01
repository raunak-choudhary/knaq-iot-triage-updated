import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export function prepareHeaders(headers: Headers): Headers {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export type BaseQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
>;

export function createAuthBaseQuery(baseUrl: string): BaseQuery {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  });
}

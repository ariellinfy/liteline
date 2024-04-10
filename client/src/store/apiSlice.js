import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://liteline-proxy-v48s.onrender.com/" || "http://localhost:5000/", // server url
    credentials: "include",
  }),
  tagTypes: ["User", "Room", "Message"],
  endpoints: (builder) => ({}),
  refetchOnReconnect: true,
});

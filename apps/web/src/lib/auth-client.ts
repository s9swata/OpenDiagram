"use client";

import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
if (!baseURL) {
  throw new Error(
    "NEXT_PUBLIC_SERVER_URL is required. This env var must be set at build time for auth requests to reach the server.",
  );
}

export const authClient = createAuthClient({ baseURL });

/**
 * Absolute frontend URL for OAuth callback redirects.
 * Relative paths like "/dashboard" are resolved against BETTER_AUTH_URL (the API
 * host), which lands users on the API origin instead of the web app.
 */
export function frontendCallbackURL(path = "/dashboard"): string {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
}

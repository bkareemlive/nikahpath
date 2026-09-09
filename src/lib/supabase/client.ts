"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components ("use client").
 * Reads the public env vars that are inlined at build time.
 *
 * Untyped by design: row shapes are applied at the call site with
 * `.returns<T>()` / `.maybeSingle<T>()` using the interfaces in ./types.
 * Swap in a generated `Database` generic once `supabase gen types` is wired.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

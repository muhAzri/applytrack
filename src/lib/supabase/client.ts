import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

let cachedClient: SupabaseClient | null | undefined;

/** Returns null when Supabase credentials have not been configured yet. */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;
  const env = getSupabaseEnv();
  if (!env) {
    cachedClient = null;
    return null;
  }
  cachedClient = createBrowserClient(env.url, env.anonKey);
  return cachedClient;
}

import { createClient } from "@supabase/supabase-js";

// We use the service role key for the backend to bypass RLS and perform orchestration inserts.
// WARNING: Never expose the service role key to the frontend client.

// Use placeholder values during build time to prevent crashes.
// At runtime, the real env vars will be used.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

// Export a singleton instance for backend API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});


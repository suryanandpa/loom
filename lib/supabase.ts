import { createClient } from "@supabase/supabase-js";

// We use the service role key for the backend to bypass RLS and perform orchestration inserts.
// WARNING: Never expose the service role key to the frontend client.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Export a singleton instance for backend API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

import { createClient } from "@supabase/supabase-js";
const supabase_url = "https://ltajohamdcvwdkisyteq.supabase.co";
export const supabase = createClient(
  supabase_url,
  import.meta.env.VITE_SUPABASE_KEY
);

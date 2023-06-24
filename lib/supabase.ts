import { NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL } from "@/config";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const supabaseClient = createClientComponentClient<Database>({
  supabaseUrl: NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options: {
    db: {
      schema: "public",
    },
  },
});

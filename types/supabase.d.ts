import { UserMetadata as CustomUserMetadata } from ".";

declare module "@supabase/supabase-js" {
  interface UserMetadata extends CustomUserMetadata {}
}

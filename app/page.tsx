import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function App() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    return redirect("/dashboard");
  } else {
    return redirect("/home");
  }
}

export const dynamic = "force-dynamic";

import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import DashboardBlogsSection from "./components/Blogs";
import DashboardTopSection from "./components/TopSection";
import DashboardProvider from "./providers/dashboard";

/**
 * Dashboard header
 * Dashboard stats
 * Articles (with filter options, Scheduled, Drafts, Published) also with search
 */
export default async function DashboardRootPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return (
    <DashboardProvider user={user} blogs={data}>
      <DashboardTopSection />
      <DashboardBlogsSection />
    </DashboardProvider>
  );
}

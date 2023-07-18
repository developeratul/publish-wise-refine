import { AppProps } from "@/types";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { RedirectType } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardLayoutWrapper from "./components/LayoutWrapper";

export default async function DashboardLayout(props: AppProps) {
  const { children } = props;
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!session || !user) {
    return redirect("/auth", RedirectType.replace);
  }

  return <DashboardLayoutWrapper user={user}>{children}</DashboardLayoutWrapper>;
}

export const dynamic = "force-dynamic";

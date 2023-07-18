import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import nextDynamic from "next/dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const Features = nextDynamic(() => import("./components/Features"));
const Footer = nextDynamic(() => import("./components/Footer"));
const Hero = nextDynamic(() => import("./components/Hero"));
const StartPublishing = nextDynamic(() => import("./components/StartPublishing"));

export default async function LandingHome() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();
  const { session } = data;

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div>
      <Hero />
      <Features />
      <StartPublishing />
      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic";

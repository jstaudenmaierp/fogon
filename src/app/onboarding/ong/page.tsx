import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OngOnboardingFlow } from "@/components/onboarding-ong/OngOnboardingFlow";

export default async function OngOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/onboarding/ong");

  const { data: ong } = await supabase
    .from("ong")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (ong) redirect("/ong/dashboard");

  return <OngOnboardingFlow />;
}

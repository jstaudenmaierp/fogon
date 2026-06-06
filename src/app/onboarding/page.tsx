import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: donante } = await supabase
    .from("donantes")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (donante) redirect("/ingresar");

  return (
    <main className="min-h-screen bg-[#fff2d8] flex items-center justify-center px-6 py-12">
      <OnboardingFlow userEmail={user.email ?? ""} />
    </main>
  );
}

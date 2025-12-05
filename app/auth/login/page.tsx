import { LoginForm } from "@/components/login-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  console.log("data: ", data, " error: ", error);
  // redirect to home page if they are already logged in 
  if (!error && data?.claims) {
    console.log("logged in, redirecting :)")
    redirect("/protected");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

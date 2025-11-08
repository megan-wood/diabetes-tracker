import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  // const { data } = await supabase.auth.getClaims();
  const { data } = await supabase.auth.getUser();

  // const user = data?.claims;
  console.log("data: " + data); 
  const user = data?.user;

  let profile; 
  // let profileError; 

  // console.log("user: " + user?.id); 
  
  if (user) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .single();

    profile = profileData; 
  }

  // console.log("profile: " + profile); 
  

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {profile?.first_name}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

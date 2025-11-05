import { redirect } from "next/navigation";

// import { useState } from "react";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
// import { GlucoseForm } from "./glucose-form";
import GlucoseForm from "./glucose-form";
import RecentData from "./recent-data";


export default async function ProtectedPage() {
  // const [entries, setEntries] = useState<any[]>([]); 
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  // const { data, error } = await supabase.auth.getUser();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  let user = userData.user;
  let profile; 
  if (user) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .single();
    profile = profileData; 
  }

  // const handleNewData = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // const supabase = createClient();


  // }

  // useEffect(() => {
  //   const fetchEntries = async () => {
  //     const { data } = await supabase 
  //       .from("glucose_logs")
  //       .select("*")
  //       .order("time", {ascending: false})
  //       .limit(5)
  //     setEntries(data || []); 
  //   };
  //   fetchEntries();
  // }, []);

  const { data: entries } = await supabase
    .from("glucose_logs")
    .select("*")
    .order("time", {ascending: false})
    .limit(5);

    console.log("entries: ", entries); 

  return (
    // <div className="flex-1 w-full flex flex-col gap-12">
    //   <div className="flex flex-col gap-2 items-start"> 
    //     // <h2 className="font-bold text-2xl mb-4">Your user details</h2>
    //     <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
    //       {JSON.stringify(data.claims, null, 2)}
    //     </pre>
    //   </div>  
    //   <div>
    //     <h2 className="font-bold text-2xl mb-4">Next steps</h2>
    //     <FetchDataSteps />
    //   </div>
    // </div>
    <div className="flex flex-col w-full m-5">
        <h3 className="font-bold ">{profile.first_name}, Welcome to your Diabetes Dashboard</h3>

        <h2>Current Trends:</h2>
        <GlucoseForm/>
        <RecentData entries={entries || []}/>
    </div>
  );
}

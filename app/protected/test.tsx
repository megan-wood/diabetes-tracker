// "use client";
// import { useEffect } from "react";
// import { createClient } from "@/lib/supabase/client";

// export default function RealtimeTest() {
//   useEffect(() => {
//     const supabase = createClient();

//     const channel = supabase
//       .channel("test")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "glucose_logs" },
//         (payload) => console.log("🔥 Realtime payload:", payload)
//       )
//       .subscribe((status) => console.log("Subscription status:", status));

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   return <div>Check console for Realtime logs</div>;
// }
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
  );

// import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

// export function createClient() {
//   return supabaseCreateClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
//   );
// }


// const supabase = supabaseCreateClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
//   {
//     auth: {
//       persistSession: true,
//       autoRefreshToken: true,
//       detectSessionInUrl: true,
//     },
//   }
// );

// export default supabase;
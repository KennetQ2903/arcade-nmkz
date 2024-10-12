import {supabaseAnon} from "@/lib/supabaseAnon";
import type { APIRoute } from "astro";

export const GET: APIRoute=async ({cookies,redirect}) => {
  const {error}=await supabaseAnon.auth.signOut()
  if(error) {
    return new Response(error.message,{status: 500});
  }
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  return redirect("/signin");
};
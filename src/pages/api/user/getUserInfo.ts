import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const GET: APIRoute=async () => {
    const {data: {user}}=await supabaseAnon.auth.getUser()
    if(!user) {
        return new Response("User not found",{status: 404});
    }

    const userData=await supabaseAnon.from("usuarios").select("*").eq("id",user?.id).single();


    if(userData.error) {
        return new Response(userData.error.message,{status: 500});
    }

    if(!userData.data) {
        return new Response("User info not found",{status: 404});
    }

    return new Response(JSON.stringify(userData.data),{status: 200,headers: {'Content-Type': 'application/json'}});
}
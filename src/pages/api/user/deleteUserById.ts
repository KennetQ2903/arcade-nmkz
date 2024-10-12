import {supabaseAdmin} from "@/lib/supabase";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request}) => {
    const {id}: Awaited<{id: string}>=await request.json();

    const {error}=await supabaseAdmin.auth.admin.deleteUser(id)

    if(error) {
        return new Response(error.message,{status: 500})
    }

    return new Response("User deleted",{status: 200})

}
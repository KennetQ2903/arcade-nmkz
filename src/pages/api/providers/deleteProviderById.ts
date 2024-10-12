import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request}) => {
    const {id}: Awaited<{id: string}>=await request.json();

    const {error,status}=await supabaseAnon
        .from('providers')
        .delete()
        .eq('id',id)

    if(error) {
        return new Response(error.message,{status})
    }

    return new Response("Provider deleted",{status: 200})
}
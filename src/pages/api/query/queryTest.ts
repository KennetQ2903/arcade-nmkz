
import type {APIRoute} from "astro";
import {supabase} from "../../../lib/supabase";

export const POST: APIRoute=async ({request}) => {
    const formData=await request.formData();
    const description=formData.get("description")?.toString();
    const numberValue=formData.get("number_value")?.toString();


    const {error}=await supabase.from('test').insert({description,number_value: numberValue});

    if(error) {
        return new Response(error.message,{status: 500});
    }

    return new Response("OK",{status: 200});
};
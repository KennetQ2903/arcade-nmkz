
import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request,cookies}) => {
    const formData=await request.json();
    const email=formData.email;
    const password=formData.password;

    if(!email||!password) {
        return new Response("Email and password are required",{status: 400});
    }

    const {data,error}=await supabaseAnon.auth.signInWithPassword({
        email,
        password,
    });

    if(error) {
        if(error.code==="invalid_credentials") {
            return new Response(error.message,{status: 401});
        }
        return new Response(error.message,{status: 500});
    }

    const {access_token,refresh_token}=data.session;
    cookies.set("sb-access-token",access_token,{
        path: "/",
    });
    cookies.set("sb-refresh-token",refresh_token,{
        path: "/",
    });

    return new Response("User signed in",{status: 200});
};
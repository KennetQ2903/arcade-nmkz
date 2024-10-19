import {supabaseAnon} from "@/lib/supabaseAnon";


export async function GET() {
    const {data,error,status}=await supabaseAnon.rpc("get_all_shops")
    if(error) {
        return new Response(error.message,{status})
    }
    return new Response(JSON.stringify(data),{status,headers: {'Content-Type': 'application/json'}});
}
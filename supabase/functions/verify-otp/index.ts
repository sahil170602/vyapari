import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { phone, otp } = await req.json();

  const res = await fetch(
    `${Deno.env.get("SUPABASE_URL")}/rest/v1/otp_store?phone=eq.${phone}&otp=eq.${otp}`,
    {
      headers: {
        "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        "Authorization": `Bearer ${Deno.env.get(
          "SUPABASE_SERVICE_ROLE_KEY"
        )}`,
      },
    }
  );

  const data = await res.json();

  if (!data.length) {
    return new Response(
      JSON.stringify({ error: "Invalid OTP" }),
      { status: 401, headers: corsHeaders }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: corsHeaders }
  );
});

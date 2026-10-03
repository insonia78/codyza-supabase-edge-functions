// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { SignJWT } from "npm:jose@5";
import {
  authorizeWeatherGatewayRequest,
  weatherGatewayCallerHeader,
  weatherGatewaySecretHeader,
} from "../_shared/weather-gateway-auth.ts";



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    `authorization, x-client-info, apikey, content-type, ${weatherGatewayCallerHeader}, ${weatherGatewaySecretHeader}`,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};



function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

console.log("JWT Creator function loaded.");
export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return jsonResponse(405, {
        error: "Method not allowed",
        method: req.method,
      });
    }

    // const gatewayAuthorizationError = authorizeWeatherGatewayRequest(
    //   req,
    //   jsonResponse,
    //   "jwt-creator",
    // );
    // if (gatewayAuthorizationError) {
    //   return gatewayAuthorizationError;
    // }

    try {
      const secretKey = Deno.env.get("MY_JWT_SECRET");
      if (!secretKey) {
        throw new Error("Missing MY_JWT_SECRET environment variable.");
      }

      const secret = new TextEncoder().encode(secretKey);
      const { userId, role } = await req.json();
      const jwt = await new SignJWT({
        userId: userId || "anonymous",
        role: role || "user",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer("weather-gateway")
        .setExpirationTime("2h")
        .sign(secret);
       
      return jsonResponse(200, { token: jwt });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return jsonResponse(400, { error: message });
    }
  }),
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Call this function through weather-gateway with WEATHER_GATEWAY_INTERNAL_SECRET configured.

*/

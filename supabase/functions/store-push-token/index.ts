import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StorePushTokenRequest {
  pushToken: string;
  platform: 'ios' | 'android';
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STORE-PUSH-TOKEN] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting push token storage");

    // Get the authorization header for user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    // Create Supabase client with service role key for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate the user using the anon key client
    const supabaseAnon = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAnon.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const userId = userData.user.id;
    logStep("User authenticated", { userId });

    // Parse the request body
    const { pushToken, platform }: StorePushTokenRequest = await req.json();

    if (!pushToken || !platform) {
      throw new Error("Missing pushToken or platform in request body");
    }

    logStep("Received push token data", { platform, tokenLength: pushToken.length });

    // Check if a token already exists for this user and platform
    const { data: existingTokens, error: fetchError } = await supabase
      .from('user_push_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', platform)
      .eq('is_active', true);

    if (fetchError) {
      throw new Error(`Error fetching existing tokens: ${fetchError.message}`);
    }

    // If there's an existing token, update it; otherwise, insert a new one
    if (existingTokens && existingTokens.length > 0) {
      logStep("Updating existing push token");
      
      const { error: updateError } = await supabase
        .from('user_push_tokens')
        .update({
          push_token: pushToken,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('platform', platform)
        .eq('is_active', true);

      if (updateError) {
        throw new Error(`Error updating push token: ${updateError.message}`);
      }
    } else {
      logStep("Inserting new push token");
      
      const { error: insertError } = await supabase
        .from('user_push_tokens')
        .insert({
          user_id: userId,
          push_token: pushToken,
          platform: platform,
          is_active: true
        });

      if (insertError) {
        throw new Error(`Error inserting push token: ${insertError.message}`);
      }
    }

    logStep("Push token stored successfully");

    return new Response(JSON.stringify({
      success: true,
      message: "Push token stored successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in store push token", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
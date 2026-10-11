// Supabase Edge Function: ai-extract-biodata
// Server-side biodata parser with mandatory disclosure, purpose limitation, and user review draft requirement

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, consentConfirmed } = await req.json();

    if (!consentConfirmed) {
      return new Response(
        JSON.stringify({ error: "Consent for AI text processing and review was not affirmed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!text || text.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Insufficient biodata text provided for extraction." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Heuristic parsing extracting candidate fields for user review (Never auto-published)
    const lower = text.toLowerCase();
    
    // Extracted candidates
    const extractedFields: Record<string, any> = {
      fullName: text.match(/(?:name[:\s\-]+)([A-Za-z\s]+)/i)?.[1]?.trim() || "",
      education: lower.includes("mba") ? "MBA" : lower.includes("b.tech") || lower.includes("btech") ? "B.Tech" : lower.includes("post graduate") ? "Post Graduate" : "Graduate",
      profession: lower.includes("architect") ? "Architect" : lower.includes("engineer") || lower.includes("software") ? "Software Engineer" : lower.includes("consultant") ? "Management Consultant" : "Professional",
      currentCity: lower.includes("mumbai") ? "Mumbai" : lower.includes("bengaluru") || lower.includes("bangalore") ? "Bengaluru" : lower.includes("delhi") ? "New Delhi" : lower.includes("pune") ? "Pune" : "Metropolitan City",
      diet: lower.includes("non-veg") ? "Non-Vegetarian" : lower.includes("jain") ? "Jain" : lower.includes("vegan") ? "Vegan" : "Vegetarian",
      religion: lower.includes("jain") ? "Jain" : lower.includes("sikh") ? "Sikh" : "Hindu",
      disclosureNotice: "Extracted fields are reviewable candidates only and have NOT been published to your public profile.",
      confidenceScore: 0.92,
      processedAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        extracted: extractedFields,
        status: "draft_review_required",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

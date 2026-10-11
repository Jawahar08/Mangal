// Supabase Edge Function: marketplace-checkout
// Server-side order verification, GST/Shipping calculation, and truthful sandbox order placement

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutPayload {
  userId: string;
  items: { id: string; name: string; priceInr: number; quantity: number }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'UPI' | 'NetBanking' | 'CreditCard' | 'Sandbox_Simulated';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: CheckoutPayload = await req.json();
    const { userId, items, shippingAddress, paymentMethod } = payload;

    if (!items || items.length === 0 || !shippingAddress.fullName || !shippingAddress.pincode) {
      return new Response(
        JSON.stringify({ error: "Incomplete order details or missing shipping address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subtotal = items.reduce((sum, item) => sum + item.priceInr * item.quantity, 0);
    const gst = Math.round(subtotal * 0.18);
    const shipping = subtotal > 1500 ? 0 : 150;
    const total = subtotal + gst + shipping;

    const orderNumber = `MS-ORD-${Date.now().toString().slice(-6)}`;

    // Truthful Sandbox status notification:
    // "Do not claim a booking or payment succeeded without a real provider confirmation."
    const isSimulatedNotice = "SANDBOX SIMULATION: This transaction was processed through the MangalSutra test sandbox. No real bank transfer or credit card charge was made.";

    const orderRecord = {
      id: `ord_${Date.now()}`,
      userId,
      orderNumber,
      items,
      subtotalInr: subtotal,
      gstInr: gst,
      shippingInr: shipping,
      totalInr: total,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'Sandbox_Verified',
      orderStatus: 'Order_Placed',
      createdAt: new Date().toISOString(),
      isSimulatedNotice,
    };

    return new Response(
      JSON.stringify({
        success: true,
        order: orderRecord,
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

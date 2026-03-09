import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const tier = session.metadata?.tier || "unknown";
    const customerName = session.metadata?.customer_name || null;
    const referralPartnerId = session.metadata?.referral_partner_id || null;

    // Record the order
    const { error: orderError } = await supabase.from("orders").insert({
      email: session.customer_email || session.customer_details?.email || "",
      name: customerName,
      tier,
      amount_cents: session.amount_total || 0,
      currency: session.currency || "aud",
      stripe_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
      status: "paid",
      referral_partner_id: referralPartnerId,
      metadata: {
        stripe_customer_id: session.customer,
        payment_status: session.payment_status,
      },
    });

    if (orderError) {
      console.error("Failed to insert order:", orderError);
    }

    // If referral, record commission
    if (referralPartnerId) {
      // Look up the partner's user_id from their partner_id
      const { data: partnerProfile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("partner_id", referralPartnerId)
        .single();

      if (partnerProfile) {
        const commissionRate = 0.5;
        const commissionAmount = ((session.amount_total || 0) / 100) * commissionRate;

        const { error: refError } = await supabase.from("referrals").insert({
          partner_user_id: partnerProfile.user_id,
          referred_email: session.customer_email || session.customer_details?.email || "",
          commission_amount: commissionAmount,
          status: "confirmed",
        });

        if (refError) {
          console.error("Failed to insert referral:", refError);
        }
      }
    }

    console.log(`Order recorded: ${tier} / ${session.id}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});

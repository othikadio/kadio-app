// Edge Function — Créer un abonnement Stripe Billing
import Stripe from 'https://esm.sh/stripe@14.14.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { planId, stripePriceId, clientEmail, clientId } = await req.json()

    // Trouver ou créer le customer Stripe
    const customers = await stripe.customers.list({ email: clientEmail, limit: 1 })
    let customer = customers.data[0]
    if (!customer) {
      customer = await stripe.customers.create({
        email: clientEmail,
        metadata: { kadio_client_id: clientId },
      })
    }

    // Créer l'abonnement
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: stripePriceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: { kadio_plan_id: planId, kadio_client_id: clientId },
    })

    return new Response(
      JSON.stringify({
        ok: true,
        subscriptionId: subscription.id,
        status: subscription.status,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

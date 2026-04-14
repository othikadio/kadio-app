// Edge Function — Solde Stripe Connect d'un partenaire
import Stripe from 'https://esm.sh/stripe@14.14.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { stripeAccountId } = await req.json()

    const balance = await stripe.balance.retrieve({
      stripeAccount: stripeAccountId,
    })

    const available = balance.available
      .filter(b => b.currency === 'cad')
      .reduce((sum, b) => sum + b.amount, 0) / 100

    const pending = balance.pending
      .filter(b => b.currency === 'cad')
      .reduce((sum, b) => sum + b.amount, 0) / 100

    return new Response(
      JSON.stringify({ ok: true, available, pending, currency: 'CAD' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Edge Function — Transférer des fonds vers un partenaire
import Stripe from 'https://esm.sh/stripe@14.14.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { amount, stripeAccountId } = await req.json()

    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100), // en cents
      currency: 'cad',
      destination: stripeAccountId,
    })

    return new Response(
      JSON.stringify({
        ok: true,
        transferId: transfer.id,
        amount: transfer.amount / 100,
        currency: 'CAD',
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

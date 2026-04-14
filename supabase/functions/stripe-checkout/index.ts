// Edge Function — Créer une session Stripe Checkout
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
    const { montant, description, clientEmail, rdvId, successUrl, cancelUrl } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      currency: 'cad',
      customer_email: clientEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: { name: description || 'Kadio Coiffure — Paiement' },
            unit_amount: montant, // en cents
          },
          quantity: 1,
        },
      ],
      metadata: { rdvId: rdvId || '' },
      success_url: successUrl || 'https://kadiocoiffure.com/client/confirmation?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl || 'https://kadiocoiffure.com/client/carte',
    })

    return new Response(
      JSON.stringify({ ok: true, sessionId: session.id, url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

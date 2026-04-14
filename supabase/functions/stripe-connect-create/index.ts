// Edge Function — Créer un compte Stripe Connect pour partenaire
import Stripe from 'https://esm.sh/stripe@14.14.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { partenaireId } = await req.json()

    // Récupérer les infos du partenaire
    const { data: partenaire } = await supabase
      .from('partenaires')
      .select('*, users(email, telephone)')
      .eq('id', partenaireId)
      .single()

    // Créer le compte Express
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'CA',
      email: partenaire.users?.email || undefined,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: { kadio_partenaire_id: partenaireId },
    })

    // Sauvegarder l'ID Stripe dans le profil partenaire
    await supabase
      .from('partenaires')
      .update({ stripe_account_id: account.id })
      .eq('id', partenaireId)

    // Créer le lien d'onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://kadiocoiffure.com/partenaire/accueil?stripe=refresh',
      return_url: 'https://kadiocoiffure.com/partenaire/accueil?stripe=complete',
      type: 'account_onboarding',
    })

    return new Response(
      JSON.stringify({
        ok: true,
        stripeAccountId: account.id,
        onboardingUrl: accountLink.url,
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

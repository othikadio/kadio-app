// Edge Function — Webhook Stripe (paiements, abonnements)
import Stripe from 'https://esm.sh/stripe@14.14.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  switch (event.type) {
    // ── Paiement unique réussi ──
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const rdvId = session.metadata?.rdvId
      if (rdvId) {
        await supabase
          .from('rendez_vous')
          .update({
            statut: 'confirme',
            stripe_payment_id: session.payment_intent as string,
            montant_paye: (session.amount_total || 0) / 100,
          })
          .eq('id', rdvId)
      }
      break
    }

    // ── Abonnement payé ──
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.subscription) {
        const sub = await stripe.subscriptions.retrieve(invoice.subscription as string)
        const clientId = sub.metadata?.kadio_client_id
        if (clientId) {
          await supabase
            .from('abonnements')
            .update({ statut: 'actif', stripe_subscription_id: sub.id })
            .eq('client_id', clientId)
            .eq('statut', 'en_attente')
        }
      }
      break
    }

    // ── Abonnement annulé ──
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const clientId = sub.metadata?.kadio_client_id
      if (clientId) {
        await supabase
          .from('abonnements')
          .update({ statut: 'annule', date_fin: new Date().toISOString() })
          .eq('stripe_subscription_id', sub.id)
      }
      break
    }

    // ── Paiement échoué ──
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      console.log('[Stripe Webhook] Paiement échoué:', invoice.id)
      // TODO: Envoyer SMS de relance au client
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})

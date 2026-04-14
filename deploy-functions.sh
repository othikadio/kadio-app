#!/bin/bash
# Script de déploiement des Edge Functions Stripe pour Kadio Coiffure
# Exécuter depuis la racine du projet: ./deploy-functions.sh

set -e

echo "🚀 Déploiement des Edge Functions Kadio Coiffure..."
echo ""

# Vérifier que le CLI Supabase est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI non trouvé. Installation..."
    npm install -g supabase
fi

# Variables
PROJECT_REF="crflwfzjucalhicbdlmj"

# Login si nécessaire
echo "🔑 Connexion à Supabase..."
supabase login

# Lier le projet
echo "🔗 Liaison avec le projet kadio-production..."
supabase link --project-ref $PROJECT_REF

# Déployer chaque fonction
FUNCTIONS=(
    "stripe-checkout"
    "stripe-subscription"
    "stripe-cancel-subscription"
    "stripe-connect-create"
    "stripe-transfer"
    "stripe-balance"
    "stripe-webhook"
)

for func in "${FUNCTIONS[@]}"; do
    echo ""
    echo "📦 Déploiement de $func..."
    supabase functions deploy "$func" --no-verify-jwt
    echo "✅ $func déployé!"
done

echo ""
echo "🎉 Toutes les Edge Functions sont déployées!"
echo ""
echo "⚠️  N'oublie pas de configurer le webhook Stripe:"
echo "   URL: https://$PROJECT_REF.supabase.co/functions/v1/stripe-webhook"
echo "   Événements: checkout.session.completed, invoice.payment_succeeded,"
echo "              customer.subscription.deleted, invoice.payment_failed"

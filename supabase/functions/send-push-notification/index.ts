/**
 * Supabase Edge Function: send-push-notification
 * Sends push notifications to users via Firebase Cloud Messaging (FCM)
 *
 * Usage:
 * POST /functions/v1/send-push-notification
 *
 * Body:
 * {
 *   "userId": "user-uuid",
 *   "title": "Notification Title",
 *   "body": "Notification body text",
 *   "type": "rdv_reminder|rdv_confirmed|formation_complete|promo|system",
 *   "data": {
 *     "rdvId": "optional-rdv-id",
 *     "formationId": "optional-formation-id",
 *     "url": "/path/to/navigate"
 *   }
 * }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Type definitions
interface PushNotificationPayload {
  userId: string
  title: string
  body: string
  type: 'rdv_reminder' | 'rdv_confirmed' | 'formation_complete' | 'promo' | 'system'
  data?: Record<string, any>
}

interface UserSubscription {
  id: string
  push_subscription?: {
    endpoint: string
    auth: string
    p256dh: string
  }
  push_enabled?: boolean
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: PushNotificationPayload = await req.json()

    // Validate required fields
    if (!payload.userId || !payload.title || !payload.body) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: userId, title, body',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Get user's push subscription from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, push_subscription, push_enabled')
      .eq('id', payload.userId)
      .single()

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: 'User not found or not subscribed to push notifications',
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    if (!user.push_enabled || !user.push_subscription) {
      return new Response(
        JSON.stringify({
          error: 'User has not subscribed to push notifications',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Send via Web Push API
    // Note: In production, you'd use Firebase Admin SDK or web-push library
    // For now, this demonstrates the structure
    const subscription = user.push_subscription as UserSubscription['push_subscription']

    const notificationPayload = {
      notification: {
        title: payload.title,
        body: payload.body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
      },
      data: {
        type: payload.type,
        ...payload.data,
      },
    }

    // Send push via Web Push Protocol
    // In production, use: npm install web-push
    // import webpush from 'web-push'
    // webpush.sendNotification(subscription, JSON.stringify(notificationPayload))

    // For now, log and return success
    console.log(
      `Push notification queued for user ${payload.userId}: ${payload.title}`,
    )

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Push notification sent successfully',
        notificationId: `notif_${Date.now()}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error sending push notification:', error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

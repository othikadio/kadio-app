/**
 * Kadio Coiffure — TikTok OAuth2 Callback Handler
 * Endpoint: /api/callback-tiktok
 */

const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state, error: tiktokError, error_description } = req.query;

  if (tiktokError) {
    console.error('TikTok auth error:', tiktokError, error_description);
    return res.redirect('/app?tiktok_error=' + encodeURIComponent(error_description || tiktokError));
  }

  if (!code) {
    return res.redirect('/app?tiktok_error=missing_code');
  }

  try {
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://kadio.ca/api/callback-tiktok',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error('TikTok token exchange failed:', tokenData);
      return res.redirect('/app?tiktok_error=' + encodeURIComponent(tokenData.error_description || 'token_exchange_failed'));
    }

    const { access_token, refresh_token, expires_in, refresh_expires_in, open_id, scope } = tokenData;

    const userResponse = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,follower_count,following_count,likes_count,video_count',
      { headers: { Authorization: 'Bearer ' + access_token } }
    );

    const userData = await userResponse.json();
    const userInfo = userData?.data?.user || {};

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();
    const refreshExpiresAt = refresh_expires_in
      ? new Date(Date.now() + refresh_expires_in * 1000).toISOString()
      : null;

    const { error: dbError } = await supabase
      .from('social_connections')
      .upsert(
        {
          platform: 'tiktok',
          platform_user_id: open_id,
          access_token,
          refresh_token,
          token_expires_at: expiresAt,
          refresh_token_expires_at: refreshExpiresAt,
          scope,
          display_name: userInfo.display_name || null,
          avatar_url: userInfo.avatar_url || null,
          follower_count: userInfo.follower_count || 0,
          connected_at: now,
          updated_at: now,
          is_active: true,
        },
        { onConflict: 'platform,platform_user_id' }
      );

    if (dbError) {
      console.error('Supabase upsert error:', dbError);
    }

    console.log('TikTok connected: ' + (userInfo.display_name || open_id) + ' (' + userInfo.follower_count + ' followers)');
    return res.redirect('/app?tiktok_connected=true');
  } catch (err) {
    console.error('TikTok callback error:', err);
    return res.redirect('/app?tiktok_error=' + encodeURIComponent('server_error'));
  }
};

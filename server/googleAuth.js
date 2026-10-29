const SUPABASE_URL = (process.env.EXPO_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';

function adminHeaders() {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };
}

export async function verifyGoogleIdToken(idToken) {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error('invalid google id_token');
    err.status = 401;
    throw err;
  }
  const payload = await res.json();
  if (GOOGLE_CLIENT_ID && payload.aud !== GOOGLE_CLIENT_ID) {
    const err = new Error('google token audience mismatch');
    err.status = 401;
    throw err;
  }
  if (payload.email_verified !== 'true' && payload.email_verified !== true) {
    const err = new Error('google email not verified');
    err.status = 401;
    throw err;
  }
  return {
    email: String(payload.email || '').toLowerCase(),
    name: payload.name || '',
    picture: payload.picture || '',
    sub: payload.sub,
  };
}

async function ensureUser(profile) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({
      email: profile.email,
      email_confirm: true,
      user_metadata: {
        full_name: profile.name,
        avatar_url: profile.picture,
        provider: 'google',
      },
      app_metadata: {
        provider: 'google',
        providers: ['google'],
      },
    }),
  });
  const body = await res.json();
  if (res.ok) return body;

  const msg = `${body.msg || body.message || ''}`.toLowerCase();
  if (res.status === 422 || msg.includes('already') || msg.includes('registered')) {
    return { email: profile.email };
  }

  const err = new Error(body.msg || body.message || 'failed to create user');
  err.status = 500;
  throw err;
}

async function mintSession(email) {
  const linkRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({
      type: 'magiclink',
      email,
    }),
  });
  const linkBody = await linkRes.json();
  if (!linkRes.ok) {
    const err = new Error(linkBody.msg || linkBody.message || 'generate_link failed');
    err.status = 500;
    throw err;
  }

  const tokenHash =
    linkBody?.properties?.hashed_token ||
    linkBody?.hashed_token ||
    linkBody?.email_otp;

  if (!tokenHash) {
    const err = new Error('no token hash from generate_link');
    err.status = 500;
    throw err;
  }

  const verifyRes = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'magiclink',
      token_hash: tokenHash,
    }),
  });
  const sessionBody = await verifyRes.json();
  if (!verifyRes.ok) {
    // Fallback type used by some GoTrue versions
    const verify2 = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'email',
        token_hash: tokenHash,
      }),
    });
    const session2 = await verify2.json();
    if (!verify2.ok) {
      const err = new Error(
        sessionBody.error_description ||
          sessionBody.msg ||
          session2.msg ||
          'verify failed',
      );
      err.status = 500;
      throw err;
    }
    return session2;
  }
  return sessionBody;
}

export async function exchangeGoogleIdToken(idToken) {
  if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
    const err = new Error('supabase admin not configured');
    err.status = 500;
    throw err;
  }
  const profile = await verifyGoogleIdToken(idToken);
  if (!profile.email) {
    const err = new Error('google token missing email');
    err.status = 401;
    throw err;
  }
  await ensureUser(profile);
  const session = await mintSession(profile.email);
  return { profile, session };
}

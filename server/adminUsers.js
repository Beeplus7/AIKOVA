const SUPABASE_URL = (process.env.EXPO_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const CLAIM_SECRET = (process.env.ADMIN_CLAIM_SECRET || '').trim();

function adminHeaders() {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };
}

function isAdminUser(user) {
  if (!user) return false;
  const app = user.app_metadata || {};
  const meta = user.user_metadata || {};
  const roles = []
    .concat(app.roles || [])
    .concat(meta.roles || [])
    .map((r) => String(r).toLowerCase());
  return (
    app.role === 'admin' ||
    meta.role === 'admin' ||
    roles.includes('admin') ||
    app.access === 'admin'
  );
}

async function listAllUsers() {
  const users = [];
  let page = 1;
  for (;;) {
    const res = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=200`,
      { headers: adminHeaders() },
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const err = new Error(body.msg || body.message || 'failed to list users');
      err.status = res.status;
      throw err;
    }
    const body = await res.json();
    const batch = body.users || [];
    users.push(...batch);
    if (batch.length < 200) break;
    page += 1;
    if (page > 20) break;
  }
  return users;
}

export async function getAdminStatus() {
  const users = await listAllUsers();
  const admins = users.filter(isAdminUser);
  return {
    claimed: admins.length > 0,
    count: admins.length,
    claimOpen: admins.length === 0 || Boolean(CLAIM_SECRET),
  };
}

export async function listAdmins() {
  const users = await listAllUsers();
  return users.filter(isAdminUser).map((u) => ({
    id: u.id,
    email: u.email,
    full_name: u.user_metadata?.full_name || '',
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
  }));
}

async function passwordGrant(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok || !body.access_token) {
    const err = new Error(body.error_description || body.msg || 'login failed');
    err.status = 401;
    throw err;
  }
  return body;
}

async function createOrUpdateAdmin({ email, password, fullName, force = false }) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized || !normalized.includes('@')) {
    const err = new Error('valid email required');
    err.status = 400;
    throw err;
  }
  if (!password || String(password).length < 8) {
    const err = new Error('password must be at least 8 characters');
    err.status = 400;
    throw err;
  }

  const users = await listAllUsers();
  const existing = users.find((u) => (u.email || '').toLowerCase() === normalized);

  if (existing) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${existing.id}`, {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify({
        email: normalized,
        password,
        email_confirm: true,
        user_metadata: {
          ...(existing.user_metadata || {}),
          full_name: fullName || existing.user_metadata?.full_name || '',
          role: 'admin',
        },
        app_metadata: {
          ...(existing.app_metadata || {}),
          role: 'admin',
          roles: Array.from(
            new Set([].concat(existing.app_metadata?.roles || [], ['admin'])),
          ),
        },
      }),
    });
    const body = await res.json();
    if (!res.ok) {
      const err = new Error(body.msg || body.message || 'failed to update admin');
      err.status = res.status;
      throw err;
    }
    return { user: body, created: false };
  }

  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({
      email: normalized,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || '',
        role: 'admin',
      },
      app_metadata: {
        role: 'admin',
        roles: ['admin'],
        claimed: force,
      },
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    const err = new Error(body.msg || body.message || 'failed to create admin');
    err.status = res.status;
    throw err;
  }
  return { user: body, created: true };
}

export async function claimAdmin({ email, password, fullName, claimSecret }) {
  const status = await getAdminStatus();
  if (status.claimed) {
    if (!CLAIM_SECRET || claimSecret !== CLAIM_SECRET) {
      const err = new Error(
        'Admin already claimed. Sign in as an admin, or provide ADMIN_CLAIM_SECRET.',
      );
      err.status = 403;
      throw err;
    }
  } else if (CLAIM_SECRET && claimSecret && claimSecret !== CLAIM_SECRET) {
    const err = new Error('invalid claim secret');
    err.status = 403;
    throw err;
  }

  const result = await createOrUpdateAdmin({
    email,
    password,
    fullName,
    force: true,
  });
  const session = await passwordGrant(String(email).trim().toLowerCase(), password);
  return { ...result, session, status: await getAdminStatus() };
}

export async function createAdminByAdmin(requester, payload) {
  if (!isAdminUser(requester)) {
    const err = new Error('admin access required');
    err.status = 403;
    throw err;
  }
  const result = await createOrUpdateAdmin(payload);
  return { ...result, admins: await listAdmins() };
}

export { isAdminUser };

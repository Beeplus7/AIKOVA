import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import {
  createRecord,
  deleteRecord,
  listRecords,
  replaceRecord,
} from './db.js';
import { exchangeGoogleIdToken } from './googleAuth.js';

const PORT = Number(process.env.CRM_API_PORT || 3015);
const SUPABASE_URL = (process.env.EXPO_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const ALLOWED = (
  process.env.CRM_CORS_ORIGINS ||
  'https://aikova.co.uk,http://localhost:8081,http://127.0.0.1:8081'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const app = express();
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || ALLOWED.includes(origin) || ALLOWED.includes('*')) {
        return cb(null, true);
      }
      return cb(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));

async function verifySupabaseUser(token) {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

async function requireUser(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    if (process.env.CRM_ALLOW_ANON === '1') {
      req.user = null;
      return next();
    }
    return res.status(401).json({ error: 'missing bearer token' });
  }

  try {
    const user = await verifySupabaseUser(token);
    if (!user?.id) {
      return res.status(401).json({ error: 'invalid session' });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'auth verify failed' });
  }
}

async function handleActions(req, res) {
  try {
    const { action, args = {} } = req.body || {};
    if (!action) return res.status(400).json({ error: 'action required' });

    if (action === 'records.list') {
      return res.json({
        data: listRecords(String(args.collection || ''), Number(args.limit || 100)),
      });
    }
    if (action === 'records.create') {
      return res.json({
        data: createRecord(
          String(args.collection || ''),
          args.value,
          args.idempotency_key,
          args.id,
        ),
      });
    }
    if (action === 'records.replace') {
      return res.json({
        data: replaceRecord(
          String(args.collection || ''),
          String(args.id || ''),
          args.value,
        ),
      });
    }
    if (action === 'records.delete') {
      return res.json({
        data: deleteRecord(String(args.collection || ''), String(args.id || '')),
      });
    }

    return res.status(400).json({ error: `unknown action: ${action}` });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'server error' });
  }
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'aikova-crm-api',
    supabaseUrl: Boolean(SUPABASE_URL),
    google: Boolean(
      process.env.GOOGLE_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    ),
    time: new Date().toISOString(),
  });
});

app.post('/auth/google', async (req, res) => {
  try {
    const idToken = req.body?.id_token || req.body?.credential;
    if (!idToken) {
      return res.status(400).json({ error: 'id_token required' });
    }
    const { session, profile } = await exchangeGoogleIdToken(idToken);
    return res.json({
      data: {
        email: profile.email,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
        token_type: session.token_type || 'bearer',
        user: session.user,
      },
    });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'google auth failed' });
  }
});

app.post('/actions', requireUser, handleActions);
app.post('/api/actions', requireUser, handleActions);

app.listen(PORT, '127.0.0.1', () => {
  console.log(`AiKOVA CRM API on 127.0.0.1:${PORT}`);
});

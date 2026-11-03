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
import {
  claimAdmin,
  createAdminByAdmin,
  getAdminStatus,
  isAdminUser,
  listAdmins,
} from './adminUsers.js';

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

async function requireAdmin(req, res, next) {
  await requireUser(req, res, async () => {
    if (!isAdminUser(req.user)) {
      return res.status(403).json({ error: 'admin access required' });
    }
    return next();
  });
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

app.get('/auth/admins/status', async (_req, res) => {
  try {
    const data = await getAdminStatus();
    return res.json({ data });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'status failed' });
  }
});

app.post('/auth/claim-admin', async (req, res) => {
  try {
    const { email, password, full_name, claim_secret } = req.body || {};
    const data = await claimAdmin({
      email,
      password,
      fullName: full_name,
      claimSecret: claim_secret,
    });
    return res.json({
      data: {
        created: data.created,
        email: data.user?.email || email,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        user: data.session.user,
        status: data.status,
      },
    });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'claim failed' });
  }
});

app.get('/auth/admins', requireAdmin, async (_req, res) => {
  try {
    const data = await listAdmins();
    return res.json({ data });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'list failed' });
  }
});

app.post('/auth/admins', requireAdmin, async (req, res) => {
  try {
    const { email, password, full_name } = req.body || {};
    const data = await createAdminByAdmin(req.user, {
      email,
      password,
      fullName: full_name,
    });
    return res.json({
      data: {
        created: data.created,
        email: data.user?.email || email,
        admins: data.admins,
      },
    });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'create failed' });
  }
});

app.post('/actions', requireUser, handleActions);
app.post('/api/actions', requireUser, handleActions);

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MCL_INTERESTS = new Set([
  'cloud',
  'payments',
  'industrial',
  'ai-production',
  'receptionist',
  'myface',
  'fintech',
  'other',
]);
const MCL_URGENCY = new Set(['p1', 'p2', 'explore']);
const mclRate = new Map(); // ip -> { count, resetAt }

function mclClientIp(req) {
  const xf = String(req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim();
  return xf || req.socket?.remoteAddress || 'unknown';
}

function mclRateLimit(ip) {
  const now = Date.now();
  const row = mclRate.get(ip);
  if (!row || row.resetAt < now) {
    mclRate.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (row.count >= 12) return false;
  row.count += 1;
  return true;
}

async function sendMclEmails({ name, email, interest, urgency, sourcePage, leadId }) {
  const key = process.env.RESEND_API_KEY || '';
  if (!key) return { skipped: true };
  const from = process.env.FROM_EMAIL || 'AiKOVA <hello@aikova.co.uk>';
  const notifyTo = process.env.MCL_NOTIFY_EMAIL || 'hello@aikova.co.uk';
  const first = (name.split(/\s+/)[0] || 'there');
  const interestLabel = interest || 'general enquiry';
  const confirmHtml = `<p>Hi ${first},</p><p>Thanks for reaching out to AiKOVA about <strong>${interestLabel}</strong>. A senior engineer will follow up shortly.</p><p>Meanwhile: <a href="https://aikova.co.uk/portfolio">Portfolio OS</a> · <a href="https://aikova.co.uk/llms.txt">llms.txt</a></p><p>— AiKOVA Engineering Vault · Oldham OL8</p>`;
  const notifyHtml = `<p>New MCL Bot lead</p><ul><li>Name: ${name}</li><li>Email: ${email}</li><li>Interest: ${interestLabel}</li><li>Urgency: ${urgency || 'n/a'}</li><li>Page: ${sourcePage || '/'}</li><li>ID: ${leadId}</li></ul>`;

  async function send(to, subject, html) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`resend ${res.status}: ${text}`);
    }
  }

  await send(email, 'We got your details — AiKOVA', confirmHtml);
  try {
    await send(notifyTo, `MCL lead: ${name} · ${interestLabel}`, notifyHtml);
  } catch (err) {
    console.error('[mcl-capture-lead] notify email failed', err.message || err);
  }
  return { skipped: false };
}

/** Public Marketing Capture Lead endpoint (no auth). Honeypot + light rate limit. */
app.post('/api/mcl-capture-lead', async (req, res) => {
  try {
    const ip = mclClientIp(req);
    if (!mclRateLimit(ip)) {
      return res.status(429).json({ success: false, error: 'Too many requests. Try again later.' });
    }

    const body = req.body || {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const company = typeof body.company === 'string' ? body.company.trim().slice(0, 200) : '';
    const interestRaw = typeof body.interest === 'string' ? body.interest.trim() : '';
    const interest = MCL_INTERESTS.has(interestRaw) ? interestRaw : 'other';
    const urgencyRaw = typeof body.urgency === 'string' ? body.urgency.trim() : '';
    const urgency = MCL_URGENCY.has(urgencyRaw) ? urgencyRaw : 'explore';
    const sourcePage =
      typeof body.source_page === 'string' ? body.source_page.trim().slice(0, 300) : '/';
    const honeypot = typeof body.website === 'string' ? body.website.trim() : '';

    if (!name || name.length > 200) {
      return res.status(400).json({ success: false, error: 'Please enter your name.' });
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 320) {
      return res
        .status(400)
        .json({ success: false, error: 'Please enter a valid email address.' });
    }

    if (honeypot) {
      console.log(`[mcl-capture-lead] honeypot drop email=${email}`);
      return res.json({ success: true });
    }

    const interestLabels = {
      cloud: 'Cloud OS',
      payments: 'Payment OS',
      industrial: 'Industrial / Garage OS',
      'ai-production': 'AI Production (ReelStorm)',
      receptionist: 'AI Receptionist',
      myface: 'MyFace Profile',
      fintech: 'TradeFlow FinTech',
      other: 'Other / not sure',
    };

    const leadValue = {
      companyName: company || name,
      contactName: name,
      email,
      address: company ? `${company}` : '',
      postcode: '',
      postcodeArea: 'MCL',
      phone: '',
      motClasses: interestLabels[interest] || interest,
      companiesHouseStatus: 'Active',
      score: urgency === 'p1' ? 92 : urgency === 'p2' ? 78 : 65,
      aiIcebreaker: `MCL Bot · ${name} interested in ${interestLabels[interest] || interest} (${urgency}). Reply to ${email}.`,
      status: 'New',
      source: 'MCL Bot',
      interest,
      urgency,
      source_page: sourcePage,
      capturedAt: new Date().toISOString(),
    };

    const record = createRecord(
      'leads',
      leadValue,
      `mcl:${email}:${interest}:${sourcePage}`.slice(0, 180),
    );

    try {
      await sendMclEmails({
        name,
        email,
        interest: interestLabels[interest] || interest,
        urgency,
        sourcePage,
        leadId: record.id,
      });
    } catch (emailErr) {
      console.error('[mcl-capture-lead] email failed', emailErr.message || emailErr);
    }

    return res.json({ success: true, id: record.id });
  } catch (err) {
    console.error('[mcl-capture-lead]', err);
    return res
      .status(500)
      .json({ success: false, error: err.message || 'Could not save your details.' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`AiKOVA CRM API on 127.0.0.1:${PORT}`);
});

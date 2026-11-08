/** Project readiness blueprints — AI Receptionist mirrors ai-receptionist.aikova.co.uk/readiness */

export type ReadinessStatus = 'DONE' | 'WIP' | 'TODO';

export type ReadinessItem = {
  id: string;
  label: string;
  pct: number;
  status: ReadinessStatus;
  desc?: string;
  left?: string;
  href?: string;
};

export type ReadinessPhase = {
  title: string;
  pct: number;
  items: ReadinessItem[];
};

export type ProjectReadiness = {
  name: string;
  liveUrl?: string;
  liveApi?: string;
  summary: string;
  color: string;
  overall: number;
  circles: { label: string; pct: number; sub: string }[];
  leftNow: { pri: number; title: string; detail: string }[];
  phases: ReadinessPhase[];
};

const receptionistPhases: ReadinessPhase[] = [
  {
    title: 'A • Marketing Site (Public)',
    pct: 100,
    items: [
      { id: 'm-af', label: 'Africa OS · 11 pages', pct: 100, status: 'DONE', href: 'https://ai-receptionist.aikova.co.uk/', desc: 'Hero · Features · Pricing · GetStarted live on /' },
      { id: 'm-eu', label: 'Eurozone OS · /eu', pct: 100, status: 'DONE', href: 'https://ai-receptionist.aikova.co.uk/eu', desc: 'GDPR VAT · restaurant/clinic/salon surfaces' },
      { id: 'm-try', label: 'Instant try desk (no signup)', pct: 100, status: 'DONE', href: 'https://ai-receptionist.aikova.co.uk/try', desc: 'Chat + Voice · multi-lang' },
      { id: 'm-seo', label: 'Meta AI / Open Graph crawlability', pct: 100, status: 'DONE', desc: 'OG + Twitter + JSON-LD + robots/sitemap' },
    ],
  },
  {
    title: 'B • Phase 1 Onboarding 8 Steps',
    pct: 100,
    items: [
      { id: 'on-combo', label: 'Dual-mode onboarding artefact', pct: 100, status: 'DONE', href: 'https://ai-receptionist.aikova.co.uk/onboarding', desc: 'Website scrape · GBP · docs · voice · calendar · test-call' },
      { id: 'on-region', label: 'RegionContext + adapters', pct: 100, status: 'DONE', desc: 'Africa | Eurozone | UK doors · companion memory' },
    ],
  },
  {
    title: 'B • Gift Dashboard / Inbox',
    pct: 97,
    items: [
      { id: 'dash-inbox', label: '/app/inbox · Gift UPRM', pct: 98, status: 'DONE', href: 'https://ai-receptionist.aikova.co.uk/app/inbox' },
      { id: 'dash-bot', label: 'AI Companion Bot + brain-rag', pct: 94, status: 'DONE', left: 'LLM quality needs OPENAI/ANTHROPIC keys' },
    ],
  },
  {
    title: 'B • Phase 3 Modules',
    pct: 96,
    items: [
      { id: 'p3-agent', label: 'Conversation Studio', pct: 85, status: 'DONE', href: 'https://ai-receptionist.aikova.co.uk/app/agent', left: 'Wire inbound + Instant Try to agent_config LLM' },
      { id: 'p3-bill', label: 'Billing · AKC + Stripe', pct: 98, status: 'DONE', href: 'https://ai-receptionist.aikova.co.uk/app/billing' },
      { id: 'p3-auth', label: 'Supabase Auth + Google', pct: 98, status: 'DONE' },
      { id: 'p3-voices', label: 'Voice Mesh library', pct: 90, status: 'DONE', left: 'Studio TTS needs ElevenLabs/Coqui keys' },
    ],
  },
  {
    title: 'Main Engine / Infra',
    pct: 93,
    items: [
      { id: 'eng-web', label: 'Vite SPA + nginx + VPS', pct: 100, status: 'DONE', desc: 'ai-receptionist.aikova.co.uk live' },
      { id: 'eng-edge', label: '13 Edge Functions ACTIVE', pct: 100, status: 'DONE', left: 'OPENAI / AT / studio TTS flip stubs to live' },
      { id: 'eng-tel', label: 'Twilio instant-try dial path', pct: 88, status: 'DONE', left: 'Upgrade Twilio to Full · TWILIO_PHONE_NUMBER' },
      { id: 'eng-speech', label: 'STT + studio TTS', pct: 72, status: 'WIP', left: 'OPENAI Whisper + ELEVENLABS or COQUI' },
      { id: 'eng-brain', label: 'Brain RAG', pct: 85, status: 'DONE', left: 'OPENAI + optional ANTHROPIC + Qdrant' },
    ],
  },
  {
    title: 'External APIs — First E2E PASS',
    pct: 58,
    items: [
      { id: 'api-sb', label: 'Supabase backbone', pct: 100, status: 'DONE' },
      { id: 'api-oai', label: 'OpenAI (Whisper + GPT-4o)', pct: 0, status: 'TODO', left: 'OPENAI_API_KEY required for brain/STT PASS' },
      { id: 'api-tts', label: 'TTS (Polly on try · studio pending)', pct: 55, status: 'WIP', left: 'ELEVENLABS or COQUI for Voice Mesh' },
      { id: 'api-tel', label: 'Telephony Twilio wired', pct: 70, status: 'WIP', left: 'Trial → Full · set TWILIO_PHONE_NUMBER' },
      { id: 'api-stripe', label: 'Stripe AKC Checkout', pct: 95, status: 'DONE' },
      { id: 'api-google', label: 'Google OAuth', pct: 95, status: 'DONE' },
    ],
  },
];

function overallFromPhases(phases: ReadinessPhase[]): number {
  if (!phases.length) return 0;
  return Math.round(phases.reduce((s, p) => s + p.pct, 0) / phases.length);
}

function genericPhases(
  name: string,
  progress: number,
  extras: { left?: string[]; modules?: string[] } = {},
): ReadinessPhase[] {
  const p = Math.max(0, Math.min(100, progress));
  const discovery = Math.min(100, p + 18);
  const build = p;
  const qa = Math.max(0, p - 12);
  const launch = Math.max(0, p - 25);
  const modules = extras.modules || ['Core product', 'Integrations', 'Billing', 'Client portal'];
  return [
    {
      title: 'A • Discovery & Scope',
      pct: discovery,
      items: [
        { id: `${name}-disc`, label: 'SOW + architecture locked', pct: discovery, status: discovery >= 90 ? 'DONE' : discovery >= 50 ? 'WIP' : 'TODO' },
        { id: `${name}-comp`, label: 'Compliance / DOS7 evidence map', pct: Math.min(100, discovery - 5), status: discovery >= 80 ? 'DONE' : 'WIP' },
      ],
    },
    {
      title: 'B • Build modules',
      pct: build,
      items: modules.map((m, i) => ({
        id: `${name}-m${i}`,
        label: m,
        pct: Math.max(0, Math.min(100, build - i * 4)),
        status: (build - i * 4) >= 85 ? 'DONE' : (build - i * 4) >= 40 ? 'WIP' : 'TODO' as ReadinessStatus,
      })),
    },
    {
      title: 'C • QA / Staging',
      pct: qa,
      items: [
        { id: `${name}-qa`, label: 'Staging smoke + regression', pct: qa, status: qa >= 85 ? 'DONE' : qa >= 40 ? 'WIP' : 'TODO' },
        { id: `${name}-sla`, label: 'SLA / monitoring hooks', pct: Math.max(0, qa - 10), status: qa >= 70 ? 'WIP' : 'TODO' },
      ],
    },
    {
      title: 'D • Launch & revenue',
      pct: launch,
      items: [
        { id: `${name}-go`, label: 'Go-live checklist', pct: launch, status: launch >= 85 ? 'DONE' : launch >= 40 ? 'WIP' : 'TODO', left: extras.left?.[0] },
        { id: `${name}-bill`, label: 'Billing / retainer live', pct: Math.max(0, launch - 8), status: launch >= 70 ? 'WIP' : 'TODO' },
      ],
    },
  ];
}

const AI_RECEPTIONIST: ProjectReadiness = {
  name: 'AI Receptionist',
  liveUrl: 'https://ai-receptionist.aikova.co.uk/readiness',
  liveApi: '/api/receptionist-readiness',
  summary:
    'Honest scan of ai-receptionist.aikova.co.uk. Non-key gaps closed — try desk, Meta crawl, Twilio wiring, Stripe test, 13 edge functions. Left: OpenAI, studio TTS, optional Africa’s Talking.',
  color: '#2962FF',
  overall: overallFromPhases(receptionistPhases),
  circles: [
    { label: 'Overall', pct: overallFromPhases(receptionistPhases), sub: 'Weighted phases' },
    { label: 'Marketing', pct: 100, sub: 'Try + OG crawl' },
    { label: 'Onboarding', pct: 100, sub: '8 steps live' },
    { label: 'Gift Inbox', pct: 97, sub: 'Sync + seed' },
    { label: 'Phase 3', pct: 96, sub: 'CRUD + Stripe' },
    { label: 'Engine', pct: 93, sub: '13 fns ACTIVE' },
    { label: 'E2E APIs', pct: 58, sub: 'OpenAI/TTS left' },
  ],
  leftNow: [
    {
      pri: 1,
      title: 'Your keys still required',
      detail: 'OPENAI_API_KEY · ELEVENLABS or COQUI_TTS_URL · optional AFRICAS_TALKING_*',
    },
    {
      pri: 2,
      title: 'Upgrade Twilio to Full (Instant Try rings)',
      detail: 'Trial blocks public Instant Try dials. Upgrade → set TWILIO_PHONE_NUMBER. SID/TOKEN already in secrets.',
    },
    {
      pri: 3,
      title: 'Optional later',
      detail: 'Meta Graph · M-Pesa live · Stripe live keys · Calendar OAuth · Redis · Qdrant · Anthropic',
    },
  ],
  phases: receptionistPhases,
};

function pack(
  name: string,
  color: string,
  progress: number,
  summary: string,
  opts: { left?: { pri: number; title: string; detail: string }[]; modules?: string[]; liveUrl?: string } = {},
): ProjectReadiness {
  const phases = genericPhases(name, progress, {
    left: opts.left?.map((l) => l.detail),
    modules: opts.modules,
  });
  const overall = overallFromPhases(phases);
  return {
    name,
    color,
    liveUrl: opts.liveUrl,
    summary,
    overall,
    circles: [
      { label: 'Overall', pct: overall, sub: 'Weighted' },
      { label: 'Discovery', pct: phases[0].pct, sub: 'Scope' },
      { label: 'Build', pct: phases[1].pct, sub: 'Modules' },
      { label: 'QA', pct: phases[2].pct, sub: 'Staging' },
      { label: 'Launch', pct: phases[3].pct, sub: 'Go-live' },
    ],
    leftNow: opts.left || [
      { pri: 1, title: 'Close WIP modules', detail: `Drive ${name} build from ${progress}% toward go-live.` },
      { pri: 2, title: 'Evidence vault', detail: 'Keep DOS7 engagement + ticket evidence linked.' },
    ],
    phases,
  };
}

export const PROJECT_READINESS: Record<string, ProjectReadiness> = {
  'AI Receptionist': AI_RECEPTIONIST,
  'VisaGuide OS': pack(
    'VisaGuide OS',
    '#0EA5FF',
    82,
    '12 OS immigration advisory engine — advisory flows, payments, multi-country compliance.',
    {
      modules: ['12 OS flows', 'Advisory engine', 'Payments', 'Admin CRM sync'],
      left: [
        { pri: 1, title: 'Flow audit remaining', detail: 'VISA-44 · 12 OS flow audit still open on Tickets.' },
        { pri: 2, title: 'MRR hardening', detail: 'Lock £20K MRR renewals + evidence pack for DOS7.' },
      ],
    },
  ),
  ReelStorm: pack(
    'ReelStorm',
    '#FFD700',
    64,
    '18-room UE5.8 virtual production OS — lighting, room control, studio retainer delivery.',
    {
      modules: ['UE5.8 rooms', 'Lighting control', 'Studio booking', 'Asset pipeline'],
      left: [
        { pri: 1, title: 'Room 12 lighting', detail: 'REEL ticket · finish lighting pass then staging review.' },
        { pri: 2, title: 'Retainer milestones', detail: 'Align studio retainer invoices to room completion.' },
      ],
    },
  ),
  'Vexo Garage': pack(
    'Vexo Garage',
    '#84FF3D',
    76,
    'DVSA MOT booking + AVA — Class 4/7, SMS reminders, Companies House enrich.',
    {
      modules: ['DVSA importer', 'Booking widget', 'AVA receptionist', 'SMS reminders', 'TradeFlow link'],
      left: [
        { pri: 1, title: 'DVSA history API', detail: 'VEXO-102 in progress — Critical SLA.' },
        { pri: 2, title: 'SMS MOT templates', detail: 'VEXO-103 SES/S3 template still To Do.' },
      ],
    },
  ),
  'TradeFlow OS': pack(
    'TradeFlow OS',
    '#A78BFA',
    71,
    'Guardian 8/15/25% margin engine + parts flow for garage networks.',
    {
      modules: ['Guardian logic', 'Parts flow', 'Margin ledger', 'Multi-site'],
      left: [
        { pri: 1, title: 'Guardian 15% logic', detail: 'TRADE-21 in progress — complete before Review.' },
      ],
    },
  ),
  'Arole Adjo': pack(
    'Arole Adjo',
    '#F472B6',
    58,
    'Creator OS — bookings & CRM for talent / brand partnerships.',
    {
      modules: ['Bookings', 'Creator CRM', 'Payouts', 'Portal'],
      left: [
        { pri: 1, title: 'Core booking path', detail: 'Finish booking → CRM sync before public pilot.' },
      ],
    },
  ),
  'Road Angel': pack(
    'Road Angel',
    '#FBBF24',
    45,
    'ADAS calibration logging OS for automotive workshops.',
    {
      modules: ['Calibration log', 'Device ingest', 'Evidence export', 'Workshop portal'],
      left: [
        { pri: 1, title: 'ADAS calibration log', detail: 'ROAD-07 still To Do — unblock logging schema.' },
      ],
    },
  ),
  'MyFace Profile': pack(
    'MyFace Profile',
    '#8FFF4A',
    52,
    'Work Social OS — SHOW · CONNECT · GROW. Pilot OL1 waitlist.',
    {
      modules: ['Profile graph', 'Connect graph', 'Growth loops', 'MFC waitlist'],
      left: [
        { pri: 1, title: 'Pilot OL1', detail: 'Stabilize waitlist → profile publish path.' },
      ],
    },
  ),
};

export function getProjectReadiness(
  name: string,
  fallback?: { progress: number; color: string; desc: string },
): ProjectReadiness {
  if (PROJECT_READINESS[name]) return PROJECT_READINESS[name];
  return pack(
    name,
    fallback?.color || '#0EA5FF',
    fallback?.progress ?? 50,
    fallback?.desc || `${name} delivery readiness.`,
  );
}

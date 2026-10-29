/** AiKOVA Project Companion — Visaguide-style adaptive Q&A for SaaS job prescription. */

export type CompanionAnswerMap = Record<string, string | string[]>;

export type CompanionQuestion = {
  id: string;
  prompt: string;
  hint?: string;
  kind: 'text' | 'long' | 'choice' | 'multi';
  options?: string[];
  required?: boolean;
  /** Skip if predicate returns false based on answers so far */
  when?: (answers: CompanionAnswerMap) => boolean;
};

export type ProjectBlueprint = {
  title: string;
  type: string;
  jobPrescription: string;
  problem: string;
  users: string;
  workflows: string[];
  integrations: string[];
  compliance: string[];
  budget: string;
  timeline: string;
  successMetric: string;
  notes: string;
  company: string;
  description: string;
  assessment: {
    architecture: string;
    stack: string[];
    estimate: string;
    team: string;
    timeline: string;
    risks: string[];
    jobScore: number;
  };
};

export const COMPANION_QUESTIONS: CompanionQuestion[] = [
  {
    id: 'intent',
    prompt: 'What are we scoping together today?',
    hint: 'Pick the closest match — AVA will tailor the rest like AssessmentOS.',
    kind: 'choice',
    options: [
      'New SaaS product',
      'AI companion / agent',
      'Industrial / ops software',
      'Marketplace / platform',
      'Upgrade existing product',
      'Emergency fix',
    ],
    required: true,
  },
  {
    id: 'company',
    prompt: 'What should we call the product or company?',
    hint: 'Working name is fine — we can refine later.',
    kind: 'text',
    required: true,
  },
  {
    id: 'job',
    prompt: 'Who is the primary user — and what job are they hiring this software to do?',
    hint: 'Job prescription e.g. “Garage owners booking Class 4/7 MOTs without phone tag.”',
    kind: 'long',
    required: true,
  },
  {
    id: 'problem',
    prompt: 'What breaks or burns time today without this?',
    hint: 'Be concrete: missed bookings, manual CSV, compliance gaps…',
    kind: 'long',
    required: true,
  },
  {
    id: 'users',
    prompt: 'Who else touches the system day-to-day?',
    hint: 'Roles, not names — admins, technicians, customers, finance…',
    kind: 'text',
    required: true,
  },
  {
    id: 'workflows',
    prompt: 'Which workflows must ship in v1?',
    hint: 'Select all that apply.',
    kind: 'multi',
    options: [
      'Onboarding / KYC',
      'Bookings / scheduling',
      'Payments / billing',
      'CRM / pipeline',
      'Chat / AVA companion',
      'Admin console',
      'Client portal',
      'Evidence / compliance vault',
      'Notifications (email/SMS/WhatsApp)',
      'Analytics dashboard',
      'API / integrations hub',
      'Mobile-friendly PWA',
    ],
    required: true,
  },
  {
    id: 'integrations',
    prompt: 'Any systems we must connect to?',
    hint: 'Select all that apply — or skip if greenfield.',
    kind: 'multi',
    options: [
      'Stripe',
      'Supabase / Postgres',
      'Companies House',
      'DVSA / gov data',
      'Odoo / ERP',
      'WhatsApp / SNS',
      'GOV.UK Notify',
      'Linear / Jira',
      'S3 / file vault',
      'None yet',
    ],
  },
  {
    id: 'compliance',
    prompt: 'Any compliance or standards this must respect?',
    kind: 'multi',
    options: [
      'ISO 27001',
      'PCI DSS',
      'Cyber Essentials',
      'GDPR',
      'GOV.UK service standard',
      'WCAG 2.2 AA',
      'None / unsure',
    ],
  },
  {
    id: 'budget',
    prompt: 'What investment band feels right for this build?',
    kind: 'choice',
    options: [
      '£15k–30k',
      '£30k–60k',
      '£60k+',
      'Retainer £3k–10k/mo',
      'Emergency (2hr response)',
    ],
    required: true,
  },
  {
    id: 'timeline',
    prompt: 'When do you need a first usable release?',
    kind: 'choice',
    options: ['ASAP', '1–3 months', '3–6 months', '12-month partnership'],
    required: true,
  },
  {
    id: 'success',
    prompt: 'What does success look like in 90 days?',
    hint: 'One sentence metric — revenue, time saved, go-live, users onboarded…',
    kind: 'long',
    required: true,
  },
  {
    id: 'notes',
    prompt: 'Anything else AVA / Captain should know before we file this?',
    hint: 'Optional — constraints, brand, competitors, must-avoid.',
    kind: 'long',
  },
];

export function activeQuestions(answers: CompanionAnswerMap): CompanionQuestion[] {
  return COMPANION_QUESTIONS.filter((q) => !q.when || q.when(answers));
}

export function firstNameFrom(label: string, email?: string | null): string {
  const raw = (label || '').trim();
  if (raw && !raw.includes('@')) {
    const part = raw.split(/[\s._-]+/)[0];
    if (part) return part.charAt(0).toUpperCase() + part.slice(1);
  }
  const local = (email || '').split('@')[0] || 'there';
  const part = local.split(/[._-]+/)[0] || 'there';
  return part.charAt(0).toUpperCase() + part.slice(1);
}

export function buildBlueprint(
  answers: CompanionAnswerMap,
  clientLabel: string,
): ProjectBlueprint {
  const asText = (id: string) =>
    Array.isArray(answers[id]) ? (answers[id] as string[]).join(', ') : String(answers[id] || '');
  const asList = (id: string) =>
    Array.isArray(answers[id])
      ? (answers[id] as string[]).filter(Boolean)
      : String(answers[id] || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

  const intent = asText('intent') || 'New SaaS product';
  const company = asText('company') || clientLabel;
  const job = asText('job');
  const problem = asText('problem');
  const users = asText('users');
  const workflows = asList('workflows');
  const integrations = asList('integrations').filter((x) => x !== 'None yet');
  const compliance = asList('compliance').filter((x) => x !== 'None / unsure');
  const budget = asText('budget') || '£30k–60k';
  const timeline = asText('timeline') || '1–3 months';
  const success = asText('success');
  const notes = asText('notes');

  const type =
    intent.includes('AI')
      ? 'AI & Data'
      : intent.includes('Industrial')
        ? 'Industrial Software'
        : intent.includes('Payment') || intent.includes('Marketplace')
          ? 'Cloud Development'
          : intent.includes('Emergency')
            ? 'Emergency Fix'
            : intent.includes('Upgrade')
              ? 'Upgrade'
              : 'Custom Software';

  const stack =
    type === 'AI & Data'
      ? ['Next.js', 'Python', 'LangGraph', 'Postgres', 'S3']
      : intent.includes('Industrial')
        ? ['Next.js', 'Postgres', 'OPC-UA', 'S3', 'Evidence vault']
        : ['Next.js', 'Postgres', 'Supabase Auth', 'S3', 'Stripe', 'AVA'];

  const architecture =
    type === 'AI & Data'
      ? 'Conversational companion + tool-calling agents over a Postgres source of truth, with Admin CRM and Client portal mirrors.'
      : intent.includes('Industrial')
        ? 'Ops workstation OS with evidence vault, role gates, and integration adapters for field systems.'
        : 'SaaS OS: Client portal + Admin CRM + AVA companion, Stripe billing, S3 vault, and job-prescription workflows.';

  const jobScore = Math.min(
    98,
    55 +
      (job.length > 40 ? 10 : 5) +
      (workflows.length >= 4 ? 10 : workflows.length * 2) +
      (integrations.length ? 8 : 0) +
      (compliance.length ? 5 : 0) +
      (success.length > 20 ? 5 : 0),
  );

  const description = [
    `Job prescription: ${job}`,
    `Problem today: ${problem}`,
    `Users / roles: ${users}`,
    workflows.length ? `V1 workflows: ${workflows.join(', ')}` : '',
    integrations.length ? `Integrations: ${integrations.join(', ')}` : '',
    compliance.length ? `Compliance: ${compliance.join(', ')}` : '',
    success ? `90-day success: ${success}` : '',
    notes ? `Notes: ${notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    title: `${company} — ${intent}`,
    type,
    jobPrescription: job,
    problem,
    users,
    workflows,
    integrations,
    compliance,
    budget,
    timeline,
    successMetric: success,
    notes,
    company,
    description,
    assessment: {
      architecture,
      stack,
      estimate: budget.includes('Emergency') ? '£2.4k — 2hr triage + 24hr fix' : budget,
      team: budget.includes('£60k') ? 'Captain + 2 senior devs + QA' : 'Captain + senior dev',
      timeline: timeline === 'ASAP' ? '48hr proposal, 1-week kickoff' : timeline,
      risks: [
        'Scope creep on v1 workflows',
        'Integration latency / rate limits',
        'Compliance evidence incomplete at kickoff',
      ],
      jobScore,
    },
  };
}

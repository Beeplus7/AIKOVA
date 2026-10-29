import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'expo-router';
import logoAsset from './assets/75dfc9f884f0c38d-99630AD0-413D-439B-8A63-79E5B44A9CBA.png';
import { crmAction } from '../lib/crmApi';
import { useAuth } from '../lib/auth/AuthProvider';
import ProjectCompanionOnboarding from './ProjectCompanionOnboarding.web';
import { firstNameFrom } from './projectCompanion';

const logoUrl =
  typeof logoAsset === 'string'
    ? logoAsset
    : ((logoAsset as { uri?: string } | null)?.uri ?? '');

// Types
type Project = {
  id: string;
  name: string;
  client: string;
  progress: number;
  status: 'In Progress' | 'Review' | 'Done' | 'Planning';
  tech: string[];
  team: string[];
  start: string;
  golive: string;
  tickets: number;
  lastUpdate: string;
  deliverables: string[];
  scope: string;
};

type Ticket = {
  id: string;
  title: string;
  project: string;
  priority: 'P1' | 'P2' | 'P3';
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  assignee: string;
  due: string;
  description: string;
};

type ProjectRequest = {
  id: string;
  title: string;
  type: string;
  description: string;
  budget: string;
  timeline: string;
  compliance: string[];
  status: 'Pending' | 'Submitted' | 'Under Review' | 'Accepted' | 'Proposal Sent' | 'In Progress' | 'Rejected';
  created: string;
  assessment?: {
    architecture: string;
    stack: string[];
    estimate: string;
    team: string;
    timeline: string;
    risks: string[];
  };
};

type ChatMsg = {
  id: string;
  role: 'user' | 'ava' | 'captain';
  text: string;
  time: string;
};

const PROJECT_TYPES = ['Cloud Development','Payment Integration','Industrial Software','Custom Software','Enterprise','AI & Data','Emergency Fix','Upgrade'];
const BUDGETS = ['£15k-30k','£30k-60k','£60k+','Retainer £3k-10k/mo','Emergency (2hr response)'];
const TIMELINES = ['ASAP','1-3 months','3-6 months','12-month partnership'];
const COMPLIANCE = ['ISO 27001','PCI DSS','Cyber Essentials','HIPAA','GOV.UK','CQC'];

const MOCK_PROJECTS: Project[] = [
  {
    id: 'vexo-001',
    name: 'Vexo Garage OS',
    client: 'Oldham MOT Centre',
    progress: 73,
    status: 'In Progress',
    tech: ['DVSA gov 23K','Companies House','Odoo 17','Stripe','WhatsApp SNS','Postgres','Next.js'],
    team: ['Captain','Senior Dev — Platform','Senior Dev — DVSA'],
    start: 'Jan 2026',
    golive: 'Mar 2026',
    tickets: 3,
    lastUpdate: '2h ago — DVSA CSV importer optimized',
    deliverables: ['DVSA CSV Importer','Lead Scoring Engine','Onboarding Portal','Booking OS','MOT Reminder SMS','Evidence Vault'],
    scope: 'Full garage management + MOT booking OS with DVSA compliance, automated reminders, and Odoo finance sync. Built for multi-site MOT centre operations.'
  },
  {
    id: 'vexo-002',
    name: 'Vexo Analytics',
    client: 'Oldham MOT Centre',
    progress: 31,
    status: 'Planning',
    tech: ['ClickHouse','Metabase','Odoo','GOV.UK Notify'],
    team: ['Captain','Data Engineer'],
    start: 'Feb 2026',
    golive: 'Apr 2026',
    tickets: 1,
    lastUpdate: 'Yesterday — Scope finalized',
    deliverables: ['Revenue Dashboard','Technician Performance','MOT Failure Predictions'],
    scope: 'Real-time analytics layer for Vexo Garage OS — revenue, utilization, MOT failure prediction.'
  }
];

const MOCK_TICKETS: Ticket[] = [
  { id: 'VEXO-014', title: 'Fix DVSA CSV import timeout on 10k+ rows', project: 'Vexo Garage OS', priority: 'P1', status: 'Review', assignee: 'Captain', due: 'Today', description: 'Timeout occurs when importing full Oldham dataset. Needs chunked processing + retry.' },
  { id: 'VEXO-015', title: 'WhatsApp MOT reminder template approval', project: 'Vexo Garage OS', priority: 'P2', status: 'In Progress', assignee: 'Captain', due: 'Tomorrow', description: 'Meta approval pending for 3 reminder templates.' },
  { id: 'VEXO-016', title: 'Stripe webhook for Phase 2 invoice', project: 'Vexo Garage OS', priority: 'P2', status: 'To Do', assignee: 'Senior Dev — Platform', due: 'Mar 02', description: 'Handle invoice.paid for AK-2026-014' },
];

const MOCK_INVOICES = [
  { id: 'AK-2026-014', project: 'Vexo Garage OS — Phase 2', amount: 4500, status: 'Sent', due: 'Due in 5 days', progress: 50, type: '50% Upfront' },
  { id: 'AK-2026-011', project: 'Vexo Garage OS — Phase 1', amount: 12500, status: 'Paid', due: 'Paid Jan 28', progress: 100, type: 'Final' },
  { id: 'AK-2026-009', project: 'Discovery & Architecture', amount: 3500, status: 'Paid', due: 'Paid Dec 12', progress: 100, type: 'Discovery' },
];

const MOCK_CHATS: ChatMsg[] = [
  { id: '1', role: 'ava', text: 'Hi Oldham MOT Centre — Vexo onboarding is 73% complete. DVSA importer was optimized last run (10k rows in 47s). Want a progress breakdown?', time: '09:41' },
  { id: '2', role: 'user', text: 'Can you add MOT reminder SMS?', time: '09:42' },
  { id: '3', role: 'ava', text: 'Yes — I can scope that. It fits under Vexo Phase 2.5. Proposed: WhatsApp + SMS fallback via GOV.UK Notify, 3 templates, £2.8k, 6 days. Raise as Request Project?', time: '09:42' },
  { id: '4', role: 'captain', text: 'Logged. I reviewed the DVSA timeout fix — deploying to staging now. Will share staging link for VEXO-014 in 20 mins.', time: '10:15' },
];

// Records helpers — same CRM API the Admin entrance uses
async function api(action: string, args: Record<string, unknown> = {}) {
  const data = await crmAction<any>(action, args);
  if (Array.isArray(data)) return { records: data };
  if (data && Array.isArray(data.records)) return data;
  return data ?? { records: [] };
}

function priorityToAdmin(p: 'P1' | 'P2' | 'P3'): 'Critical' | 'High' | 'Medium' | 'Low' {
  if (p === 'P1') return 'Critical';
  if (p === 'P2') return 'High';
  return 'Medium';
}

/** Mirror user actions into Admin CRM collections so Captain sees them. */
async function mirrorToAdmin(kind: 'ticket' | 'chat' | 'request', value: any, clientLabel: string) {
  try {
    if (kind === 'ticket') {
      await crmAction('records.create', {
        collection: 'tickets',
        value: {
          ticketId: value.id,
          title: value.title,
          project: value.project,
          priority: priorityToAdmin(value.priority),
          assignee: value.assignee || 'Captain',
          due: value.due || '',
          column: value.status || 'To Do',
          client: clientLabel,
          description: value.description || '',
        },
        idempotency_key: `admin-mirror-ticket-${value.id}`,
      });
    }
    if (kind === 'request') {
      await crmAction('records.create', {
        collection: 'leads',
        value: {
          companyName: clientLabel,
          address: '',
          postcode: '',
          postcodeArea: 'OL',
          phone: '',
          motClasses: value.type || 'Custom',
          companiesHouseStatus: 'Active',
          score: 85,
          aiIcebreaker: `Project request: ${value.title} — ${value.description}`,
          status: 'New',
          source: `Users portal · ${value.id}`,
          request: value,
        },
        idempotency_key: `admin-mirror-lead-${value.id}`,
      });
      await crmAction('records.create', {
        collection: 'engagements',
        value: {
          leadId: value.id,
          leadName: clientLabel,
          date: new Date().toISOString().slice(0, 10),
          type: 'AVA Chat',
          duration: '-',
          notes: `Client project request submitted: ${value.title}`,
          outcome: 'Submitted — under review',
          evidenceFile: `request_${value.id}.json`,
          govStandard: 'Discovery',
        },
        idempotency_key: `admin-mirror-eng-${value.id}`,
      });
    }
    if (kind === 'chat') {
      // Append into Admin CRM chat thread for this client (must replace, not re-create)
      const listed = await api('records.list', { collection: 'chats', limit: 200 });
      const records = listed.records || [];
      const label = String(clientLabel || '').toLowerCase();
      const email = String(value.clientEmail || '').toLowerCase();
      const existing = records.find((r: any) => {
        const v = r.value || {};
        const name = String(v.leadName || '').toLowerCase();
        const origin = String(v.origin || '');
        const threadKey = String(v.threadKey || '');
        return (
          threadKey === `users:${label}` ||
          (origin.includes('Users portal') && name === label) ||
          name === label ||
          (email && name.includes(email.split('@')[0]))
        );
      });
      const entry = {
        from: value.role === 'user' ? 'lead' : value.role === 'captain' ? 'captain' : 'ava',
        text: value.text,
        time: value.time,
        msgId: value.id,
      };
      const fromClient = entry.from === 'lead';
      if (existing) {
        const prev = existing.value || {};
        const transcript = [...(prev.transcript || [])];
        if (!transcript.some((t: any) => t.msgId && t.msgId === entry.msgId)) {
          transcript.push(entry);
        }
        const next = {
          ...prev,
          leadName: prev.leadName || clientLabel,
          lastMessage: value.text,
          origin: prev.origin || 'Users portal',
          threadKey: prev.threadKey || `users:${label}`,
          transcript,
          unread: fromClient ? true : Boolean(prev.unread),
          unreadCount: fromClient
            ? Number(prev.unreadCount || 0) + 1
            : Number(prev.unreadCount || 0),
          lastFrom: entry.from,
          updatedAt: new Date().toISOString(),
        };
        await crmAction('records.replace', {
          collection: 'chats',
          id: existing.id,
          value: next,
        });
      } else {
        const created: any = await crmAction('records.create', {
          collection: 'chats',
          value: {
            leadName: clientLabel,
            lastMessage: value.text,
            sentiment: 'Neutral',
            jobScore: 80,
            origin: 'Users portal',
            threadKey: `users:${label}`,
            transcript: [entry],
            techAssessment: 'Client portal thread',
            unread: fromClient,
            unreadCount: fromClient ? 1 : 0,
            lastFrom: entry.from,
            updatedAt: new Date().toISOString(),
          },
          // Unique per first create only — later messages use replace above
          idempotency_key: `admin-chat-thread-${label}`,
        });
        // Idempotency can return an older thread without this message — force append
        const prev = created?.value || {};
        const transcript = [...(prev.transcript || [])];
        if (!transcript.some((t: any) => t.msgId && t.msgId === entry.msgId)) {
          transcript.push(entry);
          await crmAction('records.replace', {
            collection: 'chats',
            id: created.id,
            value: {
              ...prev,
              leadName: prev.leadName || clientLabel,
              lastMessage: value.text,
              origin: prev.origin || 'Users portal',
              threadKey: prev.threadKey || `users:${label}`,
              transcript,
              unread: fromClient ? true : Boolean(prev.unread),
              unreadCount: fromClient
                ? Number(prev.unreadCount || 0) + 1
                : Number(prev.unreadCount || 0),
              lastFrom: entry.from,
              updatedAt: new Date().toISOString(),
            },
          });
        }
      }
    }
  } catch (e) {
    console.warn('admin mirror failed', e);
  }
}

export default function UserDashboardApp() {
  const { user, signOut } = useAuth();
  const clientLabel =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name ||
    user?.email?.split('@')[0] ||
    'Client';
  const clientEmail = user?.email || '';
  const firstName = firstNameFrom(clientLabel, clientEmail);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScopePrompt, setShowScopePrompt] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const promptKey = user?.id ? `aikova_scope_prompt_dismissed:${user.id}` : '';
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [chats, setChats] = useState<ChatMsg[]>(MOCK_CHATS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(MOCK_PROJECTS[0]);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [ticketView, setTicketView] = useState<'table'|'kanban'>('kanban');
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [busy, setBusy] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Request form state
  const [reqForm, setReqForm] = useState({
    type: 'Custom Software',
    title: '',
    description: '',
    budget: '£30k-60k',
    timeline: '1-3 months',
    compliance: [] as string[],
  });
  const [reqResult, setReqResult] = useState<ProjectRequest | null>(null);
  const [showAvaAssessment, setShowAvaAssessment] = useState(false);

  // Ticket form
  const [ticketForm, setTicketForm] = useState({ title:'', description:'', project:'Vexo Garage OS', priority:'P2' as 'P1'|'P2'|'P3' });

  // Load records
  useEffect(() => {
    (async () => {
      try {
        const [p, t, r, c] = await Promise.all([
          api('records.list', { collection: 'user_projects' }),
          api('records.list', { collection: 'user_tickets' }),
          api('records.list', { collection: 'user_requests' }),
          api('records.list', { collection: 'user_chats' }),
        ]);
        if (p.records?.length) setProjects(p.records.map((x:any)=>x.value));
        if (t.records?.length) setTickets(t.records.map((x:any)=>x.value));
        if (r.records?.length) setRequests(r.records.map((x:any)=>x.value));
        if (c.records?.length) setChats(c.records.map((x:any)=>x.value));

        // After signup / first dashboard entry — prompt to Scope a project
        const filed = (r.records || []).map((x: any) => x.value).filter(Boolean);
        const hasAssessment = filed.some((v: any) =>
          ['Pending', 'Submitted', 'Accepted', 'Under Review', 'In Progress'].includes(v.status),
        );
        let dismissed = false;
        try {
          dismissed = promptKey ? localStorage.getItem(promptKey) === '1' : false;
        } catch {}
        if (!hasAssessment && !dismissed) {
          setShowScopePrompt(true);
          setActiveTab('dashboard');
        }

        // Seed baseline mocks once so Admin CRM has data to sync against
        if (!p.records?.length) {
          for (const proj of MOCK_PROJECTS) {
            try {
              await api('records.create', {
                collection: 'user_projects',
                value: proj,
                idempotency_key: `user_projects-${proj.id}-seed`,
              });
            } catch {}
          }
          const re = await api('records.list', { collection: 'user_projects' });
          if (re.records?.length) setProjects(re.records.map((x:any)=>x.value));
        }
        if (!t.records?.length) {
          for (const ticket of MOCK_TICKETS) {
            try {
              await api('records.create', {
                collection: 'user_tickets',
                value: ticket,
                idempotency_key: `user_tickets-${ticket.id}-seed`,
              });
              await mirrorToAdmin('ticket', ticket, clientLabel);
            } catch {}
          }
          const re = await api('records.list', { collection: 'user_tickets' });
          if (re.records?.length) setTickets(re.records.map((x:any)=>x.value));
        }
        if (!c.records?.length) {
          for (const msg of MOCK_CHATS) {
            try {
              await api('records.create', {
                collection: 'user_chats',
                value: msg,
                idempotency_key: `user_chats-${msg.id}-seed`,
              });
              await mirrorToAdmin('chat', msg, clientLabel);
            } catch {}
          }
          const re = await api('records.list', { collection: 'user_chats' });
          if (re.records?.length) setChats(re.records.map((x:any)=>x.value));
        }
      } catch (e) {
        console.log('records api unavailable', e);
      }
    })();
  }, []);

  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:'smooth'}); }, [chats]);

  const reloadRecords = async () => {
    const [p,t,r,c] = await Promise.all([
      api('records.list', { collection: 'user_projects' }),
      api('records.list', { collection: 'user_tickets' }),
      api('records.list', { collection: 'user_requests' }),
      api('records.list', { collection: 'user_chats' }),
    ]);
    setProjects(p.records?.length ? p.records.map((x:any)=>x.value) : MOCK_PROJECTS);
    setTickets(t.records?.length ? t.records.map((x:any)=>x.value) : MOCK_TICKETS);
    setRequests(r.records?.map((x:any)=>x.value) || []);
    setChats(c.records?.length ? c.records.map((x:any)=>x.value) : MOCK_CHATS);
  };

  const createRow = async (collection: string, value: any) => {
    await api('records.create', { collection, value, idempotency_key: `${collection}-${value.id}-${Date.now()}` });
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqForm.title.trim() || !reqForm.description.trim()) return;
    setBusy(true);
    const id = `RQ-${Math.floor(100+Math.random()*899)}`;
    const assessment = {
      architecture: reqForm.type.includes('Payment') ? 'Event-driven microservice + Stripe webhooks + idempotency layer, Odoo sync via queue' : reqForm.type.includes('Industrial') ? 'Digital Twin workstation flow + OPC-UA bridge + evidence vault' : 'Next.js 15 + Postgres + S3 + GOV.UK Notify + Stripe',
      stack: reqForm.type === 'AI & Data' ? ['Python','ClickHouse','LangGraph','Next.js'] : ['Next.js','Postgres','S3','Odoo','Stripe','WhatsApp'],
      estimate: reqForm.budget.includes('Emergency') ? '£2.4k — 2hr triage + 24hr fix' : reqForm.budget,
      team: reqForm.budget.includes('£60k+') ? 'Captain + 2 senior devs + QA' : 'Captain + senior dev',
      timeline: reqForm.timeline === 'ASAP' ? '48hr proposal, 1-week kickoff' : reqForm.timeline,
      risks: ['DVSA API rate limit if bulk import','WhatsApp template approval 24-48h','Odoo version pinning']
    };
    const newReq: ProjectRequest = {
      id, title: reqForm.title, type: reqForm.type, description: reqForm.description,
      budget: reqForm.budget, timeline: reqForm.timeline, compliance: reqForm.compliance,
      status: 'Pending', created: new Date().toISOString(), assessment
    };
    try {
      await createRow('user_requests', newReq);
      await mirrorToAdmin('request', newReq, clientLabel);
      await reloadRecords();
      setReqResult(newReq);
      setShowAvaAssessment(true);
      setReqForm({ type:'Custom Software', title:'', description:'', budget:'£30k-60k', timeline:'1-3 months', compliance:[] });
    } catch (err:any) {
      setRequests(prev => [newReq, ...prev]);
      setReqResult(newReq);
      setShowAvaAssessment(true);
    }
    setBusy(false);
  };

  const handleTicketCreate = async () => {
    if (!ticketForm.title.trim()) return;
    setBusy(true);
    const newT: Ticket = {
      id: `VEXO-${Math.floor(100+Math.random()*900)}`,
      title: ticketForm.title,
      description: ticketForm.description,
      project: ticketForm.project,
      priority: ticketForm.priority,
      status: 'To Do',
      assignee: 'Captain',
      due: 'Today'
    };
    try {
      await createRow('user_tickets', newT);
      await mirrorToAdmin('ticket', newT, clientLabel);
      await reloadRecords();
      setTickets(prev=>[newT,...prev]);
      setNewTicketOpen(false);
      setTicketForm({ title:'', description:'', project:'Vexo Garage OS', priority:'P2'});
    } catch { setTickets(prev=>[newT,...prev]); setNewTicketOpen(false); }
    setBusy(false);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChats((prev) => [...prev, userMsg]);
    setChatInput('');
    setBusy(true);
    try {
      await createRow('user_chats', { ...userMsg, clientEmail });
      await mirrorToAdmin('chat', { ...userMsg, clientEmail }, clientLabel);
    } catch (e) {
      console.warn('chat sync failed', e);
    }
    // AVA ack — mirrored as ava so Captain sees the thread alive
    setTimeout(async () => {
      const reply: ChatMsg = {
        id: `a-${Date.now()}`,
        role: 'ava',
        text: text.toLowerCase().includes('progress')
          ? `Noted — I've logged your progress question for Captain. Vexo is ${selectedProject?.progress ?? 0}% on the board.`
          : `Got it — message delivered to Captain CRM. They'll see it under Chats with a notification badge.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChats((prev) => [...prev, reply]);
      try {
        await createRow('user_chats', { ...reply, clientEmail });
        await mirrorToAdmin('chat', { ...reply, clientEmail }, clientLabel);
      } catch {}
      setBusy(false);
    }, 600);
  };

  const navItems = [
    { id:'dashboard', label:'Dashboard', icon:'◫' },
    { id:'projects', label:'My Projects', icon:'◩', count: projects.length },
    { id:'assessment', label:'Scope project', icon:'✦', highlight:true },
    { id:'tickets', label:'My Tickets', icon:'☰', count: tickets.filter(t=>t.status!=='Done').length },
    { id:'chat', label:'Chat / AVA', icon:'◐' },
    { id:'invoices', label:'Invoices', icon:'£', count: 1 },
    { id:'files', label:'Files / Vault', icon:'◧' },
    { id:'support', label:'Support', icon:'?' },
  ];

  return (
    <div data-safe-area-inset-root className="min-h-[100vh] w-full bg-[#05070D] text-[#E6EAF2] overflow-x-clip" style={{ boxSizing:'border-box', paddingTop:'var(--safe-area-inset-top)' }}>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
:root {
  --bg: #05070D; --bg-elevated: #0B0F1A; --surface: #121826; --surface-2: #1A2338; --surface-3: #212F4D;
  --border: rgba(255,255,255,0.08); --border-strong: rgba(255,255,255,0.14);
  --text: #E6EAF2; --text-dim: #8B95AC; --electric: #0EA5FF; --neon: #84FF3D; --gold: #FFD700;
}
* { font-family: Inter, system-ui, sans-serif; }
h1,h2,h3,.font-display { font-family: Sora, sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace !important; }
.glass {
  background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%);
  backdrop-filter: blur(24px); border: 1px solid var(--border);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
}
.glass-strong {
  background: linear-gradient(180deg, rgba(18,24,38,0.9) 0%, rgba(11,15,26,0.92) 100%);
  backdrop-filter: blur(32px); border: 1px solid var(--border-strong);
}
.glow-electric { box-shadow: 0 0 40px rgba(14,165,255,0.18); }
.glow-neon { box-shadow: 0 0 40px rgba(132,255,61,0.18); }
@keyframes slideIn { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform: translateY(0);} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
.animate-in { animation: slideIn 0.4s ease-out; }
`}</style>

      {/* Header */}
      <header data-safe-area-sticky-top className="sticky z-40 border-b border-white/[0.08] glass-strong" style={{ top:'var(--safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 md:px-6 h-[64px]">
          <div className="flex items-center gap-4">
            <button onClick={()=>setMobileNav(!mobileNav)} className="md:hidden w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center">☰</button>
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt="AiKOVA" className="h-[28px] w-auto object-contain brightness-110" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5FF] text-[10px] font-bold text-black">AK</div>
              )}
              <div className="hidden md:block h-6 w-px bg-white/10" />
              <div className="hidden md:flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest bg-[#0EA5FF]/15 text-[#0EA5FF] border border-[#0EA5FF]/30">CLIENT PORTAL</span>
                <span className="text-xs text-white/40 font-mono">app.aikova.co.uk/user</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/os/portal" className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] font-medium text-white/70 no-underline">
              Portal
            </Link>
            <div className="hidden md:block text-right mr-1">
              <div className="text-[12px] font-semibold leading-none">{clientLabel}</div>
              <div className="text-[10px] text-white/40">{clientEmail}</div>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] font-medium text-white/70"
            >
              Sign out
            </button>
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84FF3D] animate-pulse" />
                <span className="text-[11px] font-mono text-white/70">CAPTAIN ONLINE</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[11px] font-bold text-[#FFD700]">SLA 4HR</div>
            </div>

            <button className="relative w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/[0.08] transition">
              <span className="text-sm">◑</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF4D6D] text-[10px] font-bold flex items-center justify-center text-white">3</span>
            </button>

            <div className="h-9 w-px bg-white/10 hidden md:block" />

            <div className="flex items-center gap-2.5 pl-1">
              <div className="text-right hidden md:block">
                <div className="text-[13px] font-semibold leading-none">Oldham MOT Centre</div>
                <div className="text-[11px] text-white/50 font-mono">oldham@vexo.garage</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0EA5FF] to-[#84FF3D] p-[1px]">
                <div className="w-full h-full rounded-[10px] bg-[#0B0F1A] flex items-center justify-center font-bold text-sm">OM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Client metrics bar */}
        <div className="border-t border-white/[0.06] bg-[#05070D]/60 backdrop-blur px-4 md:px-6 py-2.5 flex items-center gap-2 md:gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-white/30 tracking-widest">MY OVERVIEW</span>
            <span className="w-px h-3 bg-white/10" />
          </div>
          <div className="flex items-center gap-2">
            {[
              { k:'My Projects', v:`${projects.length}`, accent:'#0EA5FF' },
              { k:'Open Tickets', v:`${tickets.filter(t=>t.status!=='Done').length}`, accent:'#FFD700' },
              { k:'Invoices', v:'1 Due', accent:'#FF4D6D' },
              { k:'Chat', v:'Captain', accent:'#84FF3D' },
            ].map(m=>(
              <div key={m.k} className="shrink-0 flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background:m.accent }} />
                <span className="text-[11px] text-white/50 font-mono">{m.k}</span>
                <span className="text-[11px] font-bold">{m.v}</span>
              </div>
            ))}
          </div>
          <div className="ml-auto hidden md:flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/30">WIRE: Supabase → Admin CRM (leads, tickets, chats) • S3 • SES • Stripe</span>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-98px)]">
        {/* Sidebar */}
        <aside className={`${mobileNav?'flex':'hidden'} md:flex fixed md:sticky z-30 md:z-10 flex-col w-[260px] shrink-0 h-[calc(100vh-98px)] md:h-[calc(100vh-98px)] top-[98px] md:top-[98px] bg-[#080B14] border-r border-white/[0.06] p-3 overflow-y-auto`}>
          <div className="px-2 py-3">
            <div className="text-[10px] font-mono tracking-[0.2em] text-white/30 mb-3">NAVIGATION</div>
            <nav className="space-y-1">
              {navItems.map(item=>(
                <button
                  key={item.id}
                  onClick={()=>{ setActiveTab(item.id); setMobileNav(false); }}
                  className={`w-full flex items-center justify-between px-3 py-[10px] rounded-xl text-[13px] font-medium transition border ${activeTab===item.id ? 'bg-white/[0.07] border-white/15 text-white' : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]'} ${item.highlight && activeTab!==item.id ? 'bg-[#0EA5FF]/10 border-[#0EA5FF]/20 text-[#0EA5FF]' : ''}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-[12px]">{item.icon}</span>
                    {item.label}
                  </span>
                  {item.count!==undefined && <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${activeTab===item.id?'bg-white/15':'bg-white/10'}`}>{item.count}</span>}
                </button>
              ))}
            </nav>

            <div className="mt-6 p-3 rounded-2xl bg-gradient-to-br from-[#0EA5FF]/15 via-[#0B0F1A] to-[#84FF3D]/10 border border-[#0EA5FF]/20">
              <div className="text-[11px] font-mono text-[#0EA5FF] tracking-widest mb-1">ACTIVE PROJECT</div>
              <div className="text-[13px] font-semibold">Vexo Garage OS</div>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0EA5FF] to-[#84FF3D]" style={{ width:`${MOCK_PROJECTS[0].progress}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] font-mono text-white/50">
                <span>{MOCK_PROJECTS[0].progress}% complete</span><span>Mar 2026 go-live</span>
              </div>
            </div>

            <div className="mt-6 px-2">
              <div className="text-[10px] font-mono text-white/30 tracking-widest mb-2">COMPLIANCE</div>
              <div className="flex flex-wrap gap-1.5">
                {['ISO 27001','PCI DSS','Cyber Essentials'].map(c=>(
                  <span key={c} className="text-[9px] font-mono px-2 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/50">{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto p-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 text-[11px] text-white/40 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#84FF3D] animate-pulse" />
              Wired to Admin CRM • app.aikova.co.uk/user
            </div>
          </div>
        </aside>

        {/* Post sign-up / first entry prompt */}
        {showScopePrompt && (
          <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="glass w-full max-w-[520px] rounded-[24px] p-6 md:p-8 border border-white/15 shadow-2xl">
              <div className="font-mono text-[10px] tracking-widest text-[#0EA5FF]">
                WELCOME · SCOPE YOUR BUILD
              </div>
              <h2 className="font-display mt-2 text-[26px] font-bold leading-tight">
                Welcome {firstName}!
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-white/65">
                Before we open your board fully, AVA needs a{' '}
                <strong className="text-white">Project Assessment Request</strong> — a short chat
                that scopes what you want built (job, workflows, budget). It lands as{' '}
                <span className="text-[#FFD700] font-semibold">Pending</span> for Captain to accept.
              </p>
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-[12px] text-white/55">
                Friendly name: <span className="text-white font-medium">Scope my project</span>
                <span className="text-white/30"> · </span>
                Formal: Project Assessment Request
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowScopePrompt(false);
                    setCompanionOpen(true);
                    setActiveTab('assessment');
                  }}
                  className="rounded-full bg-[#0EA5FF] px-5 py-3 text-[14px] font-semibold text-black"
                >
                  ✦ Scope my project →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      if (promptKey) localStorage.setItem(promptKey, '1');
                    } catch {}
                    setShowScopePrompt(false);
                  }}
                  className="rounded-full border border-white/10 px-4 py-3 text-[13px] text-white/70"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 min-w-0 bg-[radial-gradient(800px_400px_at_20%_0%,rgba(14,165,255,0.08),transparent),radial-gradient(600px_400px_at_90%_10%,rgba(132,255,61,0.06),transparent)]">
          {/* DASHBOARD */}
          {activeTab==='dashboard' && (
            <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-in">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-[28px] md:text-[36px] font-[700] leading-[0.95] tracking-[-0.02em]">Welcome {firstName}!<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5FF] to-[#84FF3D]">{requests.some(r=>r.status==='Pending'||r.status==='Submitted') ? 'Your assessment is pending Captain review' : projects[0] ? `${projects[0].name} is ${projects[0].progress}% complete` : 'Scope your project with AVA'}</span></h1>
                  <p className="mt-3 text-[13px] text-white/60 max-w-[640px] leading-relaxed">Scope my project (Project Assessment Request) — AVA asks a few questions, then files a Pending brief for Captain.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={()=>{ setCompanionOpen(true); setActiveTab('assessment'); }} className="px-4 py-2.5 rounded-xl bg-[#0EA5FF] text-black font-semibold text-[13px] hover:bg-[#0EA5FF]/90 transition">✦ Scope my project</button>
                  <button onClick={()=>setActiveTab('chat')} className="px-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-[13px] font-medium hover:bg-white/[0.1] transition">Chat with AVA</button>
                </div>
              </div>

              {requests.filter(r=>r.status==='Pending'||r.status==='Submitted').length>0 && (
                <div className="rounded-[16px] border border-[#FFD700]/30 bg-[#FFD700]/10 p-4">
                  <div className="text-[10px] font-mono tracking-widest text-[#FFD700]">PROJECT ASSESSMENT · PENDING</div>
                  <div className="mt-2 space-y-2">
                    {requests.filter(r=>r.status==='Pending'||r.status==='Submitted').map(r=>(
                      <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-black/20 px-3 py-2">
                        <div>
                          <div className="text-[13px] font-semibold">{r.title}</div>
                          <div className="text-[11px] text-white/50">{r.id} · {r.type} · {r.budget}</div>
                        </div>
                        <span className="rounded-full bg-[#FFD700] px-2.5 py-1 text-[10px] font-bold text-black">Pending</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-white/50">Captain must accept before this becomes an active project on your board.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title:'Project Progress', value: projects[0]?.name || 'No active project', sub: projects[0] ? `${projects[0].progress}% — delivery` : 'Awaiting accept', bar: projects[0]?.progress || 0, accent:'#0EA5FF' },
                  { title:'Tickets', value:'3 Open', sub:'2 In Progress, 1 Review', bar:66, accent:'#FFD700' },
                  { title:'Next Meeting', value:'Tomorrow 10am', sub:'With Captain — VEXO Phase 2.5 scoping', bar:100, accent:'#84FF3D' },
                  { title:'Billing', value:'£4,500 due', sub:'Invoice #AK-2026-014 — 5 days', bar:50, accent:'#FF4D6D' },
                ].map(card=>(
                  <div key={card.title} className="glass rounded-[16px] p-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono tracking-widest text-white/40">{card.title.toUpperCase()}</span>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background:card.accent }} />
                    </div>
                    <div className="mt-3 text-[18px] font-semibold font-display">{card.value}</div>
                    <div className="text-[12px] text-white/50 mt-1">{card.sub}</div>
                    <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full" style={{ width:`${card.bar}%`, background:card.accent }} /></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 glass rounded-[20px] p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-[15px]">Timeline — Recent Activity</h3>
                    <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">TRANSPARENT OPS LOG</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      { time:'2h ago', title:'Engagement logged for DOS7', detail:'Professional audit trail — shows compliance, evidence vault updated', tag:'Evidence', color:'#84FF3D' },
                      { time:'3h ago', title:'Ticket #VEXO-014 moved to Review', detail:'DVSA CSV import timeout — chunked processor implemented', tag:'Ticket', color:'#FFD700' },
                      { time:'5h ago', title:'AVA chat logged', detail:'Client asked about MOT reminder SMS — scoped £2.8k / 6 days', tag:'AVA', color:'#0EA5FF' },
                      { time:'Yesterday', title:'S3 deliverable uploaded', detail:'Vexo_Booking_OS_Flow_v1.2.pdf — 4.2MB', tag:'File', color:'#8B95AC' },
                    ].map(ev=>(
                      <div key={ev.title} className="flex gap-3 group">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full mt-1.5" style={{ background:ev.color }} />
                          <div className="w-px h-full bg-white/10 mt-1" />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-white/30">{ev.time}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full border" style={{ borderColor:`${ev.color}40`, color:ev.color, background:`${ev.color}12` }}>{ev.tag}</span>
                          </div>
                          <div className="text-[13px] font-medium mt-1">{ev.title}</div>
                          <div className="text-[11px] text-white/50 mt-0.5">{ev.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="glass rounded-[20px] p-5">
                    <h3 className="font-display font-semibold text-[14px]">Quick Actions</h3>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        { label:'Scope my project', id:'assessment', accent:'#0EA5FF' },
                        { label:'Raise Ticket', id:'tickets', accent:'#FFD700' },
                        { label:'Chat with AVA', id:'chat', accent:'#84FF3D' },
                        { label:'Pay Invoice', id:'invoices', accent:'#FF4D6D' },
                      ].map(a=>(
                        <button key={a.label} onClick={()=>setActiveTab(a.id)} className="text-left px-3 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[12px] mb-2" style={{ background:`${a.accent}18`, color:a.accent }}>✦</div>
                          <div className="text-[12px] font-medium leading-tight">{a.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[20px] p-[1px] bg-gradient-to-br from-[#0EA5FF]/40 to-[#84FF3D]/30">
                    <div className="rounded-[19px] bg-[#0B0F1A] p-4">
                      <div className="text-[11px] font-mono text-[#84FF3D]">INDUSTRIES PATTERN</div>
                      <div className="mt-2 text-[13px] font-medium leading-snug">Paper SOPs → Twin-guided workstations</div>
                      <div className="mt-1 text-[11px] text-white/50">Vexo transforms manual MOT logging into DVSA-synced, WhatsApp-automated garage OS.</div>
                      <div className="mt-3 flex gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#84FF3D]/10 text-[#84FF3D] border border-[#84FF3D]/20">Evidence Vault</span>
                        <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-white/5 text-white/40 border border-white/10">Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MY PROJECTS */}
          {activeTab==='projects' && (
            <div className="p-4 md:p-6 lg:p-8 space-y-5 animate-in">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[22px] font-semibold">My Projects — {projects.length}</h2>
                <button onClick={()=>{ setCompanionOpen(true); setActiveTab('assessment'); }} className="px-3 py-2 rounded-xl bg-[#0EA5FF] text-black text-[12px] font-semibold">✦ Scope my project</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {projects.map(proj=>(
                  <div key={proj.id} className="glass rounded-[20px] p-5 hover:border-white/15 transition cursor-pointer" onClick={()=>{ setSelectedProject(proj); setShowProjectDetail(true); }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-[#0EA5FF]/15 text-[#0EA5FF] border border-[#0EA5FF]/25">{proj.status}</span>
                          <span className="text-[10px] font-mono text-white/30">{proj.id}</span>
                        </div>
                        <h3 className="font-display font-semibold text-[18px] mt-2">{proj.name}</h3>
                        <p className="text-[12px] text-white/50 mt-1 leading-snug">{proj.scope.slice(0,120)}...</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[24px] font-bold font-display leading-none">{proj.progress}%</div>
                        <div className="text-[10px] font-mono text-white/40 mt-1">{proj.tickets} tickets linked</div>
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#0EA5FF] to-[#84FF3D]" style={{ width:`${proj.progress}%` }} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {proj.tech.slice(0,5).map(t=>(
                        <span key={t} className="text-[10px] font-mono px-2 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/60">{t}</span>
                      ))}
                      {proj.tech.length>5 && <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-white/5 text-white/30">+{proj.tech.length-5}</span>}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-white/40">
                      <span>{proj.start} → {proj.golive}</span>
                      <span>{proj.lastUpdate}</span>
                    </div>
                  </div>
                ))}
              </div>

              {showProjectDetail && selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={()=>setShowProjectDetail(false)}>
                  <div className="w-full max-w-[760px] max-h-[85vh] overflow-auto glass-strong rounded-[24px] p-6" onClick={e=>e.stopPropagation()}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-display text-[20px] font-semibold">{selectedProject.name}</h3>
                        <p className="text-[12px] text-white/50 mt-1 font-mono">{selectedProject.id} • {selectedProject.client}</p>
                      </div>
                      <button onClick={()=>setShowProjectDetail(false)} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">✕</button>
                    </div>
                    <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { k:'Progress', v:`${selectedProject.progress}%` },
                        { k:'Status', v:selectedProject.status },
                        { k:'Team', v:selectedProject.team.length+' members' },
                        { k:'Tickets', v:selectedProject.tickets+' open' },
                      ].map(s=>(
                        <div key={s.k} className="p-3 rounded-xl bg-white/[0.04] border border-white/10"><div className="text-[10px] font-mono text-white/40">{s.k}</div><div className="text-[13px] font-semibold mt-1">{s.v}</div></div>
                      ))}
                    </div>
                    <div className="mt-5">
                      <h4 className="text-[11px] font-mono tracking-widest text-white/40">DELIVERABLES</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedProject.deliverables.map(d=>(
                          <span key={d} className="px-3 py-1.5 rounded-full bg-[#84FF3D]/10 border border-[#84FF3D]/20 text-[12px] text-[#84FF3D]">{d}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5">
                      <h4 className="text-[11px] font-mono tracking-widest text-white/40">TIMELINE & TEAM</h4>
                      <div className="mt-2 text-[12px] text-white/70 leading-relaxed">Start {selectedProject.start}, Go-live {selectedProject.golive}. Team: {selectedProject.team.join(', ')}. Last update: {selectedProject.lastUpdate}</div>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button onClick={()=>{ setShowProjectDetail(false); setCompanionOpen(true); setActiveTab('assessment'); }} className="px-4 py-2 rounded-xl bg-[#0EA5FF] text-black font-semibold text-[12px]">Project Assessment</button>
                      <button onClick={()=>{ setShowProjectDetail(false); setActiveTab('tickets'); }} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-[12px]">View Tickets</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROJECT ASSESSMENT REQUEST — in-dashboard AVA Q&A */}
          {activeTab==='assessment' && (
            <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-in">
              <div>
                <h2 className="font-display text-[22px] font-semibold">Scope my project</h2>
                <p className="mt-1 text-[13px] text-white/55">
                  Project Assessment Request — AVA conversational Q&amp;A. Full blueprint files as{' '}
                  <span className="text-[#FFD700]">Pending</span> until Captain accepts.
                </p>
              </div>

              {companionOpen ? (
                <ProjectCompanionOnboarding
                  clientLabel={clientLabel}
                  clientEmail={clientEmail}
                  firstName={firstName}
                  onCancel={() => setCompanionOpen(false)}
                  onSubmitted={(req) => {
                    setRequests(prev => [{
                      id: req.id,
                      title: req.title,
                      type: req.blueprint.type,
                      description: req.blueprint.description,
                      budget: req.blueprint.budget,
                      timeline: req.blueprint.timeline,
                      compliance: req.blueprint.compliance,
                      status: 'Pending',
                      created: new Date().toISOString(),
                      assessment: req.blueprint.assessment,
                    }, ...prev]);
                    setCompanionOpen(false);
                    setShowScopePrompt(false);
                    try {
                      if (promptKey) localStorage.setItem(promptKey, '1');
                    } catch {}
                    setActiveTab('dashboard');
                  }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setCompanionOpen(true)}
                  className="rounded-xl bg-[#0EA5FF] px-4 py-3 text-[13px] font-semibold text-black"
                >
                  ✦ Scope my project
                </button>
              )}

              <div className="glass rounded-[16px] p-5">
                <h3 className="font-display text-[14px] font-semibold">Your assessment requests</h3>
                <div className="mt-3 space-y-2">
                  {requests.length === 0 ? (
                    <div className="text-[12px] text-white/45">No assessments yet — run Project Assessment Request above.</div>
                  ) : requests.map(r => (
                    <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                      <div>
                        <div className="text-[13px] font-medium">{r.title}</div>
                        <div className="text-[11px] text-white/45">{r.id} · {r.type} · {r.budget}</div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        r.status === 'Pending' || r.status === 'Submitted'
                          ? 'bg-[#FFD700] text-black'
                          : r.status === 'Accepted'
                            ? 'bg-[#84FF3D] text-black'
                            : 'bg-white/10 text-white/70'
                      }`}>{r.status === 'Submitted' ? 'Pending' : r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
{activeTab==='tickets' && (
            <div className="p-4 md:p-6 lg:p-8 space-y-5 animate-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <h2 className="font-display text-[22px] font-semibold">My Tickets — {tickets.length} • SLA: Professional 4hr</h2>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-xl bg-white/[0.06] border border-white/10 p-1">
                    <button onClick={()=>setTicketView('kanban')} className={`px-3 py-1 rounded-lg text-[11px] font-medium ${ticketView==='kanban'?'bg-white text-black':'text-white/60'}`}>Kanban</button>
                    <button onClick={()=>setTicketView('table')} className={`px-3 py-1 rounded-lg text-[11px] font-medium ${ticketView==='table'?'bg-white text-black':'text-white/60'}`}>Table</button>
                  </div>
                  <button onClick={()=>setNewTicketOpen(true)} className="px-3 py-2 rounded-xl bg-[#FFD700] text-black font-semibold text-[12px]">+ Raise Ticket</button>
                </div>
              </div>

              {ticketView==='kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {(['To Do','In Progress','Review','Done'] as const).map(col=>(
                    <div key={col} className="rounded-[16px] bg-white/[0.03] border border-white/[0.06] p-3 min-h-[400px]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono tracking-widest text-white/50">{col.toUpperCase()}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/10">{tickets.filter(t=>t.status===col).length}</span>
                      </div>
                      <div className="space-y-2.5">
                        {tickets.filter(t=>t.status===col).map(t=>(
                          <div key={t.id} className="p-3 rounded-xl bg-[#121826] border border-white/10 hover:border-white/15 transition">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${t.priority==='P1'?'bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/30': t.priority==='P2'?'bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/30':'bg-white/5 text-white/50 border-white/10'}`}>{t.priority}</span>
                              <span className="text-[10px] font-mono text-white/30">{t.id}</span>
                            </div>
                            <div className="text-[12px] font-medium mt-2 leading-snug">{t.title}</div>
                            <div className="text-[11px] text-white/40 mt-1">{t.project} • {t.assignee}</div>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-[10px] font-mono text-white/30">Due {t.due}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10">Comment</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass rounded-[16px] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <thead className="bg-white/[0.03] border-b border-white/10 text-[10px] font-mono text-white/40 tracking-widest">
                        <tr><th className="text-left px-4 py-3">TICKET</th><th className="text-left px-4 py-3">TITLE</th><th className="text-left px-4 py-3">PROJECT</th><th className="text-left px-4 py-3">PRIORITY</th><th className="text-left px-4 py-3">STATUS</th><th className="text-left px-4 py-3">ASSIGNEE</th><th className="text-left px-4 py-3">DUE</th></tr>
                      </thead>
                      <tbody>
                        {tickets.map(t=>(
                          <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.03]">
                            <td className="px-4 py-3 font-mono text-[#0EA5FF]">{t.id}</td>
                            <td className="px-4 py-3 font-medium max-w-[280px] truncate">{t.title}</td>
                            <td className="px-4 py-3 text-white/60">{t.project}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${t.priority==='P1'?'bg-[#FF4D6D]/15 text-[#FF4D6D]':'bg-[#FFD700]/15 text-[#FFD700]'}`}>{t.priority}</span></td>
                            <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[11px]">{t.status}</span></td>
                            <td className="px-4 py-3 text-white/60">{t.assignee}</td>
                            <td className="px-4 py-3 text-white/40 font-mono">{t.due}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {newTicketOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={()=>setNewTicketOpen(false)}>
                  <div className="w-full max-w-[520px] glass-strong rounded-[20px] p-5" onClick={e=>e.stopPropagation()}>
                    <h3 className="font-display font-semibold">Raise New Ticket → Admin CRM Tickets Kanban</h3>
                    <div className="mt-4 space-y-3">
                      <input value={ticketForm.title} onChange={e=>setTicketForm({...ticketForm, title:e.target.value})} placeholder="Title — Fix DVSA CSV import timeout" className="w-full px-3 py-2.5 rounded-xl bg-[#05070D] border border-white/15 text-[13px] outline-none" />
                      <textarea value={ticketForm.description} onChange={e=>setTicketForm({...ticketForm, description:e.target.value})} placeholder="Description + steps to reproduce" rows={3} className="w-full px-3 py-2.5 rounded-xl bg-[#05070D] border border-white/15 text-[13px] outline-none resize-none" />
                      <div className="grid grid-cols-2 gap-3">
                        <select value={ticketForm.project} onChange={e=>setTicketForm({...ticketForm, project:e.target.value})} className="px-3 py-2.5 rounded-xl bg-[#05070D] border border-white/15 text-[12px] outline-none">
                          {projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                        <select value={ticketForm.priority} onChange={e=>setTicketForm({...ticketForm, priority:e.target.value as any})} className="px-3 py-2.5 rounded-xl bg-[#05070D] border border-white/15 text-[12px] outline-none">
                          <option value="P1">P1 Emergency</option><option value="P2">P2 Standard</option><option value="P3">P3 Low</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button disabled={busy} onClick={handleTicketCreate} className="flex-1 py-2.5 rounded-xl bg-[#FFD700] text-black font-semibold text-[12px] disabled:opacity-50">Create Ticket</button>
                      <button onClick={()=>setNewTicketOpen(false)} className="px-4 py-2.5 rounded-xl bg-white/10 text-[12px]">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CHAT / AVA */}
          {activeTab==='chat' && (
            <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-98px-0px)] flex flex-col animate-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-[20px] font-semibold">Chat / AVA — Same as Contact OS + Floating Widget</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#84FF3D]/15 text-[#84FF3D] border border-[#84FF3D]/20">AVA ONLINE</span>
                  <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-white/5 border border-white/10">Job Score 8.4/10</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                <div className="lg:col-span-1 glass rounded-[16px] p-3 flex flex-col min-h-0">
                  <div className="text-[10px] font-mono tracking-widest text-white/30 mb-3 px-1">HISTORY</div>
                  <div className="space-y-1.5 overflow-auto">
                    {[
                      { name:'Captain', last:'Deploying VEXO-014 fix to staging...', time:'10:15', unread:0, active:true },
                      { name:'AVA — Vexo Scoping', last:'Proposed £2.8k / 6 days for SMS', time:'09:42', unread:1, active:false },
                      { name:'AVA — Onboarding', last:'73% complete — remaining QA', time:'Yesterday', unread:0, active:false },
                    ].map(c=>(
                      <div key={c.name} className={`p-3 rounded-xl border cursor-pointer ${c.active?'bg-white/[0.07] border-white/15':'bg-white/[0.03] border-transparent hover:bg-white/[0.05]'}`}>
                        <div className="flex justify-between"><span className="text-[12px] font-medium">{c.name}</span><span className="text-[10px] font-mono text-white/30">{c.time}</span></div>
                        <div className="text-[11px] text-white/50 mt-1 truncate">{c.last}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-3 border-t border-white/10">
                    <div className="text-[11px] text-white/40 font-mono">Escalate to Captain anytime — SLA 4hr professional</div>
                    <button className="mt-2 w-full py-2 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 text-[#FF4D6D] text-[12px] font-semibold">Escalate to Captain</button>
                  </div>
                </div>

                <div className="lg:col-span-2 glass rounded-[16px] flex flex-col min-h-[420px]">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0EA5FF] to-[#84FF3D] p-[1px]"><div className="w-full h-full rounded-[10px] bg-[#0B0F1A] flex items-center justify-center font-bold text-[11px]">AVA</div></div>
                      <div><div className="text-[13px] font-semibold">AVA + Captain — Vexo Garage OS</div><div className="text-[10px] font-mono text-white/40">Answers with project data • Proposes stack + estimate</div></div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-white/5 border border-white/10">Live</span>
                  </div>

                  <div className="flex-1 overflow-auto p-4 space-y-3">
                    {chats.map(m=>(
                      <div key={m.id} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                        <div className={`max-w-[78%] px-3 py-2.5 rounded-2xl text-[12px] leading-relaxed border ${m.role==='user'?'bg-[#0EA5FF] text-black border-[#0EA5FF] rounded-br-[6px]': m.role==='captain'?'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20 rounded-bl-[6px]':'bg-white/[0.06] border-white/10 text-white/80 rounded-bl-[6px]'}`}>
                          <div className="text-[10px] font-mono opacity-60 mb-1">{m.role.toUpperCase()} • {m.time}</div>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="p-3 border-t border-white/10">
                    <div className="flex gap-2">
                      <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') handleChatSend(); }} placeholder="Ask 'What is my Vexo progress?' or describe new project..." className="flex-1 px-3 py-2.5 rounded-xl bg-[#05070D] border border-white/15 text-[13px] outline-none focus:border-[#0EA5FF]/40" />
                      <button onClick={handleChatSend} disabled={busy || !chatInput.trim()} className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-[12px] disabled:opacity-40">Send</button>
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-white/30">// WIRE: user_chats → Admin CRM chats + AVA scoring + SES notify Captain on P1</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INVOICES */}
          {activeTab==='invoices' && (
            <div className="p-4 md:p-6 lg:p-8 space-y-5 animate-in">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[22px] font-semibold">Invoices — S3 SES SNS + Stripe</h2>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/20">1 Due — £4,500</span>
              </div>
              <div className="glass rounded-[16px] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead className="bg-white/[0.03] border-b border-white/10 text-[10px] font-mono text-white/40 tracking-widest">
                      <tr><th className="text-left px-4 py-3">INVOICE</th><th className="text-left px-4 py-3">PROJECT</th><th className="text-left px-4 py-3">AMOUNT</th><th className="text-left px-4 py-3">STATUS</th><th className="text-left px-4 py-3">DUE</th><th className="text-left px-4 py-3">ACTIONS</th></tr>
                    </thead>
                    <tbody>
                      {MOCK_INVOICES.map(inv=>(
                        <tr key={inv.id} className="border-b border-white/[0.04] hover:bg-white/[0.03]">
                          <td className="px-4 py-3 font-mono font-bold">{inv.id}</td>
                          <td className="px-4 py-3">{inv.project}</td>
                          <td className="px-4 py-3 font-mono font-semibold">£{inv.amount.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${inv.status==='Paid'?'bg-[#84FF3D]/15 text-[#84FF3D]':'bg-[#FFD700]/15 text-[#FFD700]'}`}>{inv.status}</span>
                              <span className="text-[10px] text-white/40">{inv.type}</span>
                            </div>
                            <div className="mt-1 h-1 w-24 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-[#0EA5FF]" style={{ width:`${inv.progress}%` }} /></div>
                          </td>
                          <td className="px-4 py-3 text-white/50 font-mono">{inv.due}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[11px]">View PDF</button>
                              {inv.status!=='Paid' && <button className="px-2.5 py-1 rounded-lg bg-[#0EA5FF] text-black font-semibold text-[11px]">Pay via Stripe</button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FILES / VAULT */}
          {activeTab==='files' && (
            <div className="p-4 md:p-6 lg:p-8 space-y-5 animate-in">
              <h2 className="font-display text-[22px] font-semibold">Files / Vault — Client-only S3 • Archive5 • Version History</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name:'Vexo_Booking_OS_Flow_v1.2.pdf', type:'Deliverable', size:'4.2MB', time:'2h ago' },
                  { name:'DVSA_Importer_Spec.docx', type:'SOP', size:'1.1MB', time:'Yesterday' },
                  { name:'MOT_Reminder_Templates_Mega.json', type:'Evidence', size:'12KB', time:'2 days ago' },
                  { name:'Companies_House_API_Creds.env', type:'Compliance', size:'0.8KB', time:'3 days ago', restricted:true },
                  { name:'Vexo_Go_Live_Checklist.pdf', type:'Deliverable', size:'2.4MB', time:'4 days ago' },
                  { name:'Invoice_AK-2026-014.pdf', type:'Invoice', size:'180KB', time:'5 days ago' },
                ].map(f=>(
                  <div key={f.name} className="glass rounded-[16px] p-4 flex flex-col">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-mono px-2 py-1 rounded-full border ${f.type==='Evidence'?'bg-[#84FF3D]/10 text-[#84FF3D] border-[#84FF3D]/20':'bg-white/5 text-white/50 border-white/10'}`}>{f.type}</span>
                      {f.restricted && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#FF4D6D]/15 text-[#FF4D6D]">RESTRICTED</span>}
                    </div>
                    <div className="mt-3 text-[12px] font-medium leading-tight break-all">{f.name}</div>
                    <div className="mt-1 text-[10px] font-mono text-white/40">{f.size} • {f.time} • S3 + Archive5</div>
                    <div className="mt-3 flex gap-1.5">
                      <button className="flex-1 py-1.5 rounded-lg bg-white/10 text-[11px]">Open S3</button>
                      <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px]">History</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUPPORT */}
          {activeTab==='support' && (
            <div className="p-4 md:p-6 lg:p-8 space-y-5 animate-in max-w-[900px]">
              <h2 className="font-display text-[22px] font-semibold">Support — Emergency Hotline + Knowledge Base</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-[20px] p-[1px] bg-gradient-to-br from-[#FF4D6D]/50 to-[#FFD700]/30">
                  <div className="rounded-[19px] bg-[#0B0F1A] p-5">
                    <div className="text-[11px] font-mono tracking-widest text-[#FF4D6D]">EMERGENCY HOTLINE — 24/7 CRASH</div>
                    <div className="mt-2 text-[20px] font-bold font-display">30min triage • 2hr mitigation</div>
                    <div className="mt-2 text-[12px] text-white/60 leading-relaxed">From Services page — Professional tier: 4hr response, Enterprise 30min-2hr. This is the same SLA as Admin CRM emergency flow.</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-[11px]"><span className="text-white/40 font-mono">Hotline</span><span className="font-mono font-bold">+44 161 123 4567</span></div>
                      <div className="flex justify-between text-[11px]"><span className="text-white/40 font-mono">Escalation</span><span className="font-mono">Captain direct — app.aikova.co.uk/user</span></div>
                    </div>
                    <button className="mt-4 w-full py-2.5 rounded-xl bg-[#FF4D6D] text-white font-bold text-[12px]">Call Emergency</button>
                  </div>
                </div>

                <div className="glass rounded-[20px] p-5">
                  <div className="text-[11px] font-mono tracking-widest text-white/40">KNOWLEDGE BASE</div>
                  <div className="mt-3 space-y-2">
                    {[
                      { title:'Portfolio — Vexo Case Study', desc:'How we built Vexo Garage OS for Oldham MOT' },
                      { title:'Services — Industrial Software', desc:'Twin-guided workstations pattern' },
                      { title:'Solutions — Garage OS Playbook', desc:'DVSA + Odoo + WhatsApp integration' },
                      { title:'Industries — Paper SOPs → Twin', desc:'Methodology we use for Vexo' },
                    ].map(kb=>(
                      <div key={kb.title} className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.06] cursor-pointer">
                        <div className="text-[12px] font-medium">{kb.title}</div>
                        <div className="text-[11px] text-white/50 mt-0.5">{kb.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass rounded-[16px] p-4 flex items-center justify-between">
                <div className="text-[11px] font-mono text-white/40">AiKOVA Client Portal • Production ready single file • Deploy to app.aikova.co.uk/user • Wired to Admin CRM leads, tickets, chats</div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#84FF3D] animate-pulse" />
                  <span className="text-[11px] font-mono text-white/60">Client isolation — no access to other clients or full Industrial Lead List</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile nav overlay */}
      {mobileNav && <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={()=>setMobileNav(false)} />}
    </div>
  );
}

// @ts-nocheck — Tailwind DOM artefact; web-only.
/**
 * AiKOVA Industries We Serve.
 * Source: design/industries-serve (Aikova+Industries+We+Serve.tar.gz)
 * Wired as /industries via app/industries.web.tsx
 */
import { useEffect, useRef, useState } from "react";
import {
  Factory,
  TrendingUp,
  Scale,
  Truck,
  HeartPulse,
  Package,
  ArrowRight,
  Layers,
  Cpu,
  ShieldCheck,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  FileStack,
  Brain,
  MapPinned,
  Database,
  Zap,
  Fingerprint,
  Lock,
} from "lucide-react";

/** Served from Expo public/ on web. */
const logoUrl = '/aikova-portfolio-logo.png';

const INDUSTRIES = [
  {
    id: "heavy",
    icon: Factory,
    label: "HEAVY INDUSTRY / MANUFACTURING",
    short: "Heavy Industry",
    problem: "Paper SOPs causing onboarding delays and audit failures",
    oldWay: ["PDF binders, 400+ pages", "Clipboard checks, lost", "Tribal knowledge, retirees gone", "Failed audits, £12k penalty"],
    aiWay: [
      "Digital Twin SOPs — 3D workstation overlay",
      "Step-guided AR overlay — can't skip step",
      "Live evidence capture — photo + timestamp",
      "Auto-audit trail — 100% vaulted",
    ],
    osBuilt: "Vexo Garage pattern + Industrial MES — Twin SOP Engine, Workstation Tablet OS, Evidence Vault",
    tech: ["IIoT Sensors", "MES", "WMS", "Predictive Maintenance", "Odoo", "Dynamics 365", "Supabase Realtime", "S3 R2", "Twin 3D (UE5.8)"],
    outcomes: [
      { k: "Onboarding", v: "3d → 4h", sub: "-92% time" },
      { k: "Audit Pass", v: "100%", sub: "was 67%" },
      { k: "Paper", v: "0 sheets", sub: "eliminated" },
    ],
    color: "#0EA5FF",
    accent: "#84FF3D",
    // WIRE: Paper stack → Twin workstation → Tablet guided steps → Green audit check
    infographic: "heavy" as const,
  },
  {
    id: "trading",
    icon: TrendingUp,
    label: "PROP TRADING / FINTECH",
    short: "Prop Trading",
    problem: "Evaluation bottlenecks killing trader conversion",
    oldWay: ["Manual review 48hrs", "Inconsistent rulings", "32% pass, churn 68%", "Wallet fraud undetected"],
    aiWay: [
      "Guardian 8%/15%/25% Tap Out — live risk",
      "Mon-Fri Chain Must Complete — no skipping",
      "Boat 30sec wallet scan — Moralis/Ankr",
      "68% assessment pass — fair & fast",
    ],
    osBuilt: "TradeFlow OS FLAGSHIP — 36 OS Pages, 65 Backend Files, 10 Modules, 3 Bots, Alchemy Moralis Ankr QuickNode, Binance/Bybit encrypted vault",
    tech: ["Navy #0A1931 Gold #FFD700", "TradingView", "BullMQ", "Supabase", "Web3", "Guardian Risk Engine"],
    outcomes: [
      { k: "Review Time", v: "48h → 90s", sub: "-99% latency" },
      { k: "Conversion", v: "+40%", sub: "to funded" },
      { k: "Pricing", v: "£49 +10%", sub: "£35 live" },
    ],
    color: "#FFD700",
    accent: "#0EA5FF",
    infographic: "trading" as const,
  },
  {
    id: "legal",
    icon: Scale,
    label: "LEGAL / MSA",
    short: "Legal / MSA",
    problem: "Contract review burning partner hours",
    oldWay: ["6hrs per MSA", "Redlines lost in email", "Evidence scattered, no chain", "Partner bottleneck"],
    aiWay: [
      "AI clause extraction — Pinecone + Claude",
      "Risk scoring — auto-flag liability",
      "Vaulted evidence — S3 + Archive5 chain",
      "Partner approve in 15min — not 6hrs",
    ],
    osBuilt: "Contract OS (VisaGuide pattern) — Clause Engine, Redline Tracker, Evidence Vault (S3 + Archive5), PostHog + Sentry",
    tech: ["Next.js 14", "Pinecone Vector", "Claude", "Supabase RLS", "DocuSign API", "Odoo"],
    outcomes: [
      { k: "Review", v: "6h → 15m", sub: "-95% time" },
      { k: "Partner Hours", v: "-80%", sub: "saved weekly" },
      { k: "Vaulted", v: "100%", sub: "evidence chain" },
    ],
    color: "#0EA5FF",
    accent: "#84FF3D",
    infographic: "legal" as const,
  },
  {
    id: "logistics",
    icon: Truck,
    label: "LOGISTICS",
    short: "Logistics",
    problem: "Fragmented carrier tracking",
    oldWay: ["Calls, 40 per day per load", "Spreadsheets, version hell", "ETA lies, missed SLAs", "Client blind"],
    aiWay: [
      "Unified carrier API — 12 carriers one schema",
      "Real-time GPS — IoT + Supabase Realtime",
      "Predictive ETA engine — ML delay prediction",
      "Client portal — live map + proof",
    ],
    osBuilt: "Road Angel OS — Tracking OS + Dispatch OS + Driver App + Client Portal",
    tech: ["Mapbox", "Google Maps", "Supabase Realtime", "SNS Push", "IoT GPS", "BullMQ", "Odoo WMS"],
    outcomes: [
      { k: "Calls", v: "-70%", sub: "ops calls" },
      { k: "ETA Accuracy", v: "92%", sub: "was 61%" },
      { k: "SLA Pass", v: "+35%", sub: "on-time" },
    ],
    color: "#84FF3D",
    accent: "#0EA5FF",
    infographic: "logistics" as const,
  },
  {
    id: "healthcare",
    icon: HeartPulse,
    label: "HEALTHCARE",
    short: "Healthcare",
    problem: "Patient data silos across systems",
    oldWay: ["EHR + Lab + Imaging + Billing siloed", "Clinicians hunting, 22min chart", "No RLS, HIPAA risk", "Trust low"],
    aiWay: [
      "Unified FHIR gateway — HL7 → FHIR normalise",
      "Single patient timeline — one view",
      "Role-based RLS — clinician only their patients",
      "Evidence Vault HIPAA — S3 HIPAA + audit",
    ],
    osBuilt: "MediSync Pattern (from VisaGuide) — FHIR Gateway, Clinical Timeline OS, Evidence Vault HIPAA",
    tech: ["FHIR", "HL7", "Supabase RLS", "S3 HIPAA", "PostHog", "Sentry", "Odoo", "ISO 27001", "HIPAA"],
    outcomes: [
      { k: "Chart Time", v: "-60%", sub: "per patient" },
      { k: "Trust", v: "+90%", sub: "clinician NPS" },
      { k: "Compliance", v: "HIPAA", sub: "compliant" },
    ],
    color: "#0EA5FF",
    accent: "#FFD700",
    infographic: "healthcare" as const,
  },
  {
    id: "retail",
    icon: Package,
    label: "RETAIL SUPPLY",
    short: "Retail Supply",
    problem: "Stockouts and overstock — firefighting",
    oldWay: ["Manual reorder, gut feel", "Spreadsheet, 3 versions", "Stockouts 12%, overstock 18%", "Firefighting daily"],
    aiWay: [
      "Demand forecast — Python ML + Pinecone vectors",
      "Supplier auto-order — Odoo + Shopify trigger",
      "Live stock twin — real WMS mirror",
      "Firefighting ended — SNS alerts only exceptions",
    ],
    osBuilt: "RetailSense Pattern — Demand Engine, Supplier OS, Stock Twin, WMS integration",
    tech: ["Python ML", "Pinecone demand vectors", "Supabase", "S3", "Odoo WMS", "Shopify/Magento", "SNS alerts"],
    outcomes: [
      { k: "Stockouts", v: "-85%", sub: "out-of-stock" },
      { k: "Overstock", v: "-60%", sub: "carrying cost" },
      { k: "Firefighting", v: "ENDED", sub: "ops mode" },
    ],
    color: "#84FF3D",
    accent: "#FFD700",
    infographic: "retail" as const,
  },
];

function FlowHeavy() {
  return (
    <div className="w-full rounded-[18px] bg-[#0A0F1E]/80 border border-white/[0.08] p-5 backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-2 items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-[56px] h-[72px] rounded-[8px] bg-[#151A2A] border border-white/10 flex flex-col p-1.5 gap-1">
            <div className="h-[6px] w-[70%] bg-white/20 rounded-full" />
            <div className="h-[4px] w-[90%] bg-white/10 rounded-full" />
            <div className="h-[4px] w-[60%] bg-white/10 rounded-full" />
            <div className="mt-1 grid grid-cols-3 gap-1">
              <div className="h-[14px] bg-[#0EA5FF]/20 rounded-sm" />
              <div className="h-[14px] bg-white/5 rounded-sm" />
              <div className="h-[14px] bg-white/5 rounded-sm" />
            </div>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-white/40">PAPER STACK</span>
          <span className="text-[10px] text-[#FF5A5A] font-mono">× FAIL</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-[2px] bg-gradient-to-r from-white/10 to-[#0EA5FF]/60 relative">
            <div className="absolute right-0 -top-[3px] w-0 h-0 border-l-[6px] border-l-[#0EA5FF] border-y-[4px] border-y-transparent" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-[64px] h-[48px] rounded-[10px] bg-[#0EA5FF]/15 border border-[#0EA5FF]/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,255,0.4),transparent_70%)]" />
            <Cpu className="w-6 h-6 text-[#0EA5FF]" />
          </div>
          <span className="text-[9px] font-mono tracking-widest text-white/60">TWIN WORKSTATION</span>
          <span className="text-[10px] text-[#0EA5FF] font-mono">LIVE TWIN</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-[64px] h-[48px] rounded-[10px] bg-[#84FF3D]/15 border border-[#84FF3D]/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-[#84FF3D]" />
          </div>
          <span className="text-[9px] font-mono tracking-widest text-white/60">TABLET GUIDE</span>
          <span className="text-[10px] text-[#84FF3D] font-mono">✓ AUDIT 100%</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-[2px] flex-1 bg-white/10 rounded-full" />
        <div className="h-[2px] flex-1 bg-[#0EA5FF]/60 rounded-full" />
        <div className="h-[2px] flex-1 bg-[#84FF3D] rounded-full" />
      </div>
    </div>
  );
}
function FlowTrading() {
  return (
    <div className="w-full rounded-[18px] bg-[#12100A]/80 border border-[#FFD700]/15 p-5 backdrop-blur-xl">
      <svg viewBox="0 0 340 86" className="w-full h-[86px]">
        <defs>
          <linearGradient id="g1" x1="0" x2="1"><stop offset="0%" stopColor="#FFD700" stopOpacity={0.1}/><stop offset="100%" stopColor="#0EA5FF" stopOpacity={0.8}/></linearGradient>
        </defs>
        {/* funnel */}
        <path d="M10 10 L80 10 L65 76 L25 76 Z" fill="rgba(255,90,90,0.12)" stroke="rgba(255,90,90,0.3)" />
        <text x="22" y="45" fontSize="9" fontFamily="JetBrains Mono" fill="#FF5A5A">32% PASS</text>
        {/* arrow */}
        <path d="M92 43 L122 43" stroke="url(#g1)" strokeWidth="2" strokeDasharray="4 4" />
        {/* playbook box */}
        <rect x="124" y="12" width="88" height="62" rx="10" fill="rgba(14,165,255,0.15)" stroke="#0EA5FF" strokeOpacity={0.4} />
        <text x="136" y="32" fontSize="8" fontFamily="JetBrains Mono" fill="#0EA5FF">PLAYBOOK AI</text>
        <text x="136" y="44" fontSize="7" fontFamily="Inter" fill="white" fillOpacity={0.6}>Guardian 8/15/25</text>
        <text x="136" y="54" fontSize="7" fontFamily="Inter" fill="white" fillOpacity={0.6}>Chain Check</text>
        <text x="136" y="64" fontSize="7" fontFamily="Inter" fill="white" fillOpacity={0.6}>Wallet 30s</text>
        {/* arrow */}
        <path d="M220 43 L250 43" stroke="#84FF3D" strokeWidth="2" />
        <polygon points="250,43 244,39 244,47" fill="#84FF3D" />
        {/* live */}
        <rect x="254" y="12" width="76" height="62" rx="14" fill="rgba(132,255,61,0.15)" stroke="#84FF3D" />
        <text x="268" y="36" fontSize="10" fontFamily="Sora" fontWeight={700} fill="#84FF3D">LIVE</text>
        <text x="268" y="50" fontSize="8" fontFamily="JetBrains Mono" fill="white" fillOpacity={0.7}>68% PASS</text>
      </svg>
      <div className="mt-2 flex justify-between text-[9px] font-mono tracking-widest text-white/30"><span>BOTTLENECK</span><span>AI REVIEW</span><span>CHAIN → LIVE</span></div>
    </div>
  );
}
function FlowLegal() {
  return (
    <div className="w-full rounded-[18px] bg-[#0F1218]/80 border border-white/10 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <div className="w-10 h-14 rounded bg-[#1E2330] border border-white/10 flex items-center justify-center"><FileStack className="w-5 h-5 text-white/30" /></div>
          <div className="w-10 h-14 rounded bg-[#1E2330] border border-white/10 flex items-center justify-center"><FileStack className="w-5 h-5 text-white/20" /></div>
          <div className="w-10 h-14 rounded bg-[#1E2330] border border-white/10 flex items-center justify-center"><FileStack className="w-5 h-5 text-white/10" /></div>
        </div>
        <ArrowRight className="w-4 h-4 text-white/20 mx-1" />
        <div className="flex-1 rounded-[10px] bg-[#0EA5FF]/10 border border-[#0EA5FF]/20 p-2 flex gap-1.5 flex-wrap">
          {["Indemnity", "Liability", "Term 8.2", "MSA Risk"].map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-[#0EA5FF]/20 text-[8px] font-mono text-[#0EA5FF] border border-[#0EA5FF]/20">{t}</span>
          ))}
        </div>
        <ArrowRight className="w-4 h-4 text-white/20 mx-1" />
        <div className="w-[72px] h-[54px] rounded-[10px] bg-[#84FF3D]/10 border border-[#84FF3D]/30 flex flex-col items-center justify-center gap-1">
          <Lock className="w-4 h-4 text-[#84FF3D]" />
          <span className="text-[7px] font-mono text-[#84FF3D]">VAULTED</span>
          <div className="flex gap-0.5"><div className="w-1 h-1 rounded-full bg-[#84FF3D]" /><div className="w-1 h-1 rounded-full bg-[#84FF3D]/50" /><div className="w-1 h-1 rounded-full bg-[#84FF3D]/20" /></div>
        </div>
      </div>
    </div>
  );
}
function FlowLogistics() {
  return (
    <div className="w-full rounded-[18px] bg-[#0A1210]/80 border border-[#84FF3D]/15 p-5 backdrop-blur-xl">
      <svg viewBox="0 0 340 90" className="w-full h-[90px]">
        {/* fragmented */}
        <circle cx="20" cy="20" r="4" fill="#FF5A5A" opacity={0.6} />
        <circle cx="40" cy="35" r="3" fill="#FF5A5A" opacity={0.3} />
        <circle cx="55" cy="18" r="5" fill="#FF5A5A" opacity={0.4} />
        <circle cx="30" cy="55" r="3" fill="white" opacity={0.2} />
        {/* unified map box */}
        <rect x="95" y="10" width="110" height="70" rx="12" fill="rgba(14,165,255,0.12)" stroke="#0EA5FF" strokeOpacity={0.3} />
        <circle cx="130" cy="35" r="3" fill="#0EA5FF" />
        <circle cx="150" cy="50" r="3" fill="#84FF3D" />
        <circle cx="175" cy="30" r="3" fill="#FFD700" />
        <path d="M130 35 L150 50 L175 30" stroke="white" strokeOpacity={0.3} strokeDasharray="2 3" fill="none" />
        {/* ETA line */}
        <path d="M220 60 Q 270 20 320 25" stroke="#84FF3D" strokeWidth={2} fill="none" />
        <circle cx="320" cy="25" r="5" fill="#84FF3D" />
        <text x="305" y="18" fontSize="8" fontFamily="JetBrains Mono" fill="#84FF3D">ETA 92%</text>
      </svg>
      <div className="flex justify-between text-[9px] font-mono text-white/30 tracking-widest"><span>FRAGMENTED</span><span>UNIFIED MAP</span><span>PREDICTIVE ETA</span></div>
    </div>
  );
}
function FlowHealthcare() {
  return (
    <div className="w-full rounded-[18px] bg-[#0A1020]/80 border border-white/10 p-5 backdrop-blur-xl">
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-5 grid grid-cols-2 gap-1.5">
          {["EHR", "LAB", "IMG", "BILL"].map((k) => (
            <div key={k} className="h-[30px] rounded-[8px] bg-[#1A2338] border border-white/10 flex items-center justify-center text-[9px] font-mono text-white/40">{k}</div>
          ))}
        </div>
        <div className="col-span-2 flex justify-center"><div className="w-[36px] h-[36px] rounded-full bg-[#0EA5FF]/20 border border-[#0EA5FF]/40 flex items-center justify-center"><Database className="w-4 h-4 text-[#0EA5FF]" /></div></div>
        <div className="col-span-5">
          <div className="rounded-[10px] bg-white/[0.04] border border-white/10 p-2">
            <div className="flex items-center gap-1.5 mb-1.5"><div className="w-5 h-5 rounded-full bg-[#84FF3D]/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-[#84FF3D]" /></div><span className="text-[10px] font-medium text-white">Single Timeline</span></div>
            <div className="space-y-1">
              <div className="h-[4px] w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-[#0EA5FF]" /></div>
              <div className="h-[4px] w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[70%] bg-[#84FF3D]" /></div>
              <div className="h-[4px] w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[92%] bg-[#FFD700]" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function FlowRetail() {
  return (
    <div className="w-full rounded-[18px] bg-[#11180A]/80 border border-[#84FF3D]/15 p-5 backdrop-blur-xl">
      <svg viewBox="0 0 340 88" className="w-full h-[88px]">
        {/* chaos bars */}
        <rect x="10" y="20" width="18" height="40" rx="3" fill="#FF5A5A" opacity={0.7} />
        <rect x="32" y="10" width="18" height="50" rx="3" fill="white" opacity={0.15} />
        <rect x="54" y="35" width="18" height="25" rx="3" fill="#FF5A5A" opacity={0.4} />
        <text x="12" y="75" fontSize="7" fontFamily="JetBrains Mono" fill="#FF5A5A">STOCKOUT 12%</text>
        {/* forecast arrow */}
        <path d="M90 44 L120 44" stroke="#0EA5FF" strokeDasharray="4 3" />
        {/* forecast chart */}
        <rect x="122" y="14" width="78" height="60" rx="10" fill="rgba(14,165,255,0.12)" stroke="#0EA5FF" strokeOpacity={0.3} />
        <path d="M130 50 L145 38 L160 45 L175 28 L192 32" fill="none" stroke="#0EA5FF" strokeWidth={1.5} />
        {/* auto replenish */}
        <path d="M210 44 L240 44" stroke="#84FF3D" />
        <rect x="242" y="18" width="86" height="52" rx="12" fill="rgba(132,255,61,0.12)" stroke="#84FF3D" />
        <rect x="252" y="30" width="20" height="20" rx="4" fill="rgba(132,255,61,0.3)" />
        <rect x="276" y="30" width="20" height="20" rx="4" fill="rgba(132,255,61,0.3)" />
        <rect x="300" y="30" width="20" height="20" rx="4" fill="rgba(132,255,61,0.5)" />
        <text x="252" y="66" fontSize="7" fontFamily="JetBrains Mono" fill="#84FF3D">BALANCED TWIN ✓</text>
      </svg>
    </div>
  );
}

const flowMap = {
  heavy: FlowHeavy,
  trading: FlowTrading,
  legal: FlowLegal,
  logistics: FlowLogistics,
  healthcare: FlowHealthcare,
  retail: FlowRetail,
};

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function IndustriesServeApp() {

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    body.style.height = 'auto';
    if (root) root.style.height = 'auto';
    if (!document.getElementById('aikova-tw-cdn')) {
      const s = document.createElement('script');
      s.id = 'aikova-tw-cdn';
      s.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(s);
    }
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.height = '';
      if (root) root.style.height = '';
    };
  }, []);


  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full bg-[#05070D] text-white selection:bg-[#0EA5FF]/30 selection:text-white overflow-x-clip"
      style={{
        boxSizing: "border-box",
        paddingTop: "var(--safe-area-inset-top)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');
        .font-sora { font-family: "Sora", sans-serif; }
        .font-mono { font-family: "JetBrains Mono", monospace; }
        .glass {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          backdrop-filter: blur(18px) saturate(130%);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .glass-strong {
          background: radial-gradient(120% 120% at 0% 0%, rgba(14,165,255,0.18), rgba(255,255,255,0.03) 50%, rgba(0,0,0,0.3));
          backdrop-filter: blur(24px) saturate(140%);
          border: 1px solid rgba(255,255,255,0.10);
        }
        .text-gradient-infra {
          background: linear-gradient(90deg, #0EA5FF 0%, #84FF3D 55%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glow-blue { box-shadow: 0 0 40px rgba(14,165,255,0.35), inset 0 1px 0 rgba(255,255,255,0.1); }
        .glow-green { box-shadow: 0 0 32px rgba(132,255,61,0.30); }
        @keyframes slideUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-slide { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      {/* Site nav: ArtefactFrame */}


      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-[30%] left-[10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(14,165,255,0.22),transparent_60%)] blur-[40px]" />
          <div className="absolute top-[20%] right-[-15%] w-[55%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(132,255,61,0.18),transparent_60%)] blur-[50px]" />
          <div className="absolute bottom-[-20%] left-[30%] w-[60%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.10),transparent_70%)] blur-[60px]" />
          {/* grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: "64px 64px" }} />
        </div>

        <div className="relative mx-auto max-w-[1320px] px-6 pt-[64px] md:pt-[96px] pb-[48px]">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0EA5FF]/10 border border-[#0EA5FF]/20 text-[11px] font-mono tracking-widest text-[#0EA5FF]"><span className="w-1.5 h-1.5 rounded-full bg-[#0EA5FF] animate-pulse" />OLDHAM OL8 → GLOBAL</span>
            <span className="inline-flex px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-widest text-white/50">6 INDUSTRIES • 6 OS BUILT • PRODUCTION READY</span>
          </div>

          <h1 className="font-sora font-[800] leading-[0.88] tracking-[-0.04em] text-[12vw] md:text-[84px] lg:text-[112px]">
            <span className="block text-white">Where AI Becomes</span>
            <span className="block text-gradient-infra">Infrastructure</span>
          </h1>

          <div className="mt-8 grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <p className="text-[18px] md:text-[22px] leading-[1.35] tracking-[-0.01em] text-white/70 max-w-[640px]">
                We don&apos;t build demos. We replace <span className="text-white">paper SOPs</span>, <span className="text-white">broken carrier tracking</span>, <span className="text-white">patient silos</span>, and <span className="text-white">trader bottlenecks</span> with OS that run 24/7. <span className="text-[#84FF3D]">6 industries, 6 OS built, Oldham OL8 → Global.</span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#industries" className="h-[44px] px-6 rounded-full bg-white text-black font-semibold text-[14px] inline-flex items-center gap-2 hover:bg-white/90 transition">Explore OS <ArrowRight className="w-4 h-4" /></a>
                <button className="h-[44px] px-6 rounded-full border border-white/15 text-white/80 text-[14px] font-medium inline-flex items-center gap-2 hover:bg-white/5 transition"><ShieldCheck className="w-4 h-4" /> View Evidence Vault</button>
              </div>
            </div>
            <div className="lg:col-span-5">
              {/* metrics glass */}
              <div className="glass-strong rounded-[20px] p-[1px]">
                <div className="rounded-[19px] bg-[#05070D]/90 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono tracking-[0.18em] text-white/40">LIVE TELEMETRY</span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#84FF3D]"><span className="w-1.5 h-1.5 rounded-full bg-[#84FF3D] animate-pulse" />99.9% UPTIME</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { k: "23K", l: "Garages", c: "#0EA5FF" },
                      { k: "68%", l: "Assessment Pass", c: "#FFD700" },
                      { k: "30sec", l: "Wallet Scan", c: "#84FF3D" },
                      { k: "99.9%", l: "Uptime SLA", c: "#FFFFFF" },
                    ].map((m) => (
                      <div key={m.l} className="rounded-[14px] bg-white/[0.04] border border-white/[0.06] p-4">
                        <div className="text-[24px] font-sora font-bold tracking-tight" style={{ color: m.c }}>{m.k}</div>
                        <div className="text-[11px] font-mono tracking-widest text-white/40 mt-1">{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-white/30"><Clock3 className="w-3.5 h-3.5" />Last deploy 4h ago • BullMQ 0 lag • Supabase Realtime OK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES GRID */}
      <section id="industries" className="relative mx-auto max-w-[1320px] px-6 py-16 md:py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-[0.3em] text-[#0EA5FF] mb-3">02 / INDUSTRIES WE SERVE</div>
            <h2 className="font-sora text-[32px] md:text-[48px] font-bold tracking-tight leading-[0.95]">6 Problems.<br />6 OS. No Slides.</h2>
          </div>
          <p className="max-w-[360px] text-[14px] leading-[1.5] text-white/50">Each card is a production OS. Problem → Old Way → AiKOVA Way → Tech → Outcome. No vapor.</p>
        </div>

        <div className="flex flex-col gap-[72px] md:gap-[96px]">
          {INDUSTRIES.map((ind, idx) => {
            const FlowComp = flowMap[ind.infographic];
            const isEven = idx % 2 === 0;
            return <IndustryCard key={ind.id} ind={ind} idx={idx} isEven={isEven} FlowComp={FlowComp} />;
          })}
        </div>
      </section>

      {/* CROSS-INDUSTRY PATTERNS */}
      <section id="patterns" className="relative border-t border-white/[0.06] bg-[#070A14]/60">
        <div className="mx-auto max-w-[1320px] px-6 py-20 md:py-28">
          <div className="text-[11px] font-mono tracking-[0.3em] text-[#84FF3D] mb-4">03 / CROSS-INDUSTRY PATTERNS</div>
          <h2 className="font-sora text-[30px] md:text-[44px] font-bold tracking-tight leading-[0.95] mb-12 max-w-[720px]">3 reusable OS patterns.<br />Build once, deploy across heavy industry.</h2>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: "Twin-Guided Workstation Pattern",
                where: "Heavy Industry, Healthcare, Retail",
                icon: Layers,
                desc: "Digital Twin SOP engine + tablet OS + evidence vault. Same pattern powers garage workstations, clinical timelines, and stock twins.",
                tags: ["Twin 3D UE5.8", "Workstation Tablet OS", "Evidence Vault S3 R2", "Supabase Realtime"],
                color: "#0EA5FF",
              },
              {
                title: "Playbook-Trained AI Review Pattern",
                where: "Prop Trading, Legal",
                icon: Brain,
                desc: "Guardian risk rules + playbook ingestion + chain validation. Powers trader evaluations and MSA redline acceleration.",
                tags: ["Guardian 8/15/25", "Pinecone Vector", "Claude / BullMQ", "Chain Must Complete"],
                color: "#FFD700",
              },
              {
                title: "Live Network Portal Pattern",
                where: "Logistics, Garage",
                icon: MapPinned,
                desc: "Unified API + real-time GPS + predictive ETA + client portal. Same OS for carrier network and 23K garage network.",
                tags: ["Mapbox + Google", "IoT GPS", "Supabase Realtime", "SNS Push + Odoo WMS"],
                color: "#84FF3D",
              },
            ].map((p) => (
              <div key={p.title} className="group rounded-[22px] glass p-[1px] hover:border-white/15 transition">
                <div className="rounded-[21px] bg-[#0A0E1B]/80 p-6 h-full flex flex-col">
                  <div className="w-10 h-10 rounded-[12px] grid place-items-center border mb-5" style={{ background: `${p.color}18`, borderColor: `${p.color}30`, color: p.color }}>
                    <p.icon className="w-5 h-5" />
                  </div>
                  <div className="text-[11px] font-mono tracking-widest text-white/30 mb-2">{p.where.toUpperCase()}</div>
                  <h3 className="font-sora text-[18px] font-bold leading-[1.1] mb-3">{p.title}</h3>
                  <p className="text-[13px] leading-[1.5] text-white/55 mb-5 flex-1">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono text-white/50">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLIANCE & EVIDENCE */}
      <section id="evidence" className="relative mx-auto max-w-[1320px] px-6 py-20 md:py-28">
        <div className="flex flex-wrap gap-4 items-start justify-between mb-10">
          <div>
            <div className="text-[11px] font-mono tracking-[0.3em] text-[#FFD700] mb-3">04 / COMPLIANCE & EVIDENCE (DOS7)</div>
            <h2 className="font-sora text-[30px] md:text-[44px] font-bold leading-[0.95] tracking-tight">Every industry maps to<br />evidence vault. 12-month chain.</h2>
          </div>
          <div className="rounded-full border border-white/10 px-4 py-2 text-[11px] font-mono text-white/40 flex items-center gap-2"><Fingerprint className="w-4 h-4" />GOV.UK Service Standard • WCAG 2.2 AA</div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { ind: "Heavy Industry", comp: "ISO 45001", color: "#0EA5FF", items: ["Risk assessment vault", "SOP completion chain", "Audit trail 100%"] },
            { ind: "Prop Trading", comp: "FCA", color: "#FFD700", items: ["Wallet scan logs", "Guardian tap-out chain", "Encrypted vault Binance/Bybit"] },
            { ind: "Legal / MSA", comp: "SRA", color: "#0EA5FF", items: ["Clause extraction logs", "Redline tracker S3+Archive5", "Partner approval chain"] },
            { ind: "Logistics", comp: "FORS", color: "#84FF3D", items: ["GPS + ETA proof", "Carrier API logs", "SLA evidence portal"] },
            { ind: "Healthcare", comp: "CQC + HIPAA + FHIR", color: "#0EA5FF", items: ["FHIR gateway logs", "RLS audit", "S3 HIPAA vault"] },
            { ind: "Retail", comp: "SOC2", color: "#84FF3D", items: ["Demand forecast chain", "Supplier order logs", "WMS twin audit"] },
          ].map((c) => (
            <div key={c.ind} className="rounded-[18px] bg-[#0B0F1D] border border-white/[0.07] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-mono tracking-widest text-white/60">{c.ind.toUpperCase()}</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest border" style={{ color: c.color, borderColor: `${c.color}40`, background: `${c.color}15` }}>{c.comp}</span>
              </div>
              <div className="space-y-2">
                {c.items.map((it) => (
                  <div key={it} className="flex items-center gap-2 text-[12px] text-white/55"><div className="w-1 h-1 rounded-full bg-[#84FF3D]" />{it}</div>
                ))}
              </div>
              <div className="mt-4 h-[2px] w-full rounded-full bg-white/5 overflow-hidden"><div className="h-full w-[84%] rounded-full" style={{ background: c.color }} /></div>
              <div className="mt-2 text-[10px] font-mono text-white/25">12-month evidence chain • PostHog + Sentry</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1320px] px-6 py-20 md:py-28">
          <div className="rounded-[28px] overflow-hidden border border-white/10 relative bg-[#0A0E1B]">
            <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_0%_0%,rgba(14,165,255,0.22),transparent),radial-gradient(70%_70%_at_100%_100%,rgba(132,255,61,0.18),transparent)]" />
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
            <div className="relative p-8 md:p-14 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84FF3D]/10 border border-[#84FF3D]/20 text-[11px] font-mono tracking-widest text-[#84FF3D] mb-6">READY FOR OS?</div>
                <h2 className="font-sora text-[28px] md:text-[44px] font-bold leading-[0.95] tracking-tight mb-4">Your SOPs Are Still Paper? Your Tracking Still Phone Calls? <span className="text-gradient-infra">Let&apos;s Build Your OS.</span></h2>
                <p className="text-[15px] leading-[1.5] text-white/55 max-w-[560px]">AVA Triage runs in 90 seconds. Maps your SOPs, carrier gaps, silos, or trader bottlenecks to an OS blueprint. Oldham OL8 engineers, global deployment.</p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3">
                <button className="h-[52px] rounded-full bg-white text-black font-bold text-[15px] tracking-wide inline-flex items-center justify-center gap-2 hover:bg-white/90 transition glow-blue">Start AVA Triage <ArrowRight className="w-5 h-5" /></button>
                <a href="#contact" className="h-[52px] rounded-full border border-white/15 text-white/80 font-medium text-[14px] inline-flex items-center justify-center gap-2 hover:bg-white/5 transition">Talk to Founding Engineer → contact@aikova.io</a>
                <div className="flex items-center gap-2 text-[11px] font-mono text-white/30 mt-2"><ShieldCheck className="w-3.5 h-3.5" />No demo. We ship OS in 14 days.</div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-[11px] font-mono tracking-widest text-white/25">
            <span>© AIKOVA 2025 • OLDHAM OL8 • LONDON • GLOBAL</span>
            <span className="hidden md:inline">•</span>
            <span>BUILT WITH NEXT.JS 14 • SUPABASE • BULLMQ • ODOO • UE5.8</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function IndustryCard({ ind, idx, isEven, FlowComp }: { ind: typeof INDUSTRIES[number]; idx: number; isEven: boolean; FlowComp: React.ComponentType }) {
  const { ref, visible } = useInView();
  const Icon = ind.icon;

  return (
    <div
      ref={ref}
      className={`group relative rounded-[28px] border border-white/[0.08] bg-[#0A0E1B]/70 backdrop-blur-xl overflow-hidden transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${idx * 60}ms` }}
    >
      {/* accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${ind.color}, transparent)` }} />
      <div className="absolute -inset-px rounded-[28px] pointer-events-none opacity-0 group-hover:opacity-100 transition duration-700" style={{ background: `radial-gradient(600px circle at 20% 0%, ${ind.color}15, transparent 60%)` }} />

      <div className={`grid lg:grid-cols-12 gap-0 relative min-w-0`}>
        {/* content */}
        <div className={`lg:col-span-7 p-5 md:p-10 min-w-0 overflow-hidden ${!isEven ? "lg:order-2" : ""}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-[12px] grid place-items-center border" style={{ background: `${ind.color}15`, borderColor: `${ind.color}25`, color: ind.color }}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-[0.22em] text-white/40">{ind.label}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest" style={{ background: `${ind.color}18`, color: ind.color, border: `1px solid ${ind.color}30` }}>OS BUILT</span>
                <span className="text-[11px] font-mono text-white/30">0{idx + 1} / 06</span>
              </div>
            </div>
          </div>

          {/* Problem */}
          <div className="mb-6 min-w-0">
            <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-3.5 h-3.5 text-[#FF5A5A]" /><span className="text-[11px] font-mono tracking-widest text-[#FF5A5A]">PROBLEM</span></div>
            <p className="font-sora text-[19px] md:text-[24px] font-semibold leading-[1.1] tracking-tight break-words">{ind.problem}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-[16px] bg-[#FF5A5A]/[0.06] border border-[#FF5A5A]/15 p-4">
              <div className="text-[10px] font-mono tracking-widest text-[#FF5A5A]/70 mb-2 flex items-center gap-1.5"><Clock3 className="w-3 h-3" />OLD WAY</div>
              <ul className="space-y-1.5">
                {ind.oldWay.map((t) => (
                  <li key={t} className="text-[12px] leading-[1.35] text-white/50 flex gap-2"><span className="text-[#FF5A5A]/50">—</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[16px] bg-[#84FF3D]/[0.06] border border-[#84FF3D]/15 p-4">
              <div className="text-[10px] font-mono tracking-widest text-[#84FF3D]/80 mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3" />AIKOVA WAY</div>
              <ul className="space-y-1.5">
                {ind.aiWay.map((t) => (
                  <li key={t} className="text-[12px] leading-[1.35] text-white/70 flex gap-2"><span className="text-[#84FF3D]">✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-5">
            <div className="text-[10px] font-mono tracking-widest text-white/30 mb-2">OS BUILT</div>
            <p className="text-[12px] leading-[1.5] text-white/60 font-mono border-l-2 pl-3" style={{ borderColor: `${ind.color}50` }}>{ind.osBuilt}</p>
          </div>

          <div className="mb-6 flex flex-wrap gap-1.5">
            {ind.tech.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-white/50 hover:text-white/80 hover:border-white/15 transition">{t}</span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {ind.outcomes.map((o) => (
              <div key={o.k} className="rounded-[14px] bg-white/[0.03] border border-white/[0.06] p-3">
                <div className="text-[10px] font-mono tracking-widest text-white/30 mb-1">{o.k.toUpperCase()}</div>
                <div className="font-sora text-[18px] font-bold tracking-tight" style={{ color: ind.accent }}>{o.v}</div>
                <div className="text-[10px] font-mono text-white/40 mt-1">{o.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* infographic side */}
        <div className={`lg:col-span-5 bg-[#05070D]/60 border-t lg:border-t-0 lg:border-l border-white/[0.06] p-5 md:p-10 flex flex-col gap-6 min-w-0 overflow-hidden ${!isEven ? "lg:order-1" : ""}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-[0.2em] text-white/30">FLOW DIAGRAM • LIVE OS</span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#84FF3D]"><span className="w-1 h-1 rounded-full bg-[#84FF3D] animate-pulse" />PRODUCTION</span>
          </div>

          <FlowComp />

          <div className="rounded-[14px] bg-white/[0.03] border border-white/[0.06] p-4">
            <div className="text-[10px] font-mono tracking-widest text-white/30 mb-2">EVIDENCE VAULT</div>
            <div className="flex gap-2">
              <div className="flex-1 h-[36px] rounded-[10px] bg-[#0EA5FF]/10 border border-[#0EA5FF]/20 grid place-items-center text-[10px] font-mono text-[#0EA5FF]">S3 R2</div>
              <div className="flex-1 h-[36px] rounded-[10px] bg-[#84FF3D]/10 border border-[#84FF3D]/20 grid place-items-center text-[10px] font-mono text-[#84FF3D]">ARCHIVE5</div>
              <div className="flex-1 h-[36px] rounded-[10px] bg-white/5 border border-white/10 grid place-items-center text-[10px] font-mono text-white/40">POSTHOG</div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/25">
            <span>12-MONTH EVIDENCE</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />WCAG 2.2 AA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

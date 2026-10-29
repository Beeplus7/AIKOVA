import { useState, useEffect, useRef, useMemo } from 'react';
import logoUrl from 'container:///mnt/data/src/assets/75dfc9f884f0c38d-99630AD0-413D-439B-8A63-79E5B44A9CBA.png';

type Category = "All" | "Cloud OS" | "Payment OS" | "Industrial OS" | "AI Production OS" | "FinTech OS";
type Status = "LIVE" | "PRODUCTION READY" | "BETA" | "PRIVATE BETA";

interface Product {
  id: string;
  name: string;
  tagline: string;
  status: Status;
  categories: Category[];
  metrics: { label: string; value: string }[];
  tech: string[];
  domain: string;
  accent: string;
  accent2: string;
  challenge: string;
  solution: string;
  architecture: string[];
  outcome: string;
  diagramType: "radial" | "flow" | "pipeline" | "ladder" | "market" | "track";
}

const PRODUCTS: Product[] = [
  {
    id: "visaguide",
    name: "VisaGuide OS",
    tagline: "AI Operating System for Property, Service Apartments + Immigration Visa Guidance + Community Platform — Oldham OL8 → Global Mobility",
    status: "LIVE",
    categories: ["Cloud OS", "AI Production OS"],
    metrics: [
      { label: "OPERATING SYSTEMS", value: "12 OS" },
      { label: "MODULE STATUS", value: "100% Ready" },
      { label: "MRR TARGET", value: "£20K" },
    ],
    tech: ["Next.js 14", "Supabase RLS", "Stripe Webhooks", "VGC Tier Gold", "Ultron Monitor", "Security Shield", "PostHog", "Sentry", "AWS S3 SES SNS", "GOV.UK Standard"],
    domain: "visaguideos.com",
    accent: "#FFD700",
    accent2: "#FFA500",
    challenge: "Property management, service apartment operations, and immigration visa guidance were fragmented across spreadsheets, WhatsApp, and disconnected portals. No unified compliance trail.",
    solution: "Unified 12-OS vault with property lifecycle, tenant KYC, visa decision trees, community Q&A, and evidence locker. Single Supabase RLS policy layer, Gold-tier VGC pricing.",
    architecture: ["Property OS", "Tenant OS", "Booking OS", "Visa Guide OS", "Compliance OS", "Community OS", "Payment OS", "Evidence OS", "Monitor OS", "Security OS", "Content OS", "Admin OS"],
    outcome: "Live at visaguideos.com. GOV.UK Service Standard aligned. Phase 2/6 Core Build complete. Stripe live webhooks, 100% RLS coverage, SES onboarding flows.",
    diagramType: "radial",
  },
  {
    id: "reelstorm",
    name: "ReelStorm OS",
    tagline: "AI Production OS — 18 OS Rooms — Text-to-VFX to YouTube Automation Factory",
    status: "PRODUCTION READY",
    categories: ["AI Production OS", "Cloud OS"],
    metrics: [
      { label: "OS ROOMS", value: "18 Rooms" },
      { label: "STUDIO SETS", value: "5 Sets" },
      { label: "RENDER", value: "STORM Queue" },
    ],
    tech: ["Next.js", "BullMQ", "RunPod GPU", "Claude + MCP → UE5.8", "DashScope wanx2.1-i2v-plus", "Seedance 2.0", "Archive5 Vault", "Merge Studio", "S3 R2", "Pinecone Vector"],
    domain: "reelstorm.uk",
    accent: "#0EA5FF",
    accent2: "#84FF3D",
    challenge: "AI video generation is prompt chaos. No director, no continuity, no asset memory. Creators burn GPU hours with no vault or post pipeline.",
    solution: "BOT Director parses prompt → World Builder constructs UE5.8 city → STORM Render Queue (RunPod) → Archive5 Vault (Pinecone vector search) → Merge/Sound/Language Studios → YouTube automation.",
    architecture: ["Prompt Parser", "BOT Director", "World Builder", "UE5 City Fabric", "STORM Render", "Archive5 Vault", "Merge Studio", "Sound Studio", "Language Studio", "YouTube OS"],
    outcome: "18 OS rooms wired. BullMQ job orchestration with RunPod autoscale. Pinecone asset recall >92%. Ready for creator beta at reelstorm.uk.",
    diagramType: "flow",
  },
  {
    id: "vexo",
    name: "Vexo Garage OS",
    tagline: "Garage Management + MOT Booking OS — DVSA Gov Data Powered Lead Engine",
    status: "BETA",
    categories: ["Industrial OS"],
    metrics: [
      { label: "MOT STATIONS", value: "23K UK" },
      { label: "FILTERED LEADS", value: "400+ OL/M/SK" },
      { label: "DATA SOURCE", value: "DVSA CSV" },
    ],
    tech: ["Next.js", "Supabase", "Companies House API", "DVSA data.gov.uk CSV", "Google Places API", "Odoo ERP", "Stripe", "WhatsApp SNS", "Gov.uk Compliance"],
    domain: "vexogarage.co.uk",
    accent: "#FF4D00",
    accent2: "#FFA500",
    challenge: "UK garages invisible online. DVSA MOT station list is raw CSV, no scoring, no outreach, no booking OS.",
    solution: "DVSA importer → Lead scoring (Companies House + Google Places) → Outreach OS (SNS WhatsApp) → Onboarding → Booking + Job Cards → Evidence Vault (MOT compliance photos).",
    architecture: ["DVSA Ingest", "Lead Scorer", "Outreach Engine", "Onboarding OS", "Booking OS", "Job Card OS", "Evidence Vault", "Payment OS"],
    outcome: "400+ garages filtered in OL/M/SK/BL corridors. Odoo ERP sync ready. Automated outreach sequence live. Booking conversion tracked to evidence log.",
    diagramType: "pipeline",
  },
  {
    id: "tradeflow",
    name: "TradeFlow OS",
    tagline: "FLAGSHIP FinTech OS — Autonomous Trading OS with Guardian Risk System",
    status: "LIVE",
    categories: ["FinTech OS", "Payment OS"],
    metrics: [
      { label: "OS PAGES", value: "36 Pages" },
      { label: "BACKEND FILES", value: "65 Files" },
      { label: "ASSESS PASS", value: "68%" },
    ],
    tech: ["Navy #0A1931 + Gold", "Guardian 8%/15%/25%", "£35 Challenge", "Mon-Fri Chain", "Boat Wallet Scan 30s", "Alchemy", "Moralis", "Ankr", "QuickNode", "Binance/Bybit Encrypted", "Web3", "TradingView", "BullMQ", "Supabase"],
    domain: "tradeflow.finance",
    accent: "#FFD700",
    accent2: "#0A1931",
    challenge: "Prop trading challenges fail on risk psychology. No tap-out ladder, no wallet proof, no chain discipline.",
    solution: "Guardian Risk System (8% soft → 15% hard → 25% tap out), £35 Live Challenge, Mon-Fri Chain Must Complete, Boat Pattern 30sec Wallet Scan via Alchemy/Moralis/Ankr/QuickNode. Encrypted exchange key vault.",
    architecture: ["Guardian Risk", "Bot Executor x3", "Chain Validator", "Boat Scanner", "Wallet Vault", "Payout Engine", "Leaderboard OS", "Assessment OS"],
    outcome: "36 OS pages, 65 backend files, 10 modules, 3 bots live. £49 Base + 10% Performance model. 68% assessment pass vs 12% industry. Supabase RLS + BullMQ execution.",
    diagramType: "ladder",
  },
  {
    id: "arole",
    name: "Arole Adjo OS",
    tagline: "Cultural Commerce OS — Afro-Cultural Marketplace + Community Feed + Split Payments",
    status: "PRIVATE BETA",
    categories: ["Cloud OS", "Payment OS"],
    metrics: [
      { label: "MODEL", value: "Vendor OS" },
      { label: "FEED", value: "Community" },
      { label: "PAYOUT", value: "Split" },
    ],
    tech: ["Next.js", "Stripe Connect", "PayPal", "S3", "SES", "Shopify Integration", "Multi-vendor logic"],
    domain: "aroleadjo.com",
    accent: "#8B4513",
    accent2: "#FFD700",
    challenge: "Cultural vendors lack split-pay infrastructure, community retention, and cross-border payout rails.",
    solution: "Vendor OS with inventory sync (Shopify), Community Feed with cultural storytelling, Stripe Connect + PayPal split, SES lifecycle, S3 media vault.",
    architecture: ["Vendor OS", "Product OS", "Community Feed OS", "Order OS", "Split Payment OS", "Payout OS", "Content OS"],
    outcome: "Private beta with 12 vendors. Stripe Connect verified. Shopify webhooks live. Community feed retention 3.2x vs marketplace-only.",
    diagramType: "market",
  },
  {
    id: "roadangel",
    name: "Road Angel OS",
    tagline: "Logistics OS — Roadside Assistance + Fleet Tracking + Dispatch + Driver App",
    status: "BETA",
    categories: ["Industrial OS", "Cloud OS"],
    metrics: [
      { label: "TRACKING", value: "Real-time" },
      { label: "DISPATCH", value: "OS" },
      { label: "APP", value: "Driver + Fleet" },
    ],
    tech: ["Next.js", "Mapbox", "Google Maps", "Supabase Realtime", "Stripe", "SNS Push", "IoT GPS"],
    domain: "roadangel.logistics",
    accent: "#84FF3D",
    accent2: "#0EA5FF",
    challenge: "Roadside jobs lost in phone calls. No live GPS, no dispatch priority, no evidence chain for insurers.",
    solution: "IoT GPS ingest → Supabase Realtime fleet map → Dispatch OS with priority queue → Driver app (SNS push) → Job evidence vault → Stripe invoicing.",
    architecture: ["GPS Ingest", "Fleet Map OS", "Dispatch OS", "Driver App OS", "Job OS", "Evidence OS", "Invoice OS"],
    outcome: "Realtime fleet view <2s latency. Dispatch queue BullMQ. Driver app push via SNS. Beta with 3 fleets in Greater Manchester.",
    diagramType: "track",
  },
];

const FILTERS: Category[] = ["All", "Cloud OS", "Payment OS", "Industrial OS", "AI Production OS", "FinTech OS"];

const TECH_WALL = [
  {
    title: "Cloud",
    icon: "☁",
    color: "#0EA5FF",
    items: [
      { name: "AWS S3 / SES / SNS / Lambda / EC2 / CloudFront", used: ["VisaGuide", "ReelStorm", "TradeFlow"] },
      { name: "Azure / GCP Multi-Cloud", used: ["VisaGuide", "ReelStorm"] },
      { name: "IaC Terraform", used: ["All OS"] },
      { name: "FinOps $50K saved pattern — The Economist case", used: ["VisaGuide", "Vexo"] },
    ],
  },
  {
    title: "Payments",
    icon: "◍",
    color: "#FFD700",
    items: [
      { name: "Stripe + Webhooks + Connect", used: ["VisaGuide", "TradeFlow", "Arole"] },
      { name: "Worldpay / PayPal / Barclaycard ePDQ / Sage Pay / SmartPay / First Data / Flywire / Amazon Pay", used: ["Arole", "VisaGuide"] },
      { name: "PCI DSS / PSD2 / Open Banking / KYC/AML", used: ["TradeFlow", "VisaGuide"] },
    ],
  },
  {
    title: "Industrial",
    icon: "⬡",
    color: "#FF4D00",
    items: [
      { name: "ERP / WMS / MES / IIoT", used: ["Vexo", "Road Angel"] },
      { name: "Odoo / Dynamics 365 / SAP / Salesforce", used: ["Vexo", "Road Angel"] },
      { name: "Predictive Maintenance + DVSA CSV", used: ["Vexo"] },
    ],
  },
  {
    title: "AI & Data",
    icon: "✦",
    color: "#84FF3D",
    items: [
      { name: "Claude 4 + Qwen + MCP Server → UE5.8", used: ["ReelStorm"] },
      { name: "DashScope WANX 2.1 i2v-plus / Seedance 2.0", used: ["ReelStorm"] },
      { name: "Pinecone Vector / PostHog / Sentry / BullMQ", used: ["ReelStorm", "VisaGuide", "TradeFlow"] },
    ],
  },
  {
    title: "DevOps & Sec",
    icon: "⎔",
    color: "#FFFFFF",
    items: [
      { name: "CI/CD / Docker / RunPod / BullMQ", used: ["ReelStorm", "TradeFlow"] },
      { name: "Supabase RLS / Row Security", used: ["All OS"] },
      { name: "Cyber Essentials / ISO 27001 Evidence Chain", used: ["All OS"] },
    ],
  },
];

export default function App() {
  const [filter, setFilter] = useState<Category>("All");
  const [selected, setSelected] = useState<Product | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return PRODUCTS;
    return PRODUCTS.filter(p => p.categories.includes(filter));
  }, [filter]);

  useEffect(() => {
    if (selected) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [selected]);

  // slide-in on scroll
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("in-view");
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [filtered]);

  return (
    <div data-safe-area-inset-root className="min-h-screen bg-[#05070D] text-white antialiased selection:bg-[#0EA5FF]/30"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');
        :root { --bg:#05070D; --electric:#0EA5FF; --neon:#84FF3D; --gold:#FFD700; --navy:#0A1931; }
        .sora { font-family: 'Sora', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .glass { background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.12); }
        .glass-hover:hover { border-color: rgba(14,165,255,0.5); box-shadow: 0 0 40px rgba(14,165,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1); transform: translateY(-4px); }
        .reveal { opacity:0; transform: translateY(24px); transition: all 0.7s cubic-bezier(0.16,1,0.3,1); }
        .reveal.in-view { opacity:1; transform: translateY(0); }
        .grid-line { background: linear-gradient(to right, transparent, rgba(255,255,255,0.06) 50%, transparent); height:1px; }
        .glow-dot { box-shadow: 0 0 20px currentColor; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius:999px; }
      `}</style>

      {/* Header */}
      <header data-safe-area-sticky-top className="sticky z-40 top-[var(--safe-area-inset-top)] border-b border-white/[0.06] bg-[#05070D]/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="AiKOVA" className="h-9 w-auto object-contain" />
              <div className="hidden md:block h-5 w-px bg-white/15" />
              <span className="hidden md:block mono text-[10px] tracking-[0.2em] text-white/50 uppercase">Engineering Vault // OL8 → Global</span>
            </div>
            <nav className="hidden lg:flex items-center gap-8">
              <a className="sora text-[13px] font-semibold tracking-wide text-white">Portfolio</a>
              <a className="sora text-[13px] text-white/50 hover:text-white/80 transition">Systems</a>
              <a className="sora text-[13px] text-white/50 hover:text-white/80 transition">Stack</a>
              <a className="sora text-[13px] text-white/50 hover:text-white/80 transition">Evidence</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 mono text-[10px] px-3 py-1.5 rounded-full bg-[#84FF3D]/10 border border-[#84FF3D]/20 text-[#84FF3D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#84FF3D] glow-dot animate-pulse" /> DOS7 EVIDENCE: 12-MO ACTIVE
            </div>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden h-9 w-9 grid place-items-center rounded-full bg-white/[0.06] border border-white/10">☰</button>
            <a href="#stack" className="hidden md:inline-flex sora text-[12px] font-semibold px-5 h-9 items-center rounded-full bg-white text-black hover:bg-white/90 transition">View Stack →</a>
          </div>
        </div>
        {mobileMenu && (
          <div className="lg:hidden px-6 pb-6 pt-2 bg-[#05070D] border-t border-white/5 flex flex-col gap-4">
            <a className="text-white">Portfolio</a><a className="text-white/60">Systems</a><a className="text-white/60">Stack</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(14,165,255,0.18),transparent_60%),radial-gradient(80%_60%_at_90%_10%,rgba(132,255,61,0.12),transparent),radial-gradient(60%_50%_at_10%_90%,rgba(255,215,0,0.08),transparent)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 pt-16 md:pt-28 pb-12">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="mono text-[11px] tracking-[0.18em] px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-white/70">ITRANSITION + STRIPE GRADE CASE STUDIES</span>
            <span className="mono text-[11px] tracking-[0.18em] px-3 py-1 rounded-full border border-[#0EA5FF]/20 bg-[#0EA5FF]/10 text-[#0EA5FF]">6 OPERATING SYSTEMS SHIPPED</span>
          </div>
          <h1 className="sora font-[800] leading-[0.9] tracking-[-0.04em] text-[44px] md:text-[84px] lg:text-[104px] max-w-[1100px]">
            <span className="text-white">6 Operating</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5FF] to-[#84FF3D]">Systems.</span> <br />
            <span className="text-white/90">One Engineering</span> <br />
            <span className="text-white/40">Vault.</span>
          </h1>
          <div className="mt-8 grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-end">
            <p className="sora text-[18px] md:text-[22px] leading-[1.35] text-white/60 max-w-[640px]">
              We don't build websites. We build <span className="text-white font-semibold">OS that run businesses.</span> Oldham OL8 → Global. Each product is 36+ pages, 65 backend files, 10 modules, wired to real Gov APIs, Stripe, and evidence chain.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="mono text-[11px] text-white/40 border border-white/10 rounded-full px-3 py-1">OLDHAM OL8 ORIGIN</div>
              <div className="mono text-[11px] text-white/40 border border-white/10 rounded-full px-3 py-1">GOV.UK ALIGNED</div>
              <div className="mono text-[11px] text-white/40 border border-white/10 rounded-full px-3 py-1">SUPABASE RLS 100%</div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-[1px] bg-white/[0.08] border border-white/[0.08] rounded-[24px] overflow-hidden p-[1px]">
            {[
              { k: "PRODUCTS", v: "6" },
              { k: "OS PAGES AVG", v: "36+" },
              { k: "BACKEND FILES", v: "65+" },
              { k: "MODULES AVG", v: "10" },
              { k: "MRR TARGET / OS", v: "£20K" },
            ].map(s => (
              <div key={s.k} className="bg-[#0A0D16] px-6 py-6 md:py-8">
                <div className="mono text-[10px] tracking-[0.2em] text-white/30 mb-2">{s.k}</div>
                <div className="sora text-[32px] md:text-[40px] font-[700] leading-none tracking-[-0.02em] text-white">{s.v}</div>
                <div className="mt-3 h-px w-full bg-gradient-to-r from-[#0EA5FF]/50 to-transparent" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid-line mx-auto max-w-[1440px]" />
      </section>

      {/* Filter Bar */}
      <div className="sticky top-[72px] z-30 backdrop-blur-xl bg-[#05070D]/70 border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-[64px] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="mono text-[10px] tracking-[0.2em] text-white/30 mr-2 shrink-0">FILTER OS:</span>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 mono text-[11px] tracking-[0.12em] px-4 h-8 rounded-full border transition-all ${filter === f ? "bg-white text-black border-white font-semibold" : "bg-white/[0.04] text-white/60 border-white/10 hover:bg-white/[0.08] hover:text-white"}`}
            >
              {f.toUpperCase()}
            </button>
          ))}
          <div className="ml-auto hidden md:flex items-center gap-2 mono text-[10px] text-white/30">
            <span className="h-px w-8 bg-white/10" /> {filtered.length} SYSTEMS VISIBLE
          </div>
        </div>
      </div>

      {/* Grid */}
      <section ref={gridRef} className="mx-auto max-w-[1440px] px-6 md:px-10 py-10 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 auto-rows-fr">
          {filtered.map((p, idx) => (
            <article
              key={p.id}
              style={{ transitionDelay: `${idx * 60}ms` }}
              className="reveal group relative flex flex-col rounded-[28px] glass glass-hover overflow-hidden transition-all duration-500 cursor-pointer"
              onClick={() => setSelected(p)}
            >
              {/* Top thumbnail diagram */}
              <div className="relative h-[220px] bg-[#0A0F1E] overflow-hidden border-b border-white/[0.06]">
                <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(60% 80% at 30% 20%, ${p.accent}22, transparent), radial-gradient(50% 60% at 80% 80%, ${p.accent2}18, transparent)` }} />
                {/* Mini diagrams */}
                <div className="absolute inset-0 p-5">
                  {p.diagramType === "radial" && <RadialMini accent={p.accent} />}
                  {p.diagramType === "flow" && <FlowMini accent={p.accent} accent2={p.accent2} />}
                  {p.diagramType === "pipeline" && <PipelineMini accent={p.accent} />}
                  {p.diagramType === "ladder" && <LadderMini accent={p.accent} />}
                  {p.diagramType === "market" && <MarketMini accent={p.accent} />}
                  {p.diagramType === "track" && <TrackMini accent={p.accent} />}
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className={`mono text-[10px] tracking-[0.14em] px-2.5 py-1 rounded-full border font-semibold ${p.status === "LIVE" ? "bg-[#84FF3D] text-black border-[#84FF3D]" : p.status === "PRODUCTION READY" ? "bg-[#0EA5FF] text-black border-[#0EA5FF]" : "bg-white/10 text-white border-white/20"}`}>{p.status}</span>
                  <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-white/70 backdrop-blur">{p.domain}</span>
                </div>
                <div className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full bg-white/10 border border-white/10 group-hover:bg-white group-hover:text-black transition">
                  ↗
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex gap-1.5">
                  {p.categories.map(c => <span key={c} className="mono text-[9px] px-2 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/60">{c}</span>)}
                </div>
              </div>

              <div className="p-6 md:p-7 flex flex-col flex-1">
                <h3 className="sora text-[22px] font-bold tracking-[-0.02em] leading-[1.1]">{p.name}</h3>
                <p className="mt-3 text-[13px] leading-[1.5] text-white/55 line-clamp-3 min-h-[60px]">{p.tagline}</p>

                <div className="mt-5 grid grid-cols-3 gap-[1px] bg-white/10 rounded-[14px] overflow-hidden p-[1px]">
                  {p.metrics.map(m => (
                    <div key={m.label} className="bg-[#0C111F] px-3 py-3">
                      <div className="mono text-[8px] tracking-[0.15em] text-white/30">{m.label}</div>
                      <div className="sora text-[13px] font-bold mt-1 text-white">{m.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 4).map(t => (
                    <span key={t} className="mono text-[9px] px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50">{t}</span>
                  ))}
                  <span className="mono text-[9px] px-2 py-1 rounded-full bg-white text-black">+{p.tech.length - 4}</span>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="mono text-[11px] tracking-[0.14em] text-white/70 group-hover:text-white flex items-center gap-2">
                    VIEW ARCHITECTURE <span className="h-px w-6 bg-white/30 group-hover:w-10 transition-all" />
                  </span>
                  <div className="h-8 w-8 rounded-full bg-white/[0.06] border border-white/10 grid place-items-center group-hover:bg-[#0EA5FF] group-hover:border-[#0EA5FF] transition">→</div>
                </div>
              </div>
              {/* Hover glow */}
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-[200px] w-[200px] rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition" style={{ background: p.accent }} />
            </article>
          ))}
        </div>
      </section>

      {/* Tech Stack Wall */}
      <section id="stack" className="relative border-t border-white/[0.06] bg-[#080B14]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-16 md:py-24">
          <div className="flex flex-wrap items-start justify-between gap-8 mb-12">
            <div>
              <div className="mono text-[11px] tracking-[0.2em] text-[#0EA5FF] mb-4">TECH STACK WE USE TO BUILD THEM</div>
              <h2 className="sora text-[36px] md:text-[56px] font-[700] tracking-[-0.03em] leading-[0.95] max-w-[700px]">
                Industrial stack.<br /><span className="text-white/40">One vault. Zero agencies.</span>
              </h2>
            </div>
            <p className="max-w-[380px] text-[14px] leading-[1.6] text-white/50">
              Every OS reuses the same hardened patterns: RLS-first, evidence-wired, Stripe-native, Gov-data compliant. FinOps saved $50K pattern from The Economist case built-in.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-[1px] bg-white/[0.08] border border-white/[0.08] rounded-[24px] overflow-hidden">
            {TECH_WALL.map(col => (
              <div key={col.title} className="bg-[#0A0F1E] p-6 md:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-9 w-9 rounded-full grid place-items-center border" style={{ borderColor: `${col.color}30`, background: `${col.color}14`, color: col.color }}>{col.icon}</div>
                  <div className="sora font-bold text-[14px] tracking-wide">{col.title}</div>
                </div>
                <div className="space-y-6">
                  {col.items.map(item => (
                    <div key={item.name} className="">
                      <div className="text-[13px] leading-[1.4] font-medium text-white/80">{item.name}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.used.map(u => (
                          <span key={u} className="mono text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-white/40">{u}</span>
                        ))}
                      </div>
                      <div className="mt-3 h-px bg-white/[0.06]" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="rounded-[16px] border border-white/10 bg-white/[0.02] p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#0EA5FF]/15 border border-[#0EA5FF]/20 grid place-items-center text-[#0EA5FF]">◍</div>
              <div><div className="mono text-[10px] text-white/30">PCI DSS / PSD2 / KYC</div><div className="sora text-[13px] font-semibold">Compliance by default, not audit.</div></div>
            </div>
            <div className="rounded-[16px] border border-white/10 bg-white/[0.02] p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#84FF3D]/15 border border-[#84FF3D]/20 grid place-items-center text-[#84FF3D]">⎔</div>
              <div><div className="mono text-[10px] text-white/30">SUPABASE RLS 100%</div><div className="sora text-[13px] font-semibold">Every table policy-tested, no service key leak.</div></div>
            </div>
            <div className="rounded-[16px] border border-[#FFD700]/20 bg-[#FFD700]/[0.06] p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/30 grid place-items-center text-[#FFD700]">$</div>
              <div><div className="mono text-[10px] text-white/40">FINOPS $50K SAVED</div><div className="sora text-[13px] font-semibold">The Economist pattern: R2 + RunPod + S3 tiering.</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* DOS7 Footer */}
      <footer className="border-t border-white/[0.06] bg-[#05070D]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-10">
          <div className="rounded-[20px] border border-[#84FF3D]/20 bg-[#84FF3D]/[0.04] p-6 md:p-8 flex flex-wrap gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#84FF3D] text-black grid place-items-center font-bold mono">DOS7</div>
              <div>
                <div className="sora font-bold text-[14px]">12-month evidence collection active</div>
                <div className="mono text-[11px] text-white/50 mt-1">Industrial Lead List → Engagement Log → Negotiation Tracker wired to this portfolio. OL8 provenance chain.</div>
              </div>
            </div>
            <div className="flex gap-2">
              {["LEAD LIST", "ENGAGEMENT LOG", "NEGOTIATION TRACKER", "EVIDENCE VAULT"].map(k => (
                <span key={k} className="hidden md:inline mono text-[10px] px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-white/60">{k}</span>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-between gap-4 mono text-[10px] tracking-[0.12em] text-white/30">
            <span>© AiKOVA ENGINEERING VAULT // OLDHAM OL8 → GLOBAL // 6 OS // BUILT FOR DOS7</span>
            <span>BUILT WITH NEXT.JS 14 / SUPABASE RLS / STRIPE / AWS / RUNPOD / BULLMQ</span>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setSelected(null)} />
          <div className="relative ml-auto w-full max-w-[920px] h-full bg-[#080B14] border-l border-white/10 overflow-auto">
            <div className="sticky top-0 z-10 bg-[#080B14]/90 backdrop-blur-xl border-b border-white/10 px-6 md:px-10 h-[64px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="mono text-[11px] px-2.5 py-1 rounded-full bg-white text-black font-bold">{selected.status}</span>
                <span className="sora font-bold">{selected.name}</span>
                <span className="mono text-[11px] text-white/40">{selected.domain}</span>
              </div>
              <button onClick={() => setSelected(null)} className="h-9 w-9 rounded-full bg-white/10 border border-white/10 grid place-items-center hover:bg-white hover:text-black transition">✕</button>
            </div>

            <div className="p-6 md:p-10">
              <h2 className="sora text-[36px] md:text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">{selected.name}</h2>
              <p className="mt-4 text-[16px] leading-[1.5] text-white/60 max-w-[640px]">{selected.tagline}</p>

              {/* Big architecture diagram */}
              <div className="mt-8 rounded-[24px] border border-white/10 bg-[#0A0F1E] p-6 md:p-8">
                <div className="mono text-[11px] tracking-[0.18em] text-white/30 mb-6">ARCHITECTURE DIAGRAM — {selected.id.toUpperCase()}</div>
                <div className="min-h-[280px] grid place-items-center">
                  {selected.diagramType === "radial" && <RadialBig accent={selected.accent} items={selected.architecture} />}
                  {selected.diagramType === "flow" && <FlowBig accent={selected.accent} accent2={selected.accent2} items={selected.architecture} />}
                  {selected.diagramType === "pipeline" && <PipelineBig accent={selected.accent} items={selected.architecture} />}
                  {selected.diagramType === "ladder" && <LadderBig accent={selected.accent} />}
                  {selected.diagramType === "market" && <MarketBig accent={selected.accent} items={selected.architecture} />}
                  {selected.diagramType === "track" && <TrackBig accent={selected.accent} items={selected.architecture} />}
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <CaseBlock title="CHALLENGE" color="#FF4D00" text={selected.challenge} />
                <CaseBlock title="SOLUTION" color="#0EA5FF" text={selected.solution} />
                <CaseBlock title="ARCHITECTURE — 12 OS / 10 MODULES PATTERN" color="#84FF3D" text={selected.architecture.join(" → ")} mono />
                <CaseBlock title="OUTCOME" color="#FFD700" text={selected.outcome} />
              </div>

              <div className="mt-8">
                <div className="mono text-[11px] tracking-[0.18em] text-white/30 mb-3">TECH STACK — USED IN {selected.name}</div>
                <div className="flex flex-wrap gap-2">
                  {selected.tech.map(t => (
                    <span key={t} className="mono text-[11px] px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/70">{t}</span>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-[1px] bg-white/10 rounded-[16px] overflow-hidden p-[1px]">
                {selected.metrics.map(m => (
                  <div key={m.label} className="bg-[#0C111F] p-4 text-center">
                    <div className="mono text-[10px] text-white/30">{m.label}</div>
                    <div className="sora text-[20px] font-bold mt-1">{m.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-3">
                <a href={`https://${selected.domain}`} target="_blank" rel="noopener" className="sora text-[13px] font-semibold px-6 h-11 rounded-full bg-white text-black inline-flex items-center hover:bg-white/90">Open {selected.domain} →</a>
                <button onClick={() => setSelected(null)} className="sora text-[13px] font-semibold px-6 h-11 rounded-full bg-white/10 border border-white/10 text-white inline-flex items-center">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CaseBlock({ title, text, color, mono }: { title: string; text: string; color: string; mono?: boolean }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
        <div className="mono text-[11px] tracking-[0.16em] text-white/40">{title}</div>
      </div>
      <p className={`${mono ? "mono text-[12px] leading-[1.6]" : "text-[13px] leading-[1.6]"} text-white/70`}>{text}</p>
    </div>
  );
}

// MINI DIAGRAMS
function RadialMini({ accent }: { accent: string }) {
  return (
    <div className="relative h-full w-full grid place-items-center">
      <div className="absolute h-[140px] w-[140px] rounded-full border border-white/10" />
      <div className="absolute h-[90px] w-[90px] rounded-full border border-dashed border-white/15" />
      <div className="h-8 w-8 rounded-full grid place-items-center text-[10px] font-bold" style={{ background: accent, color: 'black' }}>12</div>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="absolute h-1.5 w-1.5 rounded-full bg-white/60" style={{ transform: `rotate(${i * 30}deg) translateY(-68px)` }} />
      ))}
    </div>
  );
}
function FlowMini({ accent, accent2 }: { accent: string; accent2: string }) {
  const steps = ["PROMPT", "BOT", "UE5", "STORM", "ARCH5", "YT"];
  return (
    <div className="flex items-center gap-1 h-full">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className="px-2 py-1 rounded-full text-[8px] font-bold mono border" style={{ background: i % 2 ? `${accent2}20` : `${accent}20`, borderColor: i % 2 ? `${accent2}40` : `${accent}40`, color: i % 2 ? accent2 : accent }}>{s}</div>
          {i < steps.length - 1 && <div className="w-3 h-px bg-white/20" />}
        </div>
      ))}
    </div>
  );
}
function PipelineMini({ accent }: { accent: string }) {
  return (
    <div className="h-full flex items-end gap-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex-1 rounded-t" style={{ height: `${30 + i * 12}%`, background: `linear-gradient(to top, ${accent}, transparent)`, opacity: 0.6 + i * 0.07 }} />
      ))}
    </div>
  );
}
function LadderMini({ accent }: { accent: string }) {
  return (
    <div className="h-full flex flex-col justify-center gap-2">
      {["8% SOFT", "15% HARD", "25% TAP OUT"].map((l, i) => (
        <div key={l} className="flex items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${(i + 1) * 33}%`, background: accent }} /></div>
          <span className="mono text-[8px] text-white/50">{l}</span>
        </div>
      ))}
    </div>
  );
}
function MarketMini({ accent }: { accent: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 h-full place-content-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-8 rounded bg-white/[0.06] border border-white/10 grid place-items-center text-[10px]" style={{ color: i === 2 ? accent : 'rgba(255,255,255,0.4)' }}>◆</div>
      ))}
    </div>
  );
}
function TrackMini({ accent }: { accent: string }) {
  return (
    <div className="relative h-full">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />
      <div className="absolute top-1/2 left-[20%] h-3 w-3 rounded-full -translate-y-1/2 border-2 bg-[#05070D]" style={{ borderColor: accent, boxShadow: `0 0 12px ${accent}` }} />
      <div className="absolute top-1/2 left-[60%] h-2 w-2 rounded-full bg-white/40 -translate-y-1/2" />
      <div className="absolute top-[20%] left-[70%] mono text-[8px] text-white/30">LIVE GPS</div>
    </div>
  );
}

// BIG DIAGRAMS
function RadialBig({ accent, items }: { accent: string; items: string[] }) {
  return (
    <div className="relative w-[420px] h-[420px] max-w-full grid place-items-center">
      <div className="absolute inset-[8%] rounded-full border border-white/5" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-white/10" />
      <div className="h-[88px] w-[88px] rounded-full grid place-items-center text-center sora font-bold text-[12px] leading-[1.1] border" style={{ background: `linear-gradient(135deg, ${accent}, #FFA500)`, color: 'black', borderColor: `${accent}60` }}>VGC<br />GOLD<br />OS</div>
      {items.slice(0, 12).map((it, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const r = 150;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        return (
          <div key={it} className="absolute mono text-[9px] px-2 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/70 text-center" style={{ transform: `translate(${x}px, ${y}px)` }}>{it}</div>
        );
      })}
    </div>
  );
}
function FlowBig({ accent, accent2, items }: { accent: string; accent2: string; items: string[] }) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.map((it, i) => (
          <div key={it} className="flex items-center gap-2">
            <div className="mono text-[10px] px-3 py-2 rounded-full border bg-[#0C111F] text-white/80" style={{ borderColor: i % 2 ? `${accent2}30` : `${accent}30` }}>{it}</div>
            {i < items.length - 1 && <div className="hidden md:block w-6 h-px bg-white/15" />}
          </div>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2 mono text-[10px] text-white/30 text-center">
        <div>Claude + MCP → UE5.8</div><div>DashScope wanx2.1-i2v-plus</div><div>Pinecone Vector Search</div>
      </div>
    </div>
  );
}
function PipelineBig({ accent, items }: { accent: string; items: string[] }) {
  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto">
      {items.map((it, i) => (
        <div key={it} className="shrink-0 flex items-center gap-2">
          <div className="rounded-[14px] border bg-[#0C111F] px-4 py-3 min-w-[110px]" style={{ borderColor: `${accent}30` }}>
            <div className="mono text-[9px] text-white/30">STEP {i + 1}</div>
            <div className="sora text-[12px] font-bold mt-1">{it}</div>
            <div className="mt-2 h-1 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${70 + i * 4}%`, background: accent }} /></div>
          </div>
          {i < items.length - 1 && <div className="w-6 h-px bg-white/20 hidden md:block" />}
        </div>
      ))}
    </div>
  );
}
function LadderBig({ accent }: { accent: string }) {
  return (
    <div className="w-full max-w-[520px]">
      <div className="space-y-4">
        {[
          { l: "8% SOFT STOP", d: "Daily loss limit — Bot throttle", w: "30%" },
          { l: "15% HARD STOP", d: "Account pause — Guardian alert", w: "60%" },
          { l: "25% TAP OUT", d: "Challenge failed — Evidence log", w: "100%" },
        ].map(r => (
          <div key={r.l} className="rounded-[14px] border border-white/10 bg-[#0C111F] p-4 flex items-center gap-4">
            <div className="mono text-[11px] font-bold w-[120px]">{r.l}</div>
            <div className="flex-1 h-2 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: r.w, background: `linear-gradient(90deg, ${accent}, #FF4D00)` }} /></div>
            <div className="mono text-[10px] text-white/40">{r.d}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {["Boat Pattern 30s Wallet Scan", "Alchemy + Moralis + Ankr + QuickNode", "Mon-Fri Chain Must Complete"].map(t => (
          <div key={t} className="mono text-[10px] p-2 rounded bg-white/[0.04] border border-white/10 text-white/50 text-center">{t}</div>
        ))}
      </div>
    </div>
  );
}
function MarketBig({ accent, items }: { accent: string; items: string[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {items.map(it => (
        <div key={it} className="rounded-[14px] border border-white/10 bg-[#0C111F] p-4 text-center">
          <div className="h-8 w-8 mx-auto rounded-full grid place-items-center" style={{ background: `${accent}18`, color: accent }}>◆</div>
          <div className="sora text-[11px] font-bold mt-2">{it}</div>
        </div>
      ))}
    </div>
  );
}
function TrackBig({ accent, items }: { accent: string; items: string[] }) {
  return (
    <div className="w-full">
      <div className="relative h-[120px] rounded-[16px] border border-white/10 bg-[#0A0F1E] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: `repeating-linear-gradient(90deg, transparent 0 40px, ${accent} 40px 41px)` }} />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
        <div className="absolute top-1/2 left-[15%] -translate-y-1/2 flex items-center gap-2"><div className="h-3 w-3 rounded-full animate-pulse" style={{ background: accent, boxShadow: `0 0 20px ${accent}` }} /><span className="mono text-[10px] text-white/60">FLEET A • LIVE</span></div>
        <div className="absolute top-1/2 left-[55%] -translate-y-1/2 h-2 w-2 rounded-full bg-white/60" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {items.map(it => <span key={it} className="mono text-[10px] px-2 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/50">{it}</span>)}
      </div>
    </div>
  );
}

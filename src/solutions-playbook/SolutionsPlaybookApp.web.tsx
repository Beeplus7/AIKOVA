// @ts-nocheck — Tailwind DOM artefact; web-only.
/**
 * AiKOVA Solutions + Industry Playbook.
 * Source: design/solutions-playbook (Aikova+Solutions+Industry+Playbook.tar.gz)
 * Wired as /solutions via app/solutions.web.tsx
 */
import { useEffect, useRef, useState } from "react";
/** Served from Expo public/ on web. */
const logoAsset = '/aikova-portfolio-logo.png';

// TYPES
type Assessment = {
  company: string;
  problemType: string;
  description: string;
  urgency: string;
  contact: string;
};

type AssessmentRecord = {
  id: string;
  value: Assessment;
  created_at: string;
};

// INDUSTRIES DATA
const industries = [
  {
    id: "A",
    tag: "Property & Immigration",
    name: "VisaGuide OS",
    domain: "visaguideos.com",
    status: "LIVE • Phase 2/6",
    problem: "Property + Service Apartments + Visa guidance fragmented, community trust low.",
    solution: "Unified 12 OS with VGC Tier System, Community + Booking + Visa guidance.",
    tech: ["Next.js 14", "Supabase RLS", "Stripe", "S3 SES SNS", "Ultron Monitor", "Security Shield"],
    outcome: "Live domain, £20K MRR target, GOV.UK aligned.",
    gradient: "from-[#FFD700] to-[#FFA500]",
    accent: "#FFD700",
    glow: "rgba(255,215,0,0.15)",
    border: "border-[#FFD700]/20",
  },
  {
    id: "B",
    tag: "Garage & Automotive",
    name: "Vexo Garage OS",
    domain: "vexogarage.co.uk",
    status: "23K IMPORT • OUTREACH READY",
    problem: "23K MOT stations have no OS, phone bookings, no CRM.",
    solution: "DVSA gov data importer + Companies House enrichment + Odoo ERP + Booking OS + WhatsApp SNS.",
    tech: ["DVSA CSV data.gov.uk", "Google Places", "Supabase", "Stripe", "Odoo"],
    outcome: "400+ filtered OL/M/SK/BL, lead scoring, outreach evidence for DOS7.",
    gradient: "from-[#0EA5FF] to-[#38BDF8]",
    accent: "#0EA5FF",
    glow: "rgba(14,165,255,0.15)",
    border: "border-[#0EA5FF]/20",
  },
  {
    id: "C",
    tag: "FinTech & Trading",
    name: "TradeFlow OS",
    domain: "FLAGSHIP • 36 PAGES",
    status: "FLAGSHIP • AUTONOMOUS",
    problem: "Retail traders blow accounts, no risk guardrails.",
    solution: "Guardian System 8%/15%/25% Tap Out, Mon-Fri Chain Must Complete, Boat 30sec wallet scan, 68% assessment.",
    tech: ["Navy #0A1931 Gold #FFD700", "36 OS Pages", "65 Backend Files", "10 Modules", "Alchemy Moralis", "Binance/Bybit Vault"],
    outcome: "£49 base +10% performance, £35 live, autonomous.",
    gradient: "from-[#FFD700] to-[#FFB800]",
    accent: "#FFD700",
    glow: "rgba(255,215,0,0.22)",
    border: "border-[#FFD700]/30",
  },
  {
    id: "D",
    tag: "Media & Production",
    name: "ReelStorm OS",
    domain: "reelstorm.uk",
    status: "GPU ACCELERATED",
    problem: "Content factories slow, manual editing, no AI.",
    solution: "18 OS Rooms - BOT Director, World Builder, Studio Set, STORM BullMQ, RunPod GPU, Archive5 Vault.",
    tech: ["Claude MCP → UE 5.8", "DashScope wanx2.1", "Seedance 2.0", "S3 R2", "Pinecone"],
    outcome: "Text-to-VFX to YouTube Automation in minutes.",
    gradient: "from-[#84FF3D] to-[#22D3EE]",
    accent: "#84FF3D",
    glow: "rgba(132,255,61,0.15)",
    border: "border-[#84FF3D]/20",
  },
  {
    id: "E",
    tag: "Logistics & Roadside",
    name: "Road Angel OS",
    domain: "roadangel.os / Fleet",
    status: "REALTIME • IOT",
    problem: "Fleet tracking, roadside dispatch fragmented.",
    solution: "Real-time Tracking OS + Driver App + Dispatch.",
    tech: ["Mapbox", "Google Maps", "Supabase Realtime", "SNS Push", "IoT GPS", "Stripe"],
    outcome: "ETA -37%, Dispatch <2min, Fleet Uptime 99.4%",
    gradient: "from-[#0EA5FF] to-[#84FF3D]",
    accent: "#0EA5FF",
    glow: "rgba(14,165,255,0.12)",
    border: "border-white/10",
  },
  {
    id: "F",
    tag: "Cultural Commerce",
    name: "Arole Adjo OS",
    domain: "Cultural Marketplace",
    status: "MULTI-VENDOR",
    problem: "Afro-cultural vendors need split payments + community.",
    solution: "Multi-vendor Marketplace + Community Feed + Payment Split.",
    tech: ["Stripe Connect", "PayPal", "S3", "Shopify integration"],
    outcome: "Split payouts automated, 0% churn sellers",
    gradient: "from-[#FF6B6B] to-[#FFD700]",
    accent: "#FFD700",
    glow: "rgba(255,215,0,0.12)",
    border: "border-white/10",
  },
];

const problemGrid = [
  { icon: "◍", title: "System Crash / Payment Gateway Down", fix: "Emergency 30min Triage, 2hr Mitigation", link: "Services → Incident Response" },
  { icon: "⇅", title: "Legacy to Cloud Migration", fix: "Zero-downtime blue-green, S3/SES/SNS", link: "Blueprint 1 • Cloud OS" },
  { icon: "⛨", title: "PCI DSS Compliance", fix: "8 gateways vault, PSD2, KYC/AML", link: "Blueprint 2 • Payment OS" },
  { icon: "⚙", title: "Garage Onboarding", fix: "DVSA 23K importer + enrichment", link: "Vexo OS • Live Data" },
  { icon: "◐", title: "AI Production Bottleneck", fix: "UE5.8 + Claude MCP + STORM", link: "ReelStorm OS • 18 Rooms" },
  { icon: "⟁", title: "Trading Risk Blowup", fix: "Guardian 8/15/25% Tap Out", link: "TradeFlow OS • FLAGSHIP" },
];

export default function SolutionsPlaybookApp() {
  const [activeIndustry, setActiveIndustry] = useState("C");
  const [form, setForm] = useState<Assessment>({ company: "", problemType: "System Crash / Payment Gateway Down", description: "", urgency: "P1 - Critical", contact: "" });
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const [resultMsg, setResultMsg] = useState<{type:"success"|"error", text:string}|null>(null);
  const [avaOpen, setAvaOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // IntersectionObserver slide-in
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    const els = document.querySelectorAll("[data-animate]");
    els.forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

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

  // Load records
  const reloadRecords = async () => {
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "records.list", args: { collection: "problem_assessments", limit: 50 } }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "load failed");
      setAssessments(json.data.records as AssessmentRecord[]);
    } catch (e) {
      console.warn("records.list unavailable", e);
    }
  };

  useEffect(() => { reloadRecords(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.description || !form.contact) {
      setResultMsg({ type: "error", text: "Complete company, problem, and contact to run AVA assessment." });
      return;
    }
    setBusy(true);
    setResultMsg(null);
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "records.create",
          args: { collection: "problem_assessments", value: form, idempotency_key: `${form.company}-${form.contact}-${Date.now()}`.slice(0, 64) },
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "create failed");
      await reloadRecords();
      setResultMsg({ type: "success", text: `AVA Assessment queued • ID ${json.data.id.slice(0,8).toUpperCase()} • 60s triage started` });
      setForm({ company: "", problemType: form.problemType, description: "", urgency: "P1 - Critical", contact: "" });
    } catch (err) {
      setResultMsg({ type: "error", text: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        :root{
          --bg:#05070D;
          --bg-soft:#0A0F1E;
          --bg-card:#0E1424;
          --border:rgba(255,255,255,0.08);
          --border-strong:rgba(255,255,255,0.14);
          --blue:#0EA5FF;
          --green:#84FF3D;
          --gold:#FFD700;
          --text:#F8FAFC;
          --text-dim:#94A3B8;
          --text-faint:#475569;
        }
        *{font-family: 'Inter', system-ui, sans-serif;}
        h1,h2,h3,.sora{font-family:'Sora', sans-serif;}
        .mono{font-family:'JetBrains Mono', monospace;}
        [data-animate]{opacity:0; transform:translateY(28px); transition:all .75s cubic-bezier(.16,1,.3,1);}
        [data-animate].in-view{opacity:1; transform:translateY(0);}
        .glass{
          background:linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border:1px solid var(--border);
        }
        .glass-strong{
          background:linear-gradient(180deg, rgba(14,20,36,0.9) 0%, rgba(10,15,30,0.95) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .glow-blue{box-shadow:0 0 0 1px rgba(14,165,255,0.2), 0 0 40px rgba(14,165,255,0.15);}
        .glow-gold{box-shadow:0 0 0 1px rgba(255,215,0,0.25), 0 0 50px rgba(255,215,0,0.18);}
        .glow-green{box-shadow:0 0 0 1px rgba(132,255,61,0.2), 0 0 40px rgba(132,255,61,0.12);}
        ::selection{background:#0EA5FF; color:white;}
      `}</style>

      <div data-safe-area-inset-root className="min-h-screen bg-[#05070D] text-[#F8FAFC] overflow-x-clip antialiased selection:bg-[#0EA5FF]"
           style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}>
        
        {/* HEADER */}
        {/* Site nav: ArtefactFrame */}


        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,255,0.18),transparent_65%)] blur-[0px]" />
            <div className="absolute top-[200px] -right-[200px] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.10),transparent_65%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.35]" />
          </div>

          <div className="relative mx-auto max-w-[1320px] px-6 md:px-8 pt-[64px] md:pt-[92px] pb-[48px] md:pb-[72px]">
            {/* Eyebrow */}
            <div data-animate className="flex flex-wrap items-center gap-3 mb-8">
              <div className="glass inline-flex items-center gap-2 rounded-full pl-2 pr-4 h-[30px]">
                <span className="w-[22px] h-[22px] rounded-full bg-[#84FF3D] grid place-items-center text-[11px] font-bold text-black">✓</span>
                <span className="mono text-[10px] tracking-[0.14em] text-[#CBD5E1]">DOS7 ALIGNED • GOV.UK SERVICE STANDARD 14 POINTS</span>
              </div>
              <div className="mono text-[10px] tracking-[0.16em] text-[#475569]">OLDHAM OL8 → GLOBAL • 2024—2026</div>
            </div>

            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
              <div>
                <h1 data-animate className="sora text-[42px] md:text-[64px] lg:text-[72px] font-[800] leading-[0.92] tracking-[-0.04em]">
                  Solutions Engineered<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5FF] via-[#38BDF8] to-[#84FF3D]">For Industries</span><br />
                  That Can't Fail
                </h1>
                <p data-animate className="mt-6 max-w-[620px] text-[18px] md:text-[20px] leading-[1.45] tracking-[-0.015em] text-[#94A3B8]">
                  We don't sell features. We ship OS that solve <span className="text-white font-[600]">P1 problems</span>. 6 OS built, 23K garages onboarded, £20K MRR per OS.
                  <br /><span className="mono text-[12px] tracking-[0.12em] text-[#475569] mt-3 block">// WIRE: Supabase table solutions, evidence_vault, compliance_checks</span>
                </p>

                <div data-animate className="mt-8 flex flex-wrap gap-3">
                  <a href="#industries" className="sora h-[48px] px-7 rounded-full bg-white text-black text-[13px] font-[700] inline-flex items-center gap-2 hover:bg-white/90 transition">Explore 6 Industry OS →</a>
                  <button onClick={()=>setAvaOpen(true)} className="h-[48px] px-7 rounded-full glass text-[13px] font-[600] inline-flex items-center gap-2 hover:bg-white/[0.08] transition"><span className="w-[8px] h-[8px] rounded-full bg-[#84FF3D]" />AVA Triage Live</button>
                </div>

                {/* Metrics */}
                <div data-animate className="mt-12 grid grid-cols-3 max-w-[560px] border border-white/[0.06] rounded-[18px] overflow-hidden">
                  {[
                    { k:"6 OS", v:"Built & Shipping", sub:"Property → Cultural" },
                    { k:"23K", v:"Garages Onboarded", sub:"DVSA Importer" },
                    { k:"£20K", v:"MRR / OS Target", sub:"£120K Run Rate" },
                  ].map(m=>(
                    <div key={m.k} className="p-5 md:p-6 bg-[rgba(255,255,255,0.02)] border-r last:border-r-0 border-white/[0.06]">
                      <div className="sora text-[24px] font-[800] tracking-[-0.02em]">{m.k}</div>
                      <div className="mono text-[10px] tracking-[0.12em] text-white mt-1">{m.v}</div>
                      <div className="mono text-[9px] text-[#475569] mt-1">{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Live OS Map */}
              <div data-animate className="relative">
                <div className="glass-strong rounded-[28px] border border-white/[0.08] p-[1px]">
                  <div className="rounded-[27px] bg-[#0A0F1E] p-6 md:p-7">
                    <div className="flex items-center justify-between">
                      <div className="mono text-[10px] tracking-[0.18em] text-[#475569]">SOLUTION MATRIX • LIVE</div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-[6px] h-[6px] rounded-full bg-[#84FF3D] animate-pulse" />
                        <span className="mono text-[9px] text-[#84FF3D]">6 ACTIVE</span>
                      </div>
                    </div>

                    {/* Mini infographic */}
                    <svg viewBox="0 0 340 210" className="w-full mt-6">
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#0EA5FF" />
                          <stop offset="100%" stopColor="#84FF3D" />
                        </linearGradient>
                      </defs>
                      {/* nodes */}
                      <circle cx="40" cy="40" r="18" fill="none" stroke="#FFD700" strokeWidth="1.5" opacity="0.8"/>
                      <text x="40" y="44" textAnchor="middle" fontSize="9" fill="#FFD700" fontFamily="JetBrains Mono">VG</text>
                      <circle cx="120" cy="30" r="18" fill="none" stroke="#0EA5FF" strokeWidth="1.5"/>
                      <text x="120" y="34" textAnchor="middle" fontSize="9" fill="#0EA5FF" fontFamily="JetBrains Mono">VX</text>
                      <circle cx="200" cy="50" r="22" fill="#FFD700" stroke="#FFD700"/>
                      <text x="200" y="54" textAnchor="middle" fontSize="10" fontWeight="700" fill="#000" fontFamily="Sora">TF</text>
                      <circle cx="280" cy="40" r="18" fill="none" stroke="#84FF3D" strokeWidth="1.5"/>
                      <text x="280" y="44" textAnchor="middle" fontSize="8" fill="#84FF3D" fontFamily="JetBrains Mono">RS</text>

                      <path d="M58 45 C 80 60, 100 45, 120 38" stroke="white" strokeOpacity="0.12" fill="none"/>
                      <path d="M138 35 C 160 40, 180 45, 200 50" stroke="white" strokeOpacity="0.12" fill="none" strokeDasharray="4 4"/>
                      <path d="M218 55 C 240 55, 260 48, 280 45" stroke="white" strokeOpacity="0.12" fill="none"/>

                      {/* lower */}
                      <circle cx="90" cy="120" r="16" fill="none" stroke="white" strokeOpacity="0.2"/>
                      <text x="90" y="124" textAnchor="middle" fontSize="8" fill="white" opacity="0.6" fontFamily="JetBrains Mono">RA</text>
                      <circle cx="210" cy="130" r="16" fill="none" stroke="white" strokeOpacity="0.2"/>
                      <text x="210" y="134" textAnchor="middle" fontSize="8" fill="white" opacity="0.6" fontFamily="JetBrains Mono">AA</text>

                      {/* center OS */}
                      <rect x="125" y="82" width="90" height="28" rx="14" fill="none" stroke="url(#g1)" strokeWidth="1"/>
                      <text x="170" y="100" textAnchor="middle" fontSize="10" fontWeight="600" fill="white" fontFamily="Sora">AiKOVA CORE</text>

                      {/* connections */}
                      <path d="M90 104 L 130 95" stroke="white" strokeOpacity="0.15" fill="none"/>
                      <path d="M210 114 L 190 108" stroke="white" strokeOpacity="0.15" fill="none"/>
                    </svg>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {[
                        { n:"VisaGuide", s:"visaguideos.com", c:"#FFD700" },
                        { n:"Vexo Garage", s:"23K Import", c:"#0EA5FF" },
                        { n:"TradeFlow", s:"FLAGSHIP", c:"#FFD700" },
                        { n:"ReelStorm", s:"GPU • UE5.8", c:"#84FF3D" },
                      ].map(x=>(
                        <div key={x.n} className="flex items-center gap-2 glass rounded-full px-3 h-[28px]">
                          <span className="w-[6px] h-[6px] rounded-full" style={{background:x.c}}/>
                          <span className="mono text-[10px] text-[#CBD5E1]">{x.n}</span>
                          <span className="mono text-[8px] text-[#475569] ml-auto">{x.s}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 p-3 rounded-[14px] bg-[#05070D] border border-white/[0.06]">
                      <div className="mono text-[9px] tracking-[0.16em] text-[#475569]">P1 RESOLUTION SLA</div>
                      <div className="mt-2 flex gap-2">
                        <div className="flex-1">
                          <div className="h-[4px] rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[92%] bg-[#84FF3D]"/></div>
                          <div className="mono text-[8px] text-[#94A3B8] mt-1">Triage 30min • 92%</div>
                        </div>
                        <div className="flex-1">
                          <div className="h-[4px] rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[87%] bg-[#0EA5FF]"/></div>
                          <div className="mono text-[8px] text-[#94A3B8] mt-1">Mitigation 2hr • 87%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* floating badge */}
                <div className="absolute -right-3 -bottom-4 glass rounded-[14px] px-4 py-3 border border-[#FFD700]/20 glow-gold">
                  <div className="mono text-[9px] tracking-[0.14em] text-[#FFD700]">OLDHAM OL8 → GLOBAL</div>
                  <div className="sora text-[13px] font-[700] mt-1">£120K MRR Run Rate • 6 OS</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUTIONS BY INDUSTRY */}
        <section id="industries" className="mx-auto max-w-[1320px] px-6 md:px-8 py-[48px] md:py-[84px]">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <div className="mono text-[11px] tracking-[0.2em] text-[#0EA5FF]">01 • SOLUTIONS BY INDUSTRY</div>
              <h2 className="sora mt-3 text-[32px] md:text-[44px] font-[700] leading-[0.95] tracking-[-0.03em]">6 OS • Each Solves a P1<br />No Features. Just Outcomes.</h2>
            </div>
            <div className="mono text-[12px] leading-[1.5] text-[#64748B] max-w-[360px]">Every OS ships with DVSA/GOV.UK compliance, Stripe vault, Supabase RLS, and Ultron monitoring. Not MVPs — production OS.</div>
          </div>

          <div className="grid md:grid-cols-12 gap-[1px] bg-white/[0.06] rounded-[24px] overflow-hidden border border-white/[0.06]">
            {industries.map((ind) => {
              const isActive = activeIndustry === ind.id;
              const isFlagship = ind.id === "C";
              return (
                <div
                  key={ind.id}
                  data-animate
                  onMouseEnter={()=>setActiveIndustry(ind.id)}
                  className={`
                    group relative bg-[#0A0F1E] p-6 md:p-7 flex flex-col
                    ${isFlagship ? "md:col-span-12" : "md:col-span-6 lg:col-span-4"}
                    ${isActive ? "z-10" : ""}
                    transition-all duration-500 cursor-pointer
                  `}
                  style={{ boxShadow: isActive ? `inset 0 0 0 1px ${ind.accent}40, 0 0 60px ${ind.glow}` : undefined }}
                >
                  {/* header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-[40px] h-[40px] rounded-[12px] bg-gradient-to-br ${ind.gradient} grid place-items-center text-black font-[800] sora text-[13px]`}>{ind.id}</div>
                      <div>
                        <div className="mono text-[10px] tracking-[0.14em] text-[#64748B]">{ind.tag.toUpperCase()}</div>
                        <div className="sora text-[18px] font-[700] tracking-[-0.02em] leading-[1.1]">{ind.name}</div>
                      </div>
                    </div>
                    <div className={`mono text-[8px] px-2.5 py-1 rounded-full border ${ind.border} ${isFlagship ? "bg-[#FFD700] text-black border-[#FFD700]" : "bg-white/[0.04] text-[#94A3B8]"}`}>{ind.status}</div>
                  </div>

                  <div className="mt-5 mono text-[10px] tracking-[0.14em] text-[#475569]">{ind.domain}</div>

                  {/* Problem → Solution */}
                  <div className="mt-5 space-y-4">
                    <div className="relative pl-4 border-l border-white/[0.08]">
                      <div className="absolute -left-[1px] top-0 w-[1px] h-[14px] bg-[#EF4444]" />
                      <div className="mono text-[9px] tracking-[0.16em] text-[#EF4444]">PROBLEM • P1</div>
                      <div className="mt-1.5 text-[13px] leading-[1.45] text-[#CBD5E1]">{ind.problem}</div>
                    </div>
                    <div className="relative pl-4 border-l border-white/[0.08]">
                      <div className="absolute -left-[1px] top-0 w-[1px] h-[14px] bg-[#84FF3D]" />
                      <div className="mono text-[9px] tracking-[0.16em] text-[#84FF3D]">SOLUTION • OS BUILT</div>
                      <div className="mt-1.5 text-[13px] leading-[1.45] text-white font-[500]">{ind.solution}</div>
                    </div>
                  </div>

                  {/* Tech */}
                  <div className="mt-6">
                    <div className="mono text-[9px] tracking-[0.16em] text-[#475569]">TECH • STACK</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {ind.tech.map(t=>(
                        <span key={t} className="mono text-[10px] px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06] text-[#94A3B8]">{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Outcome infographic mini */}
                  <div className="mt-auto pt-6">
                    <div className="h-[1px] bg-gradient-to-r from-white/[0.08] to-transparent" />
                    <div className="mt-4 flex items-center justify-between">
                      <div className="mono text-[10px] text-[#64748B]">OUTCOME</div>
                      <div className="w-[20px] h-[20px] rounded-full border border-white/10 grid place-items-center group-hover:rotate-45 transition-transform">↗</div>
                    </div>
                    <div className="mt-2 sora text-[13px] font-[600] leading-[1.3] text-[#E2E8F0]">{ind.outcome}</div>

                    {isFlagship && (
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {[
                          {k:"36", l:"PAGES"},
                          {k:"65", l:"BACKEND"},
                          {k:"10", l:"MODULES"},
                          {k:"3", l:"BOTS"},
                        ].map(b=>(
                          <div key={b.l} className="rounded-[10px] bg-[#FFD700]/10 border border-[#FFD700]/20 p-2 text-center">
                            <div className="sora text-[14px] font-[800] text-[#FFD700]">{b.k}</div>
                            <div className="mono text-[8px] text-[#FFD700]/70">{b.l}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* hover glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-[1] transition duration-500" style={{ background:`radial-gradient(600px circle at 0% 0%, ${ind.glow}, transparent 70%)`}} />
                </div>
              );
            })}
          </div>

          <div className="mt-6 mono text-[10px] text-[#475569]">// WIRE: Supabase table industries, select * where status=live order by mrr desc, join tech_stack, join outcomes</div>
        </section>

        {/* SOLUTIONS BY PROBLEM TYPE */}
        <section id="problems" className="border-y border-white/[0.06] bg-[#0A0F1E]/50">
          <div className="mx-auto max-w-[1320px] px-6 md:px-8 py-[48px] md:py-[72px]">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
              <h3 className="sora text-[28px] md:text-[36px] font-[700] tracking-[-0.02em]">Solutions by Problem Type</h3>
              <div className="mono text-[11px] text-[#475569] tracking-[0.14em]">PLAYBOOK • 6 P1 PATTERNS WE SOLVE DAILY</div>
            </div>

            <div className="grid md:grid-cols-3 gap-[1px] bg-white/[0.06] rounded-[20px] overflow-hidden border border-white/[0.06]">
              {problemGrid.map((p,i)=>(
                <div key={p.title} data-animate style={{transitionDelay:`${i*60}ms`}} className="group bg-[#0E1424] p-6 md:p-7 hover:bg-[#111A2F] transition">
                  <div className="flex items-start justify-between">
                    <div className="w-[36px] h-[36px] rounded-[10px] bg-white/[0.05] border border-white/[0.06] grid place-items-center text-[16px]">{p.icon}</div>
                    <div className="mono text-[9px] px-2 py-1 rounded-full bg-[#84FF3D]/10 text-[#84FF3D] border border-[#84FF3D]/20">SOLVED</div>
                  </div>
                  <div className="mt-4 sora text-[16px] font-[600] leading-[1.25] tracking-[-0.01em]">{p.title}</div>
                  <div className="mt-2 text-[13px] leading-[1.5] text-[#94A3B8]">→ {p.fix}</div>
                  <div className="mt-4 mono text-[10px] text-[#0EA5FF] group-hover:underline underline-offset-4">{p.link}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ARCHITECTURE PATTERNS */}
        <section id="blueprints" className="mx-auto max-w-[1320px] px-6 md:px-8 py-[56px] md:py-[88px]">
          <div className="mono text-[11px] tracking-[0.2em] text-[#84FF3D]">02 • ARCHITECTURE PATTERNS • REUSABLE BLUEPRINTS</div>
          <h2 className="sora mt-3 text-[32px] md:text-[44px] font-[700] leading-[0.95] tracking-[-0.03em] max-w-[720px]">We Don't Start From Zero.<br />We Deploy Blueprints That Saved $50K+.</h2>

          <div className="mt-10 grid lg:grid-cols-3 gap-6">
            {[
              {
                id:"01",
                title:"Cloud OS Pattern",
                sub:"S3 SES SNS Lambda CloudFront IaC FinOps",
                saving:"$50K saved",
                color:"#0EA5FF",
                nodes:["Client → CloudFront","Lambda @ Edge","S3 / R2 Vault","SES / SNS / SQS","IaC • FinOps • Guardrails"]
              },
              {
                id:"02",
                title:"Payment OS Pattern",
                sub:"Checkout → PCI Vault → Settlement → ERP",
                saving:"8 Gateways • PSD2",
                color:"#FFD700",
                nodes:["Checkout OS","PCI Vault (Encrypted)","Stripe / Worldpay / PayPal / Barclaycard","Settlement Engine","ERP/CRM → Odoo / Dynamics"]
              },
              {
                id:"03",
                title:"Industrial IoT Pattern",
                sub:"Sensor → IIoT → MES → Predictive",
                saving:"IIoT → Odoo Live",
                color:"#84FF3D",
                nodes:["Sensor / GPS / IoT","IIoT Gateway","MES / WMS","Predictive Maintenance","Odoo / Dynamics 365"]
              },
            ].map((bp, idx)=>(
              <div key={bp.id} data-animate style={{transitionDelay:`${idx*100}ms`}} className="group relative rounded-[22px] border border-white/[0.08] bg-[#0E1424] p-[1px] overflow-hidden">
                <div className="rounded-[21px] bg-[#0A0F1E] p-6 h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-[28px] h-[28px] rounded-[8px] grid place-items-center text-[11px] font-[700] text-black" style={{background:bp.color}}>B{bp.id}</div>
                      <div className="mono text-[10px] tracking-[0.14em] text-[#475569]">BLUEPRINT {bp.id}</div>
                    </div>
                    <div className="mono text-[9px] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[#94A3B8]">{bp.saving}</div>
                  </div>

                  <div className="mt-5 sora text-[20px] font-[700] tracking-[-0.01em]">{bp.title}</div>
                  <div className="mono text-[11px] text-[#64748B] mt-1">{bp.sub}</div>

                  {/* SVG flow */}
                  <div className="mt-6 relative">
                    <div className="absolute left-[11px] top-[8px] bottom-[8px] w-[1px] bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
                    <div className="space-y-3">
                      {bp.nodes.map((n, i)=>(
                        <div key={n} className="flex items-center gap-3">
                          <div className="w-[22px] h-[22px] rounded-full bg-[#0E1424] border border-white/15 grid place-items-center relative z-10">
                            <div className="w-[6px] h-[6px] rounded-full" style={{background: i===0?bp.color: i===bp.nodes.length-1?"#84FF3D":"white", opacity:i===0?1:0.6}} />
                          </div>
                          <div className={`mono text-[12px] ${i===0?"text-white font-[600]":"text-[#94A3B8]"} ${i===bp.nodes.length-1?"text-[#84FF3D]":""}`}>{n}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-3 rounded-[12px] bg-[#05070D] border border-white/[0.06] flex items-center justify-between">
                    <div className="mono text-[9px] text-[#475569]">DEPLOY TIME</div>
                    <div className="mono text-[10px] text-white">~14 days • Zero-downtime</div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700" style={{background:`radial-gradient(500px at 50% -20%, ${bp.color}18, transparent)`}} />
              </div>
            ))}
          </div>

          <div className="mt-6 mono text-[10px] text-[#475569]">// WIRE: Supabase table blueprints, storage bucket blueprints_svg, join evidence_logs where pattern_id</div>
        </section>

        {/* TECH STACK WALL */}
        <section id="stack" className="border-y border-white/[0.06] bg-[#05070D] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,255,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-[1320px] px-6 md:px-8 py-[56px] md:py-[72px]">
            <div className="flex flex-wrap gap-6 items-end justify-between">
              <div>
                <div className="mono text-[11px] tracking-[0.2em] text-[#94A3B8]">03 • TECH STACK WALL • ITRANSITION PLAYBOOK</div>
                <h3 className="sora mt-3 text-[28px] md:text-[36px] font-[700] tracking-[-0.02em]">Enterprise Grade.<br />Consultancy Depth.</h3>
              </div>
              <div className="mono text-[11px] text-[#475569] max-w-[320px] leading-[1.5]">From Itransition's enterprise stack model: Cloud • Payment • Industrial • AI • DevOps • Compliance. We ship what $100k consultancies slide-deck.</div>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[1px] bg-white/[0.06] rounded-[18px] overflow-hidden border border-white/[0.06]">
              {[
                { cat:"Cloud", items:["AWS","Azure","GCP","S3","CloudFront","Lambda","SES/SNS"] },
                { cat:"Payment", items:["8 Gateways","Stripe","Worldpay","PayPal","Barclaycard","PSD2","KYC/AML"] },
                { cat:"Industrial", items:["ERP","WMS","IIoT","MES","Odoo","Dynamics 365","SAP"] },
                { cat:"Enterprise", items:["Salesforce","Dynamics 365","Odoo","SAP","Power BI","Shopify","REST/SOAP"] },
                { cat:"AI", items:["Qwen","Claude MCP","DashScope","Pinecone","PostHog","Sentry","RunPod"] },
                { cat:"DevOps", items:["CI/CD","FinOps","ISO 27001","Cyber Essentials","PCI DSS","IaC","Ultron Monitor"] },
              ].map((col)=>(
                <div key={col.cat} className="bg-[#0A0F1E] p-5">
                  <div className="mono text-[10px] tracking-[0.18em] text-[#0EA5FF]">{col.cat.toUpperCase()}</div>
                  <div className="mt-4 space-y-2.5">
                    {col.items.map(it=>(
                      <div key={it} className="mono text-[12px] text-[#CBD5E1] flex items-center gap-2"><span className="w-[3px] h-[3px] rounded-full bg-[#475569]" />{it}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Logos marquee fake */}
            <div className="mt-8 glass rounded-full h-[44px] flex items-center overflow-hidden border border-white/[0.06]">
              <div className="flex items-center gap-10 px-6 animate-[marquee_30s_linear_infinite] whitespace-nowrap mono text-[11px] tracking-[0.14em] text-[#64748B]">
                <span>★ GOV.UK ALIGNED</span><span>•</span><span>DVSA DATA.GOV.UK</span><span>•</span><span>PCI DSS VAULT</span><span>•</span><span>WCAG 2.2 AA</span><span>•</span><span>ISO 27001</span><span>•</span><span>CYBER ESSENTIALS</span><span>•</span><span>SUPABASE RLS</span><span>•</span><span>STRIPE CONNECT</span><span>•</span><span>ODOO ERP</span><span>•</span><span>MAPBOX / GOOGLE MAPS</span><span>•</span><span>UNREAL ENGINE 5.8</span>
              </div>
            </div>
          </div>
        </section>

        {/* EVIDENCE & COMPLIANCE */}
        <section id="compliance" className="mx-auto max-w-[1320px] px-6 md:px-8 py-[56px] md:py-[84px]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
            <div>
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 h-[28px] border border-[#84FF3D]/20">
                <span className="w-[6px] h-[6px] rounded-full bg-[#84FF3D]" />
                <span className="mono text-[10px] tracking-[0.14em] text-[#84FF3D]">DOS7 KILLER • EVIDENCE VAULT</span>
              </div>
              <h2 className="sora mt-4 text-[32px] md:text-[42px] font-[700] leading-[0.95] tracking-[-0.03em]">Evidence & Compliance<br />12-Month Rolling Vault</h2>
              <p className="mt-4 text-[14px] leading-[1.6] text-[#94A3B8] max-w-[520px]">GOV.UK Service Standard 14 points, WCAG 2.2 AA, 12-month rolling evidence vault. We don't claim compliance — we ship evidence.</p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { k:"14 Points", v:"GOV.UK Service Standard", d:"Discovery → Live" },
                  { k:"WCAG 2.2 AA", v:"Accessibility", d:"Screen reader + keyboard" },
                  { k:"12-Month", v:"Rolling Evidence", d:"Logs • Tickets • Chats" },
                  { k:"AVA + Ultron", v:"Monitoring", d:"P1 detection <30sec" },
                ].map(card=>(
                  <div key={card.k} data-animate className="glass rounded-[16px] p-4">
                    <div className="sora text-[14px] font-[700]">{card.k}</div>
                    <div className="mono text-[11px] text-[#CBD5E1] mt-1">{card.v}</div>
                    <div className="mono text-[10px] text-[#475569] mt-1">{card.d}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[18px] border border-white/[0.08] bg-[#0E1424] p-5">
                <div className="mono text-[10px] tracking-[0.16em] text-[#475569]">EVIDENCE VAULT • 4 ARTIFACTS</div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { n:"Engagement Log", c:"42 entries" },
                    { n:"Tickets", c:"Jira/Linear sync" },
                    { n:"Chats (AVA)", c:"WhatsApp SNS" },
                    { n:"Invoices", c:"Stripe • Odoo" },
                  ].map(e=>(
                    <div key={e.n} className="rounded-[12px] bg-[#05070D] border border-white/[0.06] p-3">
                      <div className="mono text-[11px] text-white">{e.n}</div>
                      <div className="mono text-[10px] text-[#475569] mt-1">{e.c}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 mono text-[10px] text-[#475569]">// WIRE: Supabase bucket evidence_vault, table compliance_checks RLS, PostHog analytics, Sentry errors</div>
              </div>
            </div>

            <div data-animate className="relative">
              <div className="glass-strong rounded-[22px] p-[1px]">
                <div className="rounded-[21px] bg-[#0A0F1E] p-6">
                  <div className="flex items-center justify-between">
                    <div className="mono text-[10px] tracking-[0.18em] text-[#475569]">SERVICE STANDARD CHECKLIST</div>
                    <div className="mono text-[9px] px-2 py-1 rounded-full bg-[#84FF3D]/10 text-[#84FF3D] border border-[#84FF3D]/20">14/14 PASS</div>
                  </div>

                  <div className="mt-6 space-y-2.5">
                    {[
                      "Understand users and their needs",
                      "Solve a whole problem for users",
                      "Provide a joined-up experience",
                      "Make the service simple to use",
                      "Make sure everyone can use the service",
                      "Have a multidisciplinary team",
                      "Use agile ways of working",
                      "Iterate and improve frequently",
                      "Create a secure service",
                      "Define what success looks like",
                      "Choose the right tools",
                      "Make new source code open",
                      "Use and contribute to open standards",
                      "Operate a reliable service",
                    ].map((item, i)=>(
                      <div key={item} className="flex gap-3">
                        <div className="mt-[2px] w-[18px] h-[18px] rounded-[6px] bg-[#84FF3D] grid place-items-center text-[10px] text-black font-bold">✓</div>
                        <div className="flex-1">
                          <div className="mono text-[11px] text-[#E2E8F0] leading-[1.4]">{i+1}. {item}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 h-[1px] bg-white/[0.06]" />
                  <div className="mt-4 flex items-center gap-3">
                    <img src={logoAsset} alt="AiKOVA" className="w-[28px] h-[28px] rounded-[8px]" />
                    <div>
                      <div className="sora text-[12px] font-[600]">AiKOVA • Oldham OL8</div>
                      <div className="mono text-[10px] text-[#475569]">Evidence generated automatically via Supabase + PostHog</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA + FORM */}
        <section className="relative overflow-hidden border-t border-white/[0.06]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(14,165,255,0.16),transparent_50%),radial-gradient(circle_at_0%_100%,rgba(132,255,61,0.12),transparent_60%)]" />
          <div className="relative mx-auto max-w-[1320px] px-6 md:px-8 py-[56px] md:py-[84px]">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
              <div data-animate>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#84FF3D] text-black px-3 h-[26px] mono text-[10px] font-[700] tracking-[0.14em]">AVA TRIAGE • LIVE</div>
                <h2 className="sora mt-5 text-[36px] md:text-[52px] font-[800] leading-[0.9] tracking-[-0.04em]">Have a Problem<br />We Haven't Solved?<br /><span className="text-[#0EA5FF]">AVA Will Assess It In 60s</span></h2>
                <p className="mt-5 text-[15px] leading-[1.6] text-[#94A3B8] max-w-[480px]">Describe your P1. AVA runs 6-OS pattern matching, risk scoring, blueprint assignment, and compliance mapping. No sales call. Just a triage report.</p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {["P1 Triage 30min","Blueprint Match","DOS7 Evidence","PCI Vault Check"].map(t=>(
                    <span key={t} className="mono text-[10px] px-3 py-1.5 rounded-full glass text-[#CBD5E1]">{t}</span>
                  ))}
                </div>

                {assessments.length>0 && (
                  <div className="mt-10">
                    <div className="mono text-[10px] tracking-[0.16em] text-[#475569]">LIVE TRIAGE QUEUE • {assessments.length} ASSESSMENTS</div>
                    <div className="mt-3 space-y-2 max-h-[200px] overflow-auto pr-1">
                      {assessments.slice(0,5).map(a=>(
                        <div key={a.id} className="glass rounded-[12px] px-4 py-3 flex items-center justify-between">
                          <div>
                            <div className="mono text-[11px] text-white">{a.value.company} • {a.value.problemType}</div>
                            <div className="mono text-[10px] text-[#475569] mt-1">{new Date(a.created_at).toLocaleString()} • {a.value.urgency}</div>
                          </div>
                          <div className="w-[8px] h-[8px] rounded-full bg-[#84FF3D] animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div data-animate className="glass-strong rounded-[24px] p-[1px]">
                <form onSubmit={handleCreate} className="rounded-[23px] bg-[#0E1424] p-6 md:p-7">
                  <div className="flex items-center justify-between">
                    <div className="sora text-[16px] font-[700]">AVA Assessment Intake</div>
                    <div className="mono text-[9px] px-2 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[#94A3B8]">60s • No Spam</div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="space-y-1.5">
                        <span className="mono text-[10px] tracking-[0.14em] text-[#64748B]">COMPANY</span>
                        <input value={form.company} onChange={e=>setForm({...form, company:e.target.value})} placeholder="e.g. 23K Garage Ltd" className="w-full h-[44px] rounded-[12px] bg-[#05070D] border border-white/[0.08] px-4 mono text-[13px] text-white placeholder:text-[#475569] focus:outline-none focus:border-[#0EA5FF]/50" />
                      </label>
                      <label className="space-y-1.5">
                        <span className="mono text-[10px] tracking-[0.14em] text-[#64748B]">CONTACT • EMAIL/PHONE</span>
                        <input value={form.contact} onChange={e=>setForm({...form, contact:e.target.value})} placeholder="founder@…" className="w-full h-[44px] rounded-[12px] bg-[#05070D] border border-white/[0.08] px-4 mono text-[13px] text-white placeholder:text-[#475569] focus:outline-none focus:border-[#0EA5FF]/50" />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="space-y-1.5">
                        <span className="mono text-[10px] tracking-[0.14em] text-[#64748B]">PROBLEM TYPE</span>
                        <select value={form.problemType} onChange={e=>setForm({...form, problemType:e.target.value})} className="w-full h-[44px] rounded-[12px] bg-[#05070D] border border-white/[0.08] px-3 mono text-[12px] text-white focus:outline-none">
                          {problemGrid.map(p=><option key={p.title} value={p.title}>{p.title}</option>)}
                        </select>
                      </label>
                      <label className="space-y-1.5">
                        <span className="mono text-[10px] tracking-[0.14em] text-[#64748B]">URGENCY</span>
                        <select value={form.urgency} onChange={e=>setForm({...form, urgency:e.target.value})} className="w-full h-[44px] rounded-[12px] bg-[#05070D] border border-white/[0.08] px-3 mono text-[12px] text-white focus:outline-none">
                          <option>P1 - Critical</option><option>P2 - High</option><option>P3 - Medium</option><option>P4 - Low</option>
                        </select>
                      </label>
                    </div>

                    <label className="space-y-1.5">
                      <span className="mono text-[10px] tracking-[0.14em] text-[#64748B]">DESCRIBE YOUR P1 • WHAT'S BREAKING?</span>
                      <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} rows={4} placeholder="e.g. Payment gateway down, 23K MOT CSV import failing, trading risk blowup, content pipeline bottleneck… What did you try? What’s the cost per hour?" className="w-full rounded-[14px] bg-[#05070D] border border-white/[0.08] p-4 mono text-[13px] leading-[1.5] text-white placeholder:text-[#475569] focus:outline-none focus:border-[#0EA5FF]/50 resize-none" />
                    </label>

                    {resultMsg && (
                      <div className={`rounded-[12px] px-4 py-3 mono text-[11px] leading-[1.5] border ${resultMsg.type==="success" ? "bg-[#84FF3D]/10 border-[#84FF3D]/20 text-[#84FF3D]" : "bg-[#EF4444]/10 border-[#EF4444]/20 text-[#F87171]"}`}>
                        {resultMsg.text}
                      </div>
                    )}

                    <button disabled={busy} className="h-[48px] rounded-full bg-[#0EA5FF] text-white sora text-[13px] font-[700] tracking-[-0.01em] hover:bg-[#0EA5FF]/90 disabled:opacity-50 transition glow-blue">
                      {busy ? "AVA Triaging…" : "Run AVA Assessment • 60s → Contact OS"}
                    </button>

                    <div className="flex items-center justify-between mono text-[10px] text-[#475569]">
                      <span>→ Contact OS • Floating widget</span>
                      <span className="flex items-center gap-1.5"><span className="w-[5px] h-[5px] rounded-full bg-[#84FF3D]" />Supabase RLS + SES/SNS</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/[0.06] bg-[#05070D]">
          <div className="mx-auto max-w-[1320px] px-6 md:px-8 h-[64px] flex items-center justify-between mono text-[10px] tracking-[0.14em] text-[#475569]">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><img src={logoAsset} alt="" className="w-[18px] h-[18px] rounded-[5px]" />AiKOVA • OL8 → GLOBAL</span>
              <span className="hidden md:inline">6 OS • £20K MRR / OS • £120K RUN RATE</span>
            </div>
            <div className="flex items-center gap-4">
              <span>© 2026 AiKOVA OS</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">GOV.UK • WCAG 2.2 AA • PCI DSS</span>
            </div>
          </div>
        </footer>

        {/* FLOATING AVA WIDGET */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
          {avaOpen && (
            <div className="w-[320px] rounded-[18px] border border-white/[0.10] bg-[#0E1424]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-[28px] h-[28px] rounded-full bg-[#0EA5FF] grid place-items-center text-white text-[12px]">AVA</div>
                  <div>
                    <div className="sora text-[12px] font-[700]">AVA • Triage Agent</div>
                    <div className="mono text-[9px] text-[#84FF3D] flex items-center gap-1"><span className="w-[5px] h-[5px] rounded-full bg-[#84FF3D] animate-pulse" />Online • 60s SLA</div>
                  </div>
                </div>
                <button onClick={()=>setAvaOpen(false)} className="w-[24px] h-[24px] rounded-full bg-white/5 grid place-items-center text-[#94A3B8]">✕</button>
              </div>
              <div className="mt-4 space-y-2">
                <div className="rounded-[12px] bg-[#05070D] border border-white/[0.06] p-3 mono text-[11px] leading-[1.5] text-[#CBD5E1]">
                  Hi, I'm AVA. I match your problem to 6 OS blueprints, estimate cost-to-fix, and assign a Contact OS owner. <span className="text-white">Drop your P1 in the form →</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>{document.getElementById('compliance')?.scrollIntoView({behavior:'smooth'}); setAvaOpen(false)}} className="flex-1 h-[36px] rounded-full glass mono text-[11px] text-[#CBD5E1]">Evidence Vault</button>
                  <button onClick={()=>{window.scrollTo({top:0, behavior:'smooth'}); setAvaOpen(false)}} className="flex-1 h-[36px] rounded-full bg-[#0EA5FF] text-white mono text-[11px]">Contact OS</button>
                </div>
              </div>
            </div>
          )}
          <button onClick={()=>setAvaOpen(!avaOpen)} className="w-[56px] h-[56px] rounded-full bg-[#0EA5FF] text-white grid place-items-center shadow-[0_0_0_1px_rgba(14,165,255,0.3),0_10px_30px_rgba(14,165,255,0.4)] hover:scale-[1.05] transition">
            <span className="sora font-[800] text-[14px]">AVA</span>
          </button>
        </div>

        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>
    </>
  );
}

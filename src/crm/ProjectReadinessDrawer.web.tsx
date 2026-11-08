import React, { useEffect, useMemo, useState } from 'react';
import { X, ArrowUpRight, Download } from 'lucide-react';
import {
  getProjectReadiness,
  type ProjectReadiness,
  type ReadinessStatus,
} from './projectReadinessData';

type Props = {
  projectName: string;
  progress?: number;
  color?: string;
  desc?: string;
  mrr?: string;
  billing?: string;
  tickets?: number;
  onClose: () => void;
};

function Circle({
  pct,
  size = 72,
  stroke = 7,
  color = '#0EA5FF',
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    let r = 0;
    const id = setInterval(() => {
      r += 1;
      if (r >= pct) {
        r = pct;
        clearInterval(id);
      }
      setAnimated(r);
    }, 12);
    return () => clearInterval(id);
  }, [pct]);
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (animated / 100) * circ;
  const gid = `rg-${size}-${pct}-${color.replace('#', '')}`;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ stroke: `url(#${gid})` }}
        />
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="#84FF3D" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-bold text-white" style={{ fontSize: size < 56 ? 11 : 16 }}>
          {animated}%
        </span>
      </div>
    </div>
  );
}

function Badge({ status }: { status: ReadinessStatus }) {
  const cls =
    status === 'DONE'
      ? 'bg-[#84FF3D]/15 text-[#84FF3D]'
      : status === 'WIP'
        ? 'bg-[#FFD700]/15 text-[#FFD700]'
        : 'bg-white/10 text-zinc-400';
  return (
    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

export default function ProjectReadinessDrawer({
  projectName,
  progress,
  color,
  desc,
  mrr,
  billing,
  tickets,
  onClose,
}: Props) {
  const data: ProjectReadiness = useMemo(
    () =>
      getProjectReadiness(projectName, {
        progress: progress ?? 50,
        color: color || '#0EA5FF',
        desc: desc || '',
      }),
    [projectName, progress, color, desc],
  );

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    data.phases.forEach((p, i) => {
      init[p.title] = i < 2;
    });
    return init;
  });
  const [live, setLive] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (!data.liveApi) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(data.liveApi!);
        const json = await res.json().catch(() => null);
        if (!cancelled) setLive(json);
      } catch {
        if (!cancelled) setLive({ hint: 'Could not reach live readiness API' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [data.liveApi]);

  const doneCount = data.phases.reduce(
    (n, p) => n + p.items.filter((i) => i.status === 'DONE').length,
    0,
  );
  const wipCount = data.phases.reduce(
    (n, p) => n + p.items.filter((i) => i.status === 'WIP').length,
    0,
  );
  const todoCount = data.phases.reduce(
    (n, p) => n + p.items.filter((i) => i.status === 'TODO').length,
    0,
  );

  const exportReport = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            project: data.name,
            overall: data.overall,
            exportedAt: new Date().toISOString(),
            phases: data.phases,
            leftNow: data.leftNow,
            live,
          },
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.replace(/\s+/g, '-').toLowerCase()}-readiness.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-[640px] flex-col border-l border-white/10 bg-[#070A12]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] p-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
              Project readiness
            </div>
            <h3 className="sora mt-1 text-[18px] font-semibold">{data.name}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
              <span
                className="rounded-full px-2.5 py-1 font-bold text-black"
                style={{ background: `linear-gradient(135deg,#00E5FF,${data.color},#84FF3D)` }}
              >
                LIVE · {data.overall}%
              </span>
              {mrr ? <span className="rounded-full bg-white/[0.06] px-2.5 py-1">{mrr}</span> : null}
              {typeof tickets === 'number' ? (
                <span className="rounded-full bg-white/[0.06] px-2.5 py-1">{tickets} tickets</span>
              ) : null}
              <span className="text-zinc-500">
                {doneCount} DONE · {wipCount} WIP · {todoCount} TODO
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportReport}
              className="rounded-full border border-white/10 bg-white/[0.04] p-2"
              title="Export readiness JSON"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/[0.06] p-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <p className="text-[13px] leading-relaxed text-zinc-400">{data.summary}</p>

          <div className="grid grid-cols-[auto_1fr] gap-4 rounded-[20px] border border-white/[0.06] bg-white/[0.03] p-4">
            <div className="flex flex-col items-center">
              <Circle pct={data.overall} size={110} stroke={10} color={data.color} />
              <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Overall ready
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {data.circles.slice(1).map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-white/[0.06] bg-[#0B1020] p-2 text-center"
                >
                  <div className="grid place-items-center">
                    <Circle pct={c.pct} size={48} stroke={5} color={data.color} />
                  </div>
                  <div className="mt-1 text-[11px] font-semibold">{c.label}</div>
                  <div className="text-[10px] text-zinc-500">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {(billing || data.liveUrl) && (
            <div className="flex flex-wrap gap-2">
              {billing ? (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px]">
                  Pipeline · {billing}
                </span>
              ) : null}
              {data.liveUrl ? (
                <a
                  href={data.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-[#0EA5FF] px-3 py-1.5 text-[11px] font-semibold text-black"
                >
                  Open live readiness <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          )}

          {data.liveApi ? (
            <div className="rounded-[16px] border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  Live /api/readiness
                </div>
                <span className="text-[10px] text-zinc-500">
                  {live?.checkedAt ? new Date(live.checkedAt).toLocaleTimeString() : '…'}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    ['openai', live?.openai],
                    ['elevenlabs', live?.elevenlabs],
                    ['twilio', live?.twilio],
                    ['supabase', live?.supabase],
                    ['stripe', live?.stripe],
                    ['coqui', live?.coqui],
                    ['africas_talking', live?.africas_talking],
                    ['voicePass', live?.voicePass ? 'ok' : live ? 'missing' : undefined],
                  ] as [string, string | undefined][]
                ).map(([k, v]) => {
                  const ok = v === 'ok' || v === 'test' || v === 'live';
                  return (
                    <div
                      key={k}
                      className={`rounded-xl border px-2.5 py-2 ${
                        ok
                          ? 'border-[#84FF3D]/30 bg-[#84FF3D]/10'
                          : 'border-amber-400/30 bg-amber-400/10'
                      }`}
                    >
                      <div className="text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                        {k}
                      </div>
                      <div
                        className={`text-[12px] font-bold ${ok ? 'text-[#84FF3D]' : 'text-amber-300'}`}
                      >
                        {v || '…'}
                      </div>
                    </div>
                  );
                })}
              </div>
              {live?.hint ? (
                <p className="mt-3 text-[11px] text-amber-300">{live.hint}</p>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-[16px] border border-white/[0.06] bg-white/[0.03] p-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              What&apos;s left · Priority
            </div>
            <div className="mt-3 space-y-2">
              {data.leftNow.map((item) => (
                <div
                  key={item.pri}
                  className="flex gap-3 rounded-xl border border-white/[0.06] bg-[#0B1020] p-3"
                >
                  <div
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-black text-black"
                    style={{
                      background: `linear-gradient(135deg,#00E5FF,${data.color},#84FF3D)`,
                    }}
                  >
                    {item.pri}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold">{item.title}</div>
                    <div className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="sora text-[15px] font-semibold">Production tree · Expandable</h4>
            <div className="mt-3 space-y-2">
              {data.phases.map((phase) => {
                const open = !!expanded[phase.title];
                return (
                  <div
                    key={phase.title}
                    className="overflow-hidden rounded-[16px] border border-white/[0.06] bg-white/[0.02]"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((e) => ({ ...e, [phase.title]: !open }))
                      }
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03]"
                    >
                      <div
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-[11px] font-bold"
                        style={{ color: data.color }}
                      >
                        {phase.pct}%
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold">{phase.title}</div>
                        <div className="text-[10px] text-zinc-500">
                          {phase.items.filter((i) => i.status === 'DONE').length} DONE ·{' '}
                          {phase.items.filter((i) => i.status === 'WIP').length} WIP ·{' '}
                          {phase.items.filter((i) => i.status === 'TODO').length} TODO
                        </div>
                      </div>
                      <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-white/10 sm:block">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${phase.pct}%`,
                            background: `linear-gradient(90deg,#00E5FF,${data.color})`,
                          }}
                        />
                      </div>
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full border border-white/10 text-[12px] transition ${open ? 'rotate-180' : ''}`}
                      >
                        ⌄
                      </span>
                    </button>
                    {open ? (
                      <div className="space-y-2 border-t border-white/[0.06] bg-[#0B1020]/80 p-3">
                        {phase.items.map((it) => (
                          <div
                            key={it.id}
                            className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#121A2E] p-3"
                          >
                            <Circle pct={it.pct} size={40} stroke={4} color={data.color} />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[12px] font-semibold">{it.label}</span>
                                <Badge status={it.status} />
                              </div>
                              {it.desc ? (
                                <div className="mt-1 text-[11px] text-zinc-500">{it.desc}</div>
                              ) : null}
                              {it.left ? (
                                <div className="mt-1 text-[11px] text-amber-300">Left: {it.left}</div>
                              ) : null}
                              {it.href ? (
                                <a
                                  href={it.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#0EA5FF]"
                                >
                                  Open <ArrowUpRight className="h-3 w-3" />
                                </a>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

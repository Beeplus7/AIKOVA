import React, { useEffect, useMemo, useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../lib/auth/AuthProvider';
import { crmAction } from '../lib/crmApi';
import {
  activeQuestions,
  buildBlueprint,
  firstNameFrom,
  type CompanionAnswerMap,
  type ProjectBlueprint,
} from './projectCompanion';

const ONBOARD_KEY = 'aikova_user_onboarding_v1';

async function api(action: string, args: Record<string, unknown>) {
  const data = await crmAction<any>(action, args);
  if (Array.isArray(data)) return { records: data };
  return data ?? { records: [] };
}

async function mirrorRequestToAdmin(req: any, clientLabel: string) {
  try {
    await crmAction('records.create', {
      collection: 'project_requests',
      value: req,
      idempotency_key: `project_requests-${req.id}`,
    });
    await crmAction('records.create', {
      collection: 'leads',
      value: {
        companyName: req.company || clientLabel,
        address: '',
        postcode: '',
        postcodeArea: 'OL',
        phone: '',
        motClasses: req.type,
        companiesHouseStatus: 'Active',
        score: req.assessment?.jobScore || 80,
        aiIcebreaker: `NEW Project Request (Pending): ${req.title}`,
        status: 'New',
        source: `AI onboarding · ${req.id}`,
        requestId: req.id,
        requestStatus: 'Pending',
      },
      idempotency_key: `admin-lead-${req.id}`,
    });
    await crmAction('records.create', {
      collection: 'engagements',
      value: {
        leadId: req.id,
        leadName: clientLabel,
        date: new Date().toISOString().slice(0, 10),
        type: 'AVA Chat',
        duration: `${req.transcript?.length || 0} Qs`,
        notes: `AI onboarding complete. Job: ${req.jobPrescription}`,
        outcome: 'Pending admin accept',
        evidenceFile: `onboarding_${req.id}.json`,
        govStandard: 'Discovery',
      },
      idempotency_key: `admin-eng-${req.id}`,
    });
  } catch (e) {
    console.warn('admin mirror failed', e);
  }
}

function markOnboarded(userId: string, requestId: string) {
  try {
    localStorage.setItem(
      `${ONBOARD_KEY}:${userId}`,
      JSON.stringify({ done: true, requestId, at: new Date().toISOString() }),
    );
  } catch {}
}

export function hasCompletedOnboarding(userId?: string | null): boolean {
  if (!userId || typeof localStorage === 'undefined') return false;
  try {
    const raw = localStorage.getItem(`${ONBOARD_KEY}:${userId}`);
    if (!raw) return false;
    return Boolean(JSON.parse(raw)?.done);
  } catch {
    return false;
  }
}

type Phase = 'intro' | 'qa' | 'review' | 'done';

/**
 * Full-page AI onboarding for Users entrance — Visaguide AssessmentOS style.
 * Conversational Q&A → Pending Project Request → Welcome dashboard.
 */
export default function AiUserOnboarding() {
  const { user, loading, configured, signOut } = useAuth();
  const clientLabel =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name ||
    user?.email?.split('@')[0] ||
    'Client';
  const clientEmail = user?.email || '';
  const firstName = firstNameFrom(clientLabel, clientEmail);

  const [phase, setPhase] = useState<Phase>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CompanionAnswerMap>({});
  const [draft, setDraft] = useState('');
  const [multi, setMulti] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ProjectBlueprint | null>(null);
  const [filedId, setFiledId] = useState<string | null>(null);

  const questions = useMemo(() => activeQuestions(answers), [answers]);
  const current = questions[step];
  const progress =
    phase === 'review' || phase === 'done'
      ? 100
      : phase === 'intro'
        ? 0
        : questions.length
          ? Math.round((step / questions.length) * 100)
          : 0;

  useEffect(() => {
    if (!loading && (!configured || !user)) {
      router.replace('/os/login');
    }
  }, [loading, configured, user]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!document.querySelector('script[data-aikova-crm-tw]')) {
      const s = document.createElement('script');
      s.src = 'https://cdn.tailwindcss.com';
      s.dataset.aikovaCrmTw = '1';
      document.head.appendChild(s);
    }
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = 'auto';
    body.style.background = '#05070D';
    return () => {
      body.style.overflow = prev;
    };
  }, []);

  const commitAnswer = (value: string | string[]) => {
    if (!current) return;
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    setDraft('');
    setMulti([]);
    const qs = activeQuestions(next);
    if (step + 1 >= qs.length) {
      setReview(buildBlueprint(next, clientLabel));
      setPhase('review');
    } else {
      setStep(step + 1);
    }
  };

  const onNext = () => {
    if (!current) return;
    if (current.kind === 'multi') {
      if (current.required && multi.length === 0) {
        setError('Pick at least one');
        return;
      }
      setError(null);
      commitAnswer(multi);
      return;
    }
    const value = draft.trim();
    if (current.kind === 'choice' && !value) {
      setError('Choose one option');
      return;
    }
    if (current.required !== false && current.kind !== 'choice' && !value) {
      setError('Please answer to continue');
      return;
    }
    setError(null);
    commitAnswer(value);
  };

  const onSubmit = async () => {
    if (!review || !user) return;
    setBusy(true);
    setError(null);
    const id = `PR-${Math.floor(1000 + Math.random() * 8999)}`;
    const transcript = questions.map((q) => ({ q: q.prompt, a: answers[q.id] }));
    const payload = {
      id,
      title: review.title,
      type: review.type,
      description: review.description,
      budget: review.budget,
      timeline: review.timeline,
      compliance: review.compliance,
      status: 'Pending' as const,
      created: new Date().toISOString(),
      company: review.company,
      client: clientLabel,
      clientEmail,
      jobPrescription: review.jobPrescription,
      problem: review.problem,
      users: review.users,
      workflows: review.workflows,
      integrations: review.integrations,
      successMetric: review.successMetric,
      notes: review.notes,
      assessment: review.assessment,
      transcript,
      source: 'AI User Onboarding',
    };
    try {
      await api('records.create', {
        collection: 'user_requests',
        value: payload,
        idempotency_key: `user_requests-${id}`,
      });
      await api('records.create', {
        collection: 'user_onboarding',
        value: {
          userId: user.id,
          email: clientEmail,
          firstName,
          requestId: id,
          completedAt: new Date().toISOString(),
          blueprint: review,
        },
        idempotency_key: `user_onboarding-${user.id}`,
      });
      await mirrorRequestToAdmin(payload, clientLabel);
    } catch (e) {
      console.warn(e);
      setError(e instanceof Error ? e.message : 'Saved — CRM sync may retry');
    }
    markOnboarded(user.id, id);
    setFiledId(id);
    setPhase('done');
    setBusy(false);
  };

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#05070D] text-zinc-400">
        Preparing AVA onboarding…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070D] text-[#E6EAF2]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: Inter, system-ui, sans-serif; }
        .font-display { font-family: Sora, system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .glass {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070D]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5FF] text-[11px] font-bold text-black">
              AK
            </div>
            <div>
              <div className="font-display text-[14px] font-semibold">AiKOVA</div>
              <div className="font-mono text-[10px] tracking-widest text-[#0EA5FF]">
                AI ONBOARDING
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/os/portal"
              className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/60 no-underline"
            >
              Portal
            </Link>
            <button
              type="button"
              onClick={() => signOut().then(() => router.replace('/os/login'))}
              className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/60"
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0EA5FF] to-[#84FF3D] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {phase === 'intro' && (
          <div className="space-y-6 animate-in">
            <div className="glass rounded-[24px] p-6 md:p-8">
              <div className="font-mono text-[11px] tracking-widest text-[#84FF3D]">
                AVA · USERS ENTRANCE
              </div>
              <h1 className="font-display mt-3 text-[32px] font-bold leading-[1.05] tracking-tight md:text-[40px]">
                Welcome {firstName}!
              </h1>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/60">
                I&apos;m AVA — your AiKOVA companion. Like Visaguide AssessmentOS, I&apos;ll ask one
                question at a time to prescribe the <strong className="text-white">job</strong> your
                SaaS must do. When we finish, a <span className="text-[#FFD700]">Pending</span>{' '}
                Project Request lands in Admin CRM until Captain accepts.
              </p>
              <ul className="mt-5 space-y-2 text-[13px] text-white/55">
                {[
                  'Job prescription & problem framing',
                  'V1 workflows, integrations, compliance',
                  'Budget, timeline & 90-day success metric',
                  'Full blueprint → Pending in CRM',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0EA5FF]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPhase('qa')}
                  className="rounded-full bg-[#0EA5FF] px-6 py-3 text-[14px] font-semibold text-black"
                >
                  Start AI onboarding →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (user) markOnboarded(user.id, 'skipped');
                    router.replace('/os/crm?role=user');
                  }}
                  className="rounded-full border border-white/10 px-5 py-3 text-[13px] text-white/70"
                >
                  Skip to dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === 'qa' && current && (
          <div className="space-y-4">
            <div className="font-mono text-[10px] text-white/40">
              Question {step + 1} of {questions.length}
            </div>
            <div className="rounded-2xl border border-[#0EA5FF]/25 bg-[#0EA5FF]/10 px-4 py-4 text-[15px] leading-relaxed">
              <span className="mr-2 font-mono text-[10px] text-[#0EA5FF]">AVA</span>
              {current.prompt}
            </div>
            {current.hint ? (
              <p className="text-[12px] text-white/45">{current.hint}</p>
            ) : null}

            {current.kind === 'choice' || current.kind === 'multi' ? (
              <div className="flex flex-wrap gap-2">
                {(current.options || []).map((opt) => {
                  const selected =
                    current.kind === 'multi' ? multi.includes(opt) : draft === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        if (current.kind === 'multi') {
                          setMulti((prev) =>
                            prev.includes(opt)
                              ? prev.filter((x) => x !== opt)
                              : [...prev, opt],
                          );
                        } else setDraft(opt);
                      }}
                      className={`rounded-full border px-4 py-2.5 text-[13px] font-medium transition ${
                        selected
                          ? 'border-[#84FF3D]/40 bg-[#84FF3D]/15 text-[#84FF3D]'
                          : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={current.kind === 'long' ? 5 : 2}
                autoFocus
                placeholder="Type your answer…"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] outline-none focus:border-[#0EA5FF]/40"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && current.kind === 'text') {
                    e.preventDefault();
                    onNext();
                  }
                }}
              />
            )}

            {error ? <p className="text-[12px] text-[#FF4D6D]">{error}</p> : null}

            <div className="flex justify-between pt-2">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => {
                  setError(null);
                  setStep((s) => Math.max(0, s - 1));
                }}
                className="rounded-full border border-white/10 px-4 py-2.5 text-[13px] disabled:opacity-30"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onNext}
                className="rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black"
              >
                {step + 1 >= questions.length ? 'Build blueprint →' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {phase === 'review' && review && (
          <div className="space-y-4">
            <div className="glass rounded-[20px] p-5">
              <div className="font-mono text-[10px] tracking-widest text-[#84FF3D]">
                FULL PROJECT PICTURE · JOB SCORE {review.assessment.jobScore}/100
              </div>
              <h2 className="font-display mt-2 text-[20px] font-semibold">{review.title}</h2>
              <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-[12px] text-white/65">
                {review.description}
              </pre>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[12px]">
                <div className="font-mono text-[10px] text-white/40">ARCHITECTURE</div>
                <p className="mt-1 text-white/80">{review.assessment.architecture}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[12px]">
                <div className="font-mono text-[10px] text-white/40">ESTIMATE · TEAM</div>
                <p className="mt-1 font-semibold text-[#0EA5FF]">{review.assessment.estimate}</p>
                <p className="mt-1 text-white/60">{review.assessment.team}</p>
                <p className="mt-1 text-white/50">{review.assessment.stack.join(' · ')}</p>
              </div>
            </div>
            <p className="text-[12px] text-white/50">
              Filing creates a <span className="font-semibold text-[#FFD700]">Pending</span> Project
              Request in Admin CRM. It stays pending until Captain accepts.
            </p>
            {error ? <p className="text-[12px] text-amber-400">{error}</p> : null}
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setPhase('qa');
                  setStep(Math.max(0, questions.length - 1));
                }}
                className="rounded-full border border-white/10 px-4 py-2.5 text-[13px]"
              >
                Edit answers
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onSubmit}
                className="rounded-full bg-[#84FF3D] px-5 py-2.5 text-[13px] font-semibold text-black disabled:opacity-50"
              >
                {busy ? 'Filing…' : 'Submit Pending request →'}
              </button>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="glass rounded-[24px] p-6 text-center md:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#84FF3D] text-2xl text-black">
              ✓
            </div>
            <h2 className="font-display mt-4 text-[28px] font-bold">Welcome {firstName}!</h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] text-white/60">
              Your project request{' '}
              <span className="font-mono text-[#FFD700]">{filedId}</span> is{' '}
              <strong className="text-[#FFD700]">Pending</strong> until Captain accepts. Your
              dashboard is ready.
            </p>
            <button
              type="button"
              onClick={() => router.replace('/os/crm?role=user')}
              className="mt-6 rounded-full bg-[#0EA5FF] px-6 py-3 text-[14px] font-semibold text-black"
            >
              Open my dashboard →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

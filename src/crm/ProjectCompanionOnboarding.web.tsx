import React, { useMemo, useState } from 'react';
import {
  activeQuestions,
  buildBlueprint,
  type CompanionAnswerMap,
  type ProjectBlueprint,
} from './projectCompanion';
import { crmAction } from '../lib/crmApi';

type Props = {
  clientLabel: string;
  clientEmail?: string;
  firstName: string;
  onSubmitted: (request: {
    id: string;
    title: string;
    status: string;
    blueprint: ProjectBlueprint;
  }) => void;
  onCancel?: () => void;
};

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
        source: `Users companion · ${req.id}`,
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
        notes: `AVA Project Companion completed. Job: ${req.jobPrescription}`,
        outcome: 'Pending admin accept',
        evidenceFile: `companion_${req.id}.json`,
        govStandard: 'Discovery',
      },
      idempotency_key: `admin-eng-${req.id}`,
    });
  } catch (e) {
    console.warn('admin mirror failed', e);
  }
}

export default function ProjectCompanionOnboarding({
  clientLabel,
  clientEmail,
  firstName,
  onSubmitted,
  onCancel,
}: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CompanionAnswerMap>({});
  const [draft, setDraft] = useState('');
  const [multi, setMulti] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ProjectBlueprint | null>(null);

  const questions = useMemo(() => activeQuestions(answers), [answers]);
  const current = questions[step];
  const progress = questions.length ? Math.round((step / questions.length) * 100) : 0;

  const commitAnswer = (value: string | string[]) => {
    if (!current) return;
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    setDraft('');
    setMulti([]);
    const qs = activeQuestions(next);
    if (step + 1 >= qs.length) {
      setReview(buildBlueprint(next, clientLabel));
    } else {
      setStep(step + 1);
    }
  };

  const onNext = () => {
    if (!current) return;
    if (current.kind === 'multi') {
      if (current.required && multi.length === 0) {
        setError('Pick at least one option');
        return;
      }
      setError(null);
      commitAnswer(multi);
      return;
    }
    const value = draft.trim();
    if (current.required !== false && !value && current.kind !== 'choice') {
      setError('Please answer to continue');
      return;
    }
    if (current.kind === 'choice' && !value) {
      setError('Choose one option');
      return;
    }
    setError(null);
    commitAnswer(value);
  };

  const onBack = () => {
    setError(null);
    setReview(null);
    if (step <= 0) return;
    setStep(step - 1);
    const prev = questions[step - 1];
    const existing = answers[prev?.id];
    if (Array.isArray(existing)) setMulti(existing);
    else setDraft(String(existing || ''));
  };

  const onSubmit = async () => {
    if (!review) return;
    setBusy(true);
    setError(null);
    const id = `PR-${Math.floor(1000 + Math.random() * 8999)}`;
    const transcript = questions.map((q) => ({
      q: q.prompt,
      a: answers[q.id],
    }));
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
      clientEmail: clientEmail || '',
      jobPrescription: review.jobPrescription,
      problem: review.problem,
      users: review.users,
      workflows: review.workflows,
      integrations: review.integrations,
      successMetric: review.successMetric,
      notes: review.notes,
      assessment: review.assessment,
      transcript,
      source: 'Project Assessment Request',
    };
    try {
      await api('records.create', {
        collection: 'user_requests',
        value: payload,
        idempotency_key: `user_requests-${id}`,
      });
      await mirrorRequestToAdmin(payload, clientLabel);
      onSubmitted({
        id,
        title: payload.title,
        status: 'Pending',
        blueprint: review,
      });
    } catch (e) {
      // Still land locally so UX continues
      onSubmitted({
        id,
        title: payload.title,
        status: 'Pending',
        blueprint: review,
      });
      setError(e instanceof Error ? e.message : 'Saved locally — CRM sync pending');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass rounded-[20px] overflow-hidden border border-white/10">
      <div className="border-b border-white/[0.08] bg-gradient-to-r from-[#0EA5FF]/15 to-[#84FF3D]/10 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#0EA5FF]">
              SCOPE MY PROJECT · PROJECT ASSESSMENT REQUEST
            </div>
            <h2 className="font-display mt-1 text-[18px] font-semibold">
              Welcome {firstName} — let&apos;s scope your build
            </h2>
            <p className="mt-1 text-[12px] text-white/55 max-w-[560px]">
              AVA asks one question at a time. When you finish, we file a{' '}
              <strong className="text-white">Pending</strong> Project Assessment Request for Captain.
            </p>
          </div>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px]"
            >
              Close
            </button>
          ) : null}
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0EA5FF] to-[#84FF3D] transition-all"
            style={{ width: `${review ? 100 : progress}%` }}
          />
        </div>
        <div className="mt-2 text-[10px] font-mono text-white/40">
          {review ? 'Review blueprint' : `Question ${Math.min(step + 1, questions.length)} / ${questions.length}`}
        </div>
      </div>

      <div className="p-5 md:p-6">
        {!review && current ? (
          <div className="animate-in space-y-4">
            <div className="rounded-2xl border border-[#0EA5FF]/20 bg-[#0EA5FF]/10 px-4 py-3 text-[13px] leading-relaxed">
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
                            prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
                          );
                        } else {
                          setDraft(opt);
                        }
                      }}
                      className={`rounded-full border px-3.5 py-2 text-[12px] font-medium transition ${
                        selected
                          ? 'border-[#84FF3D]/40 bg-[#84FF3D]/15 text-[#84FF3D]'
                          : 'border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]'
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
                rows={current.kind === 'long' ? 4 : 2}
                placeholder="Type your answer…"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] outline-none placeholder:text-white/30 focus:border-[#0EA5FF]/40"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && current.kind === 'text') {
                    e.preventDefault();
                    onNext();
                  }
                }}
              />
            )}

            {error ? <p className="text-[12px] text-[#FF4D6D]">{error}</p> : null}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                disabled={step === 0}
                className="rounded-full border border-white/10 px-4 py-2 text-[12px] disabled:opacity-30"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onNext}
                className="rounded-full bg-[#0EA5FF] px-5 py-2.5 text-[13px] font-semibold text-black"
              >
                {step + 1 >= questions.length ? 'Build blueprint →' : 'Continue'}
              </button>
            </div>
          </div>
        ) : null}

        {review ? (
          <div className="animate-in space-y-4">
            <div className="rounded-2xl border border-[#84FF3D]/25 bg-[#84FF3D]/10 px-4 py-3">
              <div className="text-[10px] font-mono tracking-widest text-[#84FF3D]">
                FULL PROJECT PICTURE · JOB SCORE {review.assessment.jobScore}/100
              </div>
              <h3 className="font-display mt-1 text-[16px] font-semibold">{review.title}</h3>
              <p className="mt-2 whitespace-pre-wrap text-[12px] text-white/65">{review.description}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[12px]">
                <div className="text-[10px] font-mono text-white/40">ARCHITECTURE</div>
                <div className="mt-1 text-white/80">{review.assessment.architecture}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[12px]">
                <div className="text-[10px] font-mono text-white/40">STACK · TEAM · ESTIMATE</div>
                <div className="mt-1 text-white/80">{review.assessment.stack.join(' · ')}</div>
                <div className="mt-1 text-white/60">{review.assessment.team}</div>
                <div className="mt-1 font-semibold text-[#0EA5FF]">{review.assessment.estimate}</div>
              </div>
            </div>

            <p className="text-[12px] text-white/50">
              Submitting files this as <span className="text-[#FFD700] font-semibold">Pending</span> in
              Admin CRM. It stays pending until Captain accepts.
            </p>

            {error ? <p className="text-[12px] text-amber-400">{error}</p> : null}

            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setReview(null);
                  setStep(Math.max(0, questions.length - 1));
                }}
                className="rounded-full border border-white/10 px-4 py-2.5 text-[12px]"
              >
                Edit answers
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onSubmit}
                className="rounded-full bg-[#84FF3D] px-5 py-2.5 text-[13px] font-semibold text-black disabled:opacity-50"
              >
                {busy ? 'Filing…' : 'Submit Project Assessment →'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * MCL (Marketing Capture Lead) bot — floating multi-step widget for anonymous
 * marketing visitors. Rule-based (no live LLM). Posts to /api/mcl-capture-lead.
 */
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { usePathname } from 'expo-router';
import { colors, fonts } from '../theme/colors';

type Step = 'interest' | 'urgency' | 'contact' | 'submitting' | 'done' | 'error';

const INTERESTS: { id: string; label: string }[] = [
  { id: 'cloud', label: 'Cloud / AWS / Azure / GCP' },
  { id: 'claude', label: 'Claude / Anthropic agents' },
  { id: 'openai', label: 'OpenAI / GPT agents' },
  { id: 'ai-agents', label: 'Custom AI agents & RAG' },
  { id: 'receptionist', label: 'AI Receptionist (voice)' },
  { id: 'payments', label: 'Payment integration (Stripe / PayPal)' },
  { id: 'ecommerce', label: 'E-commerce / checkout OS' },
  { id: 'fintech', label: 'FinTech / banking rails' },
  { id: 'saas', label: 'SaaS product build' },
  { id: 'mobile', label: 'Mobile app (iOS / Android)' },
  { id: 'webapp', label: 'Web app / dashboard' },
  { id: 'api', label: 'API / backend / microservices' },
  { id: 'devops', label: 'DevOps / CI-CD / infra' },
  { id: 'industrial', label: 'Industrial / Garage OS' },
  { id: 'ai-production', label: 'AI Production (ReelStorm)' },
  { id: 'myface', label: 'MyFace Profile' },
  { id: 'automation', label: 'Workflow automation' },
  { id: 'data', label: 'Data pipelines / analytics' },
  { id: 'security', label: 'Security / compliance hardening' },
  { id: 'integration', label: 'Third-party system integration' },
  { id: 'mvp', label: 'MVP / startup build' },
  { id: 'other', label: 'Something else' },
];

const URGENCY: { id: string; label: string }[] = [
  { id: 'p1', label: 'P1 — critical / this week' },
  { id: 'p2', label: 'P2 — this month' },
  { id: 'explore', label: 'Exploring options' },
];

export function MCLBotWidget() {
  const pathname = usePathname() || '/';
  const hide = useMemo(
    () => pathname.startsWith('/os') || pathname.startsWith('/os/'),
    [pathname],
  );

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('interest');
  const [interest, setInterest] = useState('');
  const [urgency, setUrgency] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [errorMsg, setErrorMsg] = useState('');

  if (hide) return null;

  const reset = () => {
    setStep('interest');
    setInterest('');
    setUrgency('');
    setName('');
    setEmail('');
    setCompany('');
    setWebsite('');
    setErrorMsg('');
  };

  const submit = async () => {
    setStep('submitting');
    try {
      const res = await fetch('/api/mcl-capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          interest,
          urgency,
          source_page: pathname,
          website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStep('done');
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStep('error');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStep('error');
    }
  };

  return (
    <View pointerEvents="box-none" style={styles.host}>
      {!open ? (
        <Pressable
          accessibilityLabel="Chat with AiKOVA — capture lead"
          onPress={() => setOpen(true)}
          style={styles.fab}
        >
          <Text style={styles.fabGlyph}>◈</Text>
          <Text style={styles.fabLabel}>Talk to AiKOVA</Text>
        </Pressable>
      ) : (
        <View style={styles.panel}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>What do you need built?</Text>
              <Text style={styles.headerSub}>MCL Bot · Oldham OL8 → Global</Text>
            </View>
            <Pressable
              onPress={() => {
                setOpen(false);
                reset();
              }}
              style={styles.close}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.body}>
            {/* honeypot */}
            <TextInput
              value={website}
              onChangeText={setWebsite}
              style={styles.honeypot}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />

            {step === 'interest' ? (
              <View style={styles.stack}>
                <Text style={styles.prompt}>Pick the closest engineering line</Text>
                <ScrollView
                  style={styles.interestScroll}
                  contentContainerStyle={styles.interestScrollContent}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                >
                  {INTERESTS.map((item) => (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        setInterest(item.id);
                        setStep('urgency');
                      }}
                      style={styles.choice}
                    >
                      <Text style={styles.choiceText}>{item.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {step === 'urgency' ? (
              <View style={styles.stack}>
                <Text style={styles.prompt}>How urgent is this?</Text>
                {URGENCY.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setUrgency(item.id);
                      setStep('contact');
                    }}
                    style={styles.choice}
                  >
                    <Text style={styles.choiceText}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {step === 'contact' ? (
              <View style={styles.stack}>
                <Text style={styles.prompt}>Last step — how can we reach you?</Text>
                <TextInput
                  placeholder="Your name"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
                <TextInput
                  placeholder="you@company.com"
                  placeholderTextColor={colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Company (optional)"
                  placeholderTextColor={colors.muted}
                  value={company}
                  onChangeText={setCompany}
                  style={styles.input}
                />
                <Pressable
                  onPress={submit}
                  disabled={!name.trim() || !email.trim()}
                  style={[
                    styles.send,
                    (!name.trim() || !email.trim()) && styles.sendDisabled,
                  ]}
                >
                  <Text style={styles.sendText}>Send →</Text>
                </Pressable>
                <Text style={styles.legal}>
                  By submitting, you agree to be contacted about your enquiry.
                </Text>
              </View>
            ) : null}

            {step === 'submitting' ? (
              <View style={styles.center}>
                <ActivityIndicator color={colors.blue} />
                <Text style={styles.prompt}>Sending…</Text>
              </View>
            ) : null}

            {step === 'done' ? (
              <View style={styles.center}>
                <Text style={styles.doneGlyph}>✓</Text>
                <Text style={styles.doneTitle}>Thanks — we&apos;ll be in touch.</Text>
                <Text style={styles.prompt}>Check your inbox for a confirmation.</Text>
              </View>
            ) : null}

            {step === 'error' ? (
              <View style={styles.center}>
                <Text style={styles.errorText}>{errorMsg}</Text>
                <Pressable onPress={() => setStep('contact')}>
                  <Text style={styles.retry}>Try again</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 9999,
    elevation: 9999,
    maxWidth: '100%',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: colors.blue,
    borderWidth: 1,
    borderColor: 'rgba(14,165,255,0.5)',
    shadowColor: '#0EA5FF',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  fabGlyph: {
    color: '#05070D',
    fontFamily: fonts.mono,
    fontSize: 16,
    fontWeight: '700',
  },
  fabLabel: {
    color: '#05070D',
    fontFamily: fonts.headingSemi,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  panel: {
    width: 360,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(8,11,20,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  headerTitle: {
    color: colors.text,
    fontFamily: fonts.headingSemi,
    fontSize: 14,
  },
  headerSub: {
    marginTop: 2,
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  closeText: { color: colors.muted, fontSize: 14 },
  body: { padding: 16, maxHeight: 420 },
  honeypot: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  stack: { gap: 8 },
  interestScroll: { maxHeight: 340 },
  interestScrollContent: { gap: 8, paddingBottom: 4 },
  prompt: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    marginBottom: 4,
  },
  choice: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  choiceText: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: fonts.body,
    fontSize: 13,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  send: {
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: colors.green,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendDisabled: { opacity: 0.4 },
  sendText: {
    color: '#05070D',
    fontFamily: fonts.headingSemi,
    fontSize: 13,
  },
  legal: {
    color: 'rgba(255,255,255,0.3)',
    fontFamily: fonts.body,
    fontSize: 10,
    marginTop: 4,
  },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 28, gap: 10 },
  doneGlyph: { color: colors.green, fontSize: 28, fontWeight: '700' },
  doneTitle: {
    color: colors.text,
    fontFamily: fonts.headingSemi,
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: { color: '#F87171', fontFamily: fonts.body, fontSize: 13, textAlign: 'center' },
  retry: { color: colors.blue, fontFamily: fonts.body, fontSize: 12, marginTop: 8 },
});

export default MCLBotWidget;

/**
 * AiKOVA Brand Artefact System v1.0 — canonical tokens.
 * Spec: docs/BRAND.md · Source: design/Aikova-Brand-Artefact-System.html
 * Deep void is the vault. Neon green is system-live. Blue is the signal.
 */
export const colors = {
  bg: '#05070D',
  bgSoft: '#0B1020',
  bgLift: '#080A12',
  surface: 'rgba(255, 255, 255, 0.05)',
  surface2: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.1)',
  borderStrong: 'rgba(255, 255, 255, 0.15)',

  text: '#FFFFFF',
  textSoft: '#F8FAFC',
  muted: '#8B9BB4',
  textMuted: '#94A3B8',
  textDim: '#64748B',

  blue: '#0EA5FF',
  deep: '#2563EB',
  green: '#84FF3D',
  darkGreen: '#00C853',

  // Semantic aliases
  background: '#05070D',
  brand: '#0EA5FF',
  brandDeep: '#2563EB',
  accent: '#84FF3D',
  accentSecure: '#00C853',
  danger: '#F07178',
  waiting: '#0EA5FF',
  ready: '#84FF3D',
} as const;

export const gradients = {
  signal: ['#0EA5FF', '#2563EB'] as const,
  live: ['#84FF3D', '#00C853'] as const,
  vault: ['#0EA5FF', '#00C853'] as const,
  depth: ['#2563EB', '#0EA5FF'] as const,
} as const;

export const brandCopy = {
  primary: 'Engineered Intelligence. Delivered.',
  secondary: 'Where AI Becomes Infrastructure',
  tertiary: 'We Engineer What Others Imagine',
  vault: 'The Engineering Vault for AI Systems',
  compliance: 'ISO 27001 • PCI DSS • DOS7 LOT 1',
  mark: {
    ai: 'AI — The Intelligence',
    kova: 'KOVA — The Vault',
  },
  voice: [
    {
      title: 'Small Senior Team',
      body: 'No juniors. Founders + principal engineers only. You get the A-team, not the bench.',
    },
    {
      title: 'Industrial-Grade',
      body: 'MES, WMS, predictive maintenance, PCI DSS vaults. We ship systems that run factories, not demos.',
    },
    {
      title: 'Boutique but Enterprise',
      body: 'Artefact and operating system blueprint. Boutique senior team. Industrial-grade delivery.',
    },
    {
      title: 'The Vault Principle',
      body: 'KOVA = secure containment. Every integration wrapped in compliance: ISO 27001, Cyber Essentials, HIPAA-ready patterns.',
    },
  ],
} as const;

/** Expo font family names — UI renders before load; system default until ready. */
export const fonts = {
  display: 'Sora_700Bold',
  displaySemi: 'Sora_600SemiBold',
  displayExtra: 'Sora_800ExtraBold',
  displayLight: 'Sora_300Light',
  heading: 'SpaceGrotesk_700Bold',
  headingSemi: 'SpaceGrotesk_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_400Regular',
} as const;

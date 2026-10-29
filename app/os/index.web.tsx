import { OsShell } from '../../src/components/os/OsShell';

const css = `
.aikova-os-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}
.aikova-os-card {
  flex: 1 1 140px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  padding: 18px;
}
.aikova-os-card-label {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.8px;
  color: #8B9BB4;
  margin: 0 0 8px;
}
.aikova-os-card-value {
  font-family: Sora, system-ui, sans-serif;
  font-weight: 600;
  font-size: 28px;
  margin: 0;
}
`;

const metrics = [
  { label: 'API', value: 'LIVE' },
  { label: 'Auth', value: 'SUPABASE' },
  { label: 'CRM', value: '/os/crm' },
  { label: 'Domain', value: 'aikova.co.uk' },
];

export default function OsDashboard() {
  return (
    <OsShell
      activeHref="/os"
      title="Dashboard"
      subtitle="Backend is live on aikova.co.uk — Supabase Auth + CRM API."
    >
      <style>{css}</style>
      <div className="aikova-os-grid">
        {metrics.map((m) => (
          <div key={m.label} className="aikova-os-card">
            <p className="aikova-os-card-label">{m.label}</p>
            <p className="aikova-os-card-value">{m.value}</p>
          </div>
        ))}
      </div>
    </OsShell>
  );
}

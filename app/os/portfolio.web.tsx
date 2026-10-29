import { OsShell } from '../../src/components/os/OsShell';

const rows = [
  { client: 'Manufacturing QA', status: 'Live', value: 'Vision AI' },
  { client: 'Trade docs', status: 'Live', value: 'Orchestration' },
  { client: 'GovTech vault', status: 'Build', value: 'Doc intel' },
  { client: 'MediSync', status: 'Live', value: 'Interop' },
];

const css = `
.aikova-port-table {
  margin-top:12px; border-radius:14px; border:1px solid rgba(255,255,255,0.1);
  overflow:hidden; background:rgba(255,255,255,0.05);
}
.aikova-port-row {
  display:grid; grid-template-columns:2fr 1fr 1fr; gap:12px;
  padding:14px 16px; border-top:1px solid rgba(255,255,255,0.1);
}
.aikova-port-row.head { border-top:0; background:rgba(255,255,255,0.04); }
.aikova-port-row.head span { font-family:ui-monospace,monospace; font-size:11px; color:#8B9BB4; }
.aikova-port-status { color:#84FF3D; }
.aikova-port-muted { color:#8B9BB4; }
`;

export default function OsPortfolioScreen() {
  return (
    <OsShell
      activeHref="/os/portfolio"
      title="Portfolio CRM"
      subtitle="Internal vault of client engagements and public case-study readiness."
    >
      <style>{css}</style>
      <div className="aikova-port-table">
        <div className="aikova-port-row head">
          <span>Client</span><span>Status</span><span>Focus</span>
        </div>
        {rows.map((row) => (
          <div key={row.client} className="aikova-port-row">
            <span>{row.client}</span>
            <span className="aikova-port-status">{row.status}</span>
            <span className="aikova-port-muted">{row.value}</span>
          </div>
        ))}
      </div>
    </OsShell>
  );
}

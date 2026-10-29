import { OsShell } from '../../src/components/os/OsShell';

const columns = [
  { title: 'Lead', items: ['Digital twin enquiry', 'DOS7 evidence request'] },
  { title: 'Discovery', items: ['48h architecture map'] },
  { title: 'Build', items: [] as string[] },
  { title: 'Delivered', items: ['MediSync clinical view'] },
];

const css = `
.aikova-pipe-board { display:flex; flex-wrap:wrap; gap:12px; margin-top:12px; }
.aikova-pipe-col {
  flex:1 1 160px; min-width:160px; border-radius:14px; border:1px solid rgba(255,255,255,0.1);
  background:rgba(255,255,255,0.05); padding:14px;
}
.aikova-pipe-title { font-family:ui-monospace,monospace; font-size:11px; color:#0EA5FF; margin:0 0 10px; }
.aikova-pipe-card {
  border-radius:10px; border:1px solid rgba(255,255,255,0.1); background:#05070D;
  padding:10px 12px; margin-bottom:8px; font-size:13px;
}
.aikova-pipe-empty { color:#64748B; font-size:12px; }
`;

export default function PipelineScreen() {
  return (
    <OsShell
      activeHref="/os/pipeline"
      title="Pipeline"
      subtitle="CRM lead tags feed portfolio case studies automatically."
    >
      <style>{css}</style>
      <div className="aikova-pipe-board">
        {columns.map((col) => (
          <div key={col.title} className="aikova-pipe-col">
            <p className="aikova-pipe-title">{col.title}</p>
            {col.items.length === 0 ? (
              <p className="aikova-pipe-empty">No cards</p>
            ) : (
              col.items.map((item) => (
                <div key={item} className="aikova-pipe-card">
                  {item}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </OsShell>
  );
}

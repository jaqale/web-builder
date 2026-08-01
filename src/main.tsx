import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Project = {
  id: string
  name: string
  purpose: string
  status: 'Entwurf' | 'In Arbeit'
  updatedAt: string
  brand: { name: string; primary: string; tone: string }
}

const initialProject: Project = {
  id: 'demo', name: 'Herbstkampagne 2026', purpose: 'Informations-Landingpage',
  status: 'In Arbeit', updatedAt: 'Heute, 10:42',
  brand: { name: 'Engelhard', primary: '#005F85', tone: 'Kompetent, nahbar, klar' }
}

function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem('atelier-projects')
    return stored ? JSON.parse(stored) : [initialProject]
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => localStorage.setItem('atelier-projects', JSON.stringify(projects)), [projects])
  const selected = projects.find((item) => item.id === selectedId)

  const createProject = (name: string, purpose: string) => {
    const project: Project = {
      id: crypto.randomUUID(), name, purpose, status: 'Entwurf', updatedAt: 'Gerade eben',
      brand: { name: 'Noch nicht gewählt', primary: '#005F85', tone: 'Noch nicht definiert' }
    }
    setProjects([project, ...projects])
    setSelectedId(project.id)
    setShowCreate(false)
  }

  return <main className="shell">
    <aside className="sidebar">
      <div className="mark"><span className="mark-dot">A</span><span>atelier</span></div>
      <div className="workspace"><span>ARBEITSBEREICH</span><strong>Engelhard · PoC</strong></div>
      <nav><a className="active">▦ &nbsp; Projekte</a><a>◈ &nbsp; Markenprofile</a><a>◷ &nbsp; Aktivitäten</a></nav>
      <div className="sidebar-bottom"><div className="avatar">AJ</div><div><strong>Alexander Jaquet</strong><small>Administrator</small></div></div>
    </aside>
    <section className="content">
      {selected ? <ProjectDetail project={selected} onBack={() => setSelectedId(null)} onUpdate={(brand) => setProjects(projects.map(p => p.id === selected.id ? { ...p, brand, updatedAt: 'Gerade eben' } : p))} /> : <Dashboard projects={projects} onCreate={() => setShowCreate(true)} onOpen={setSelectedId} />}
    </section>
    {showCreate && <CreateDialog onClose={() => setShowCreate(false)} onCreate={createProject} />}
  </main>
}

function Dashboard({ projects, onCreate, onOpen }: { projects: Project[]; onCreate: () => void; onOpen: (id: string) => void }) {
  return <><header><div><p className="eyebrow">WEBSITE STUDIO</p><h1>Deine Projekte</h1><p className="subline">Von der Idee über UX und Design bis zur Website.</p></div><button className="primary" onClick={onCreate}>+ Neues Projekt</button></header>
    <div className="progress-card"><div><span className="eyebrow">GEFÜHRTER PROZESS</span><h2>Eine gute Website entsteht in Etappen.</h2><p>Wir führen Teams zuerst durch Briefing und UX, dann durch das visuelle Design – und erstellen erst danach die Seite.</p></div><ol className="steps"><li><b>1</b> Briefing</li><li><b>2</b> UX</li><li><b>3</b> Design</li><li><b>4</b> Build</li></ol></div>
    <div className="section-title"><h2>Alle Projekte</h2><span>{projects.length} Projekte</span></div>
    <div className="grid">{projects.map(project => <button className="project-card" key={project.id} onClick={() => onOpen(project.id)}><div className="project-top"><span className={`badge ${project.status === 'In Arbeit' ? 'blue' : ''}`}>{project.status}</span><span>•••</span></div><div className="project-art"><span>{project.name.slice(0, 1)}</span></div><h3>{project.name}</h3><p>{project.purpose}</p><footer>Aktualisiert {project.updatedAt} <span>→</span></footer></button>)}</div>
  </>
}

function ProjectDetail({ project, onBack, onUpdate }: { project: Project; onBack: () => void; onUpdate: (brand: Project['brand']) => void }) {
  const [tab, setTab] = useState<'overview' | 'brand' | 'team'>('overview')
  const [brand, setBrand] = useState(project.brand)
  return <><header className="detail-header"><div><button className="back" onClick={onBack}>← Projekte</button><p className="eyebrow">PROJEKT</p><h1>{project.name}</h1></div><span className="badge blue">{project.status}</span></header>
    <div className="tabs"><button className={tab === 'overview' ? 'selected' : ''} onClick={() => setTab('overview')}>Übersicht</button><button className={tab === 'brand' ? 'selected' : ''} onClick={() => setTab('brand')}>Markenprofil</button><button className={tab === 'team' ? 'selected' : ''} onClick={() => setTab('team')}>Team & Rechte</button></div>
    {tab === 'overview' && <div className="detail-grid"><article className="panel span2"><p className="eyebrow">NÄCHSTER SCHRITT</p><h2>Briefing starten</h2><p>In Release R1 führt der Briefing-Assistent durch Zielgruppe, Ziel, Inhalte und Tonalität. Daraus entsteht ein freigabefähiges Website-Konzept.</p><button className="primary disabled">In R1 verfügbar</button></article><article className="panel"><p className="eyebrow">PROJEKTSTATUS</p><h2>R0 · Grundlage</h2><ul><li>✓ Projekt angelegt</li><li>✓ Markenprofil hinterlegt</li><li>○ Briefing</li><li>○ UX-Konzept</li><li>○ Design</li></ul></article></div>}
    {tab === 'brand' && <article className="panel form"><p className="eyebrow">MARKENPROFIL</p><h2>Gestalterischer Rahmen</h2><p>Dieses Profil wird später verbindlich für die Design- und Build-Phase genutzt.</p><label>Markenname<input value={brand.name} onChange={e => setBrand({ ...brand, name: e.target.value })} /></label><label>Primärfarbe<input value={brand.primary} onChange={e => setBrand({ ...brand, primary: e.target.value })} /></label><label>Markenton<input value={brand.tone} onChange={e => setBrand({ ...brand, tone: e.target.value })} /></label><div className="color-preview" style={{ background: brand.primary }}><span>{brand.name || 'Marke'}</span></div><button className="primary" onClick={() => onUpdate(brand)}>Änderungen speichern</button></article>}
    {tab === 'team' && <article className="panel"><p className="eyebrow">TEAM & RECHTE</p><h2>Rollenmodell für den PoC</h2><table><tbody><tr><td><strong>Administrator</strong><small>Projekte, Markenprofile, Veröffentlichung</small></td><td>Alexander Jaquet</td></tr><tr><td><strong>Editor</strong><small>Briefing, Inhalte und Reviews</small></td><td>Für R1 vorbereitet</td></tr><tr><td><strong>Reviewer</strong><small>Freigabe ohne Bearbeitungsrechte</small></td><td>Für R2 vorbereitet</td></tr></tbody></table></article>}
  </>
}

function CreateDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, purpose: string) => void }) {
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('Landingpage')
  return <div className="overlay"><form className="dialog" onSubmit={e => { e.preventDefault(); if (name.trim()) onCreate(name.trim(), purpose) }}><button type="button" className="close" onClick={onClose}>×</button><p className="eyebrow">NEUES PROJEKT</p><h2>Womit möchtest du starten?</h2><p>Lege das Projekt an. Im nächsten Release folgt das geführte Briefing.</p><label>Projektname<input placeholder="z. B. Produktkampagne 2026" value={name} onChange={e => setName(e.target.value)} autoFocus /></label><label>Seitentyp<select value={purpose} onChange={e => setPurpose(e.target.value)}><option>Landingpage</option><option>Informationsseite</option><option>Microsite</option></select></label><div className="dialog-actions"><button type="button" onClick={onClose}>Abbrechen</button><button className="primary" type="submit">Projekt anlegen</button></div></form></div>
}

createRoot(document.getElementById('root')!).render(<App />)

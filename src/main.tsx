import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Stage = 'Briefing' | 'UX' | 'Design' | 'Build'
type Project = {
  id: string
  name: string
  purpose: string
  stage: Stage
  updatedAt: string
  brand: { name: string; primary: string; tone: string }
}

const stages: Stage[] = ['Briefing', 'UX', 'Design', 'Build']
const initialProject: Project = {
  id: 'demo', name: 'Herbstkampagne 2026', purpose: 'Informations-Landingpage',
  stage: 'Briefing', updatedAt: 'Heute, 10:42',
  brand: { name: 'Engelhard', primary: '#2447f5', tone: 'Kompetent, nahbar, klar' }
}

function Icon({ children }: { children: string }) { return <span className="icon" aria-hidden="true">{children}</span> }

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
      id: crypto.randomUUID(), name, purpose, stage: 'Briefing', updatedAt: 'Gerade eben',
      brand: { name: 'Noch nicht festgelegt', primary: '#2447f5', tone: 'Noch nicht definiert' }
    }
    setProjects([project, ...projects])
    setSelectedId(project.id)
    setShowCreate(false)
  }

  return <main className="app-shell">
    <Sidebar />
    <section className="page">
      {selected
        ? <ProjectDetail project={selected} onBack={() => setSelectedId(null)} onUpdate={(brand) => setProjects(projects.map(p => p.id === selected.id ? { ...p, brand, updatedAt: 'Gerade eben' } : p))} />
        : <Dashboard projects={projects} onCreate={() => setShowCreate(true)} onOpen={setSelectedId} />}
    </section>
    {showCreate && <CreateDialog onClose={() => setShowCreate(false)} onCreate={createProject} />}
  </main>
}

function Sidebar() {
  return <aside className="sidebar">
    <div className="logo"><span className="logo-mark">A</span><span>atelier</span><em>beta</em></div>
    <button className="workspace-switch"><span className="workspace-logo">E</span><span><small>WORKSPACE</small><strong>Engelhard</strong></span><b>⌄</b></button>
    <nav className="main-nav"><a className="active"><Icon>▦</Icon> Projekte</a><a><Icon>◈</Icon> Markenwelten</a><a><Icon>◷</Icon> Aktivitäten</a></nav>
    <div className="sidebar-separator" />
    <nav className="secondary-nav"><a><Icon>◉</Icon> Vorlagen</a><a><Icon>?</Icon> Hilfe & Feedback</a></nav>
    <div className="profile"><div className="avatar">AJ</div><span><strong>Alexander Jaquet</strong><small>Administrator</small></span><b>•••</b></div>
  </aside>
}

function Dashboard({ projects, onCreate, onOpen }: { projects: Project[]; onCreate: () => void; onOpen: (id: string) => void }) {
  const active = projects.find(p => p.stage !== 'Build') ?? projects[0]
  return <>
    <header className="topbar"><div className="mobile-logo"><span className="logo-mark">A</span> atelier</div><div className="topbar-right"><button className="help-button">⌘ K <span>Suchen</span></button><button className="bell">♧</button></div></header>
    <div className="dashboard-wrap">
      <section className="intro"><div><span className="eyebrow">WEBSITE STUDIO</span><h1>Vom Gedanken zur<br /><i>guten</i> Website.</h1><p>Ein geführter Prozess für Websites, die strategisch klar, visuell stimmig und technisch sauber sind.</p></div><button className="primary large" onClick={onCreate}><span>＋</span> Neues Projekt</button></section>
      <section className="journey-card">
        <div className="journey-copy"><span className="eyebrow">DEIN NÄCHSTER SCHRITT</span><h2>{active ? active.name : 'Dein erstes Projekt'}</h2><p>{active ? 'Die Grundlage steht. Formuliere jetzt Ziel, Zielgruppe und Kernbotschaft.' : 'Starte mit einem Projekt, damit wir deine Website Schritt für Schritt entwickeln können.'}</p><button className="link-button" onClick={() => active ? onOpen(active.id) : onCreate()}>{active ? 'Projekt öffnen' : 'Projekt anlegen'} <span>→</span></button></div>
        <div className="journey-map" aria-label="Phasen des Website-Prozesses">{stages.map((stage, index) => <div className={`journey-step ${active && stages.indexOf(active.stage) >= index ? 'active' : ''}`} key={stage}><span>{String(index + 1).padStart(2, '0')}</span><strong>{stage}</strong><small>{index === 0 ? 'Kontext & Ziel' : index === 1 ? 'Struktur & Flow' : index === 2 ? 'Look & System' : 'Website & Launch'}</small></div>)}</div>
      </section>
      <div className="list-heading"><div><span className="eyebrow">ARBEITSBEREICH</span><h2>Deine Projekte</h2></div><div className="view-switch"><button className="selected">▦</button><button>☷</button></div></div>
      <section className="project-grid">{projects.map(project => <ProjectCard key={project.id} project={project} onOpen={() => onOpen(project.id)} />)}<button className="new-project-card" onClick={onCreate}><span>＋</span><strong>Projekt anlegen</strong><small>Starte mit einem kurzen Briefing</small></button></section>
    </div>
  </>
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const stageIndex = stages.indexOf(project.stage)
  return <button className="project-card" onClick={onOpen}><div className="card-visual"><div className="visual-nav"><i /><i /><i /></div><div className="visual-title">{project.brand.name === 'Noch nicht festgelegt' ? 'A' : project.brand.name.slice(0, 1)}</div><div className="visual-blob" /><div className="visual-line one" /><div className="visual-line two" /><div className="visual-button" /></div><div className="project-meta"><div><span className="stage-pill"><b>{stageIndex + 1}</b> {project.stage}</span><h3>{project.name}</h3><p>{project.purpose}</p></div><span className="arrow">↗</span></div><footer><span>Aktualisiert {project.updatedAt}</span><div className="mini-avatars"><i>AJ</i></div></footer></button>
}

function ProjectDetail({ project, onBack, onUpdate }: { project: Project; onBack: () => void; onUpdate: (brand: Project['brand']) => void }) {
  const [tab, setTab] = useState<'overview' | 'brand' | 'team'>('overview')
  const [brand, setBrand] = useState(project.brand)
  const stageIndex = stages.indexOf(project.stage)
  return <><header className="topbar"><button className="back" onClick={onBack}>← Alle Projekte</button><div className="topbar-right"><span className="saving">● Gespeichert</span><button className="bell">♧</button></div></header>
    <div className="detail-wrap"><section className="project-header"><div><span className="eyebrow">PROJEKT</span><h1>{project.name}</h1><p>{project.purpose} · Erstellt heute</p></div><button className="secondary-button">Teilen <span>↗</span></button></section>
      <div className="stagebar">{stages.map((stage, index) => <div className={index <= stageIndex ? 'done' : ''} key={stage}><span>{index < stageIndex ? '✓' : index + 1}</span><strong>{stage}</strong></div>)}</div>
      <div className="tabs"><button className={tab === 'overview' ? 'selected' : ''} onClick={() => setTab('overview')}>Übersicht</button><button className={tab === 'brand' ? 'selected' : ''} onClick={() => setTab('brand')}>Markenprofil</button><button className={tab === 'team' ? 'selected' : ''} onClick={() => setTab('team')}>Team</button></div>
      {tab === 'overview' && <section className="next-step-panel"><div className="step-number">01</div><div><span className="eyebrow">AKTUELLE PHASE · BRIEFING</span><h2>Eine starke Website beginnt mit Klarheit.</h2><p>In wenigen Minuten definierst du Ziel, Zielgruppe und Botschaft. Daraus wird ein konkretes Briefing, das du vor dem UX-Schritt freigibst.</p><button className="primary disabled">Briefing in R1 verfügbar <span>→</span></button></div><div className="checklist"><strong>Bereit für den Start</strong><span>✓ Projekt angelegt</span><span>✓ Markenrahmen definiert</span><span>○ Briefing formulieren</span></div></section>}
      {tab === 'brand' && <section className="brand-layout"><article className="form-panel"><span className="eyebrow">MARKENPROFIL</span><h2>Der visuelle Rahmen.</h2><p>Diese Werte steuern später die Designrichtung und alle erzeugten Komponenten.</p><label>Markenname<input value={brand.name} onChange={e => setBrand({ ...brand, name: e.target.value })} /></label><label>Primärfarbe<input value={brand.primary} onChange={e => setBrand({ ...brand, primary: e.target.value })} /></label><label>Markenton<input value={brand.tone} onChange={e => setBrand({ ...brand, tone: e.target.value })} /></label><button className="primary" onClick={() => onUpdate(brand)}>Änderungen speichern</button></article><aside className="brand-preview"><span>LIVE PREVIEW</span><div style={{ background: brand.primary }}><b>{brand.name || 'Marke'}</b><em>Eine klare Botschaft<br />für deine Zielgruppe.</em><i>Mehr erfahren →</i></div></aside></section>}
      {tab === 'team' && <section className="team-panel"><span className="eyebrow">TEAM & FREIGABE</span><h2>Wer arbeitet an diesem Projekt?</h2><div className="team-row"><div className="avatar">AJ</div><div><strong>Alexander Jaquet</strong><small>Administrator · volle Rechte</small></div><span>Eigentümer</span></div><div className="empty-invite"><span>＋</span><div><strong>Teammitglied einladen</strong><small>Editoren und Reviewer werden in R0.3 ergänzt.</small></div></div></section>}
    </div></>
}

function CreateDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, purpose: string) => void }) {
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('Landingpage')
  return <div className="overlay"><form className="dialog" onSubmit={e => { e.preventDefault(); if (name.trim()) onCreate(name.trim(), purpose) }}><button type="button" className="close" onClick={onClose}>×</button><span className="eyebrow">NEUES PROJEKT</span><h2>Womit möchtest du starten?</h2><p>Du beginnst mit dem Kontext. Danach führen wir dich durch UX, Design und Build.</p><label>Projektname<input placeholder="z. B. Produktkampagne 2026" value={name} onChange={e => setName(e.target.value)} autoFocus /></label><label>Seitentyp<select value={purpose} onChange={e => setPurpose(e.target.value)}><option>Landingpage</option><option>Informationsseite</option><option>Microsite</option></select></label><div className="dialog-actions"><button type="button" className="ghost" onClick={onClose}>Abbrechen</button><button className="primary" type="submit">Projekt anlegen <span>→</span></button></div></form></div>
}

createRoot(document.getElementById('root')!).render(<App />)

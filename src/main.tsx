import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Stage = 'Briefing' | 'UX' | 'Design' | 'Build'
type Screen = 'landing' | 'signin' | 'workspace'
type Briefing = {
  goal: string
  audience: string
  offer: string
  action: string
  tone: string
  reference: string
}
type Project = {
  id: string
  name: string
  purpose: string
  stage: Stage
  updatedAt: string
  brand: { name: string; primary: string; tone: string }
  briefing?: Briefing
}

const stages: Stage[] = ['Briefing', 'UX', 'Design', 'Build']
const initialProject: Project = {
  id: 'demo', name: 'Herbstkampagne 2026', purpose: 'Informations-Landingpage',
  stage: 'Briefing', updatedAt: 'Heute, 10:42',
  brand: { name: 'Engelhard', primary: '#2447f5', tone: 'Kompetent, nahbar, klar' }
}

function Icon({ children }: { children: string }) { return <span className="icon" aria-hidden="true">{children}</span> }

function App() {
  const [screen, setScreen] = useState<Screen>(() => localStorage.getItem('atelier-signed-in') ? 'workspace' : 'landing')
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

  const signIn = () => { localStorage.setItem('atelier-signed-in', 'true'); setScreen('workspace') }
  if (screen === 'landing') return <Landing onSignIn={() => setScreen('signin')} />
  if (screen === 'signin') return <SignIn onBack={() => setScreen('landing')} onComplete={signIn} />

  return <main className="app-shell">
    <Sidebar />
    <section className="page">
      {selected
        ? <ProjectDetail project={selected} onBack={() => setSelectedId(null)} onUpdate={(brand) => setProjects(projects.map(p => p.id === selected.id ? { ...p, brand, updatedAt: 'Gerade eben' } : p))} onSaveBriefing={(briefing) => setProjects(projects.map(p => p.id === selected.id ? { ...p, briefing, updatedAt: 'Gerade eben' } : p))} />
        : <Dashboard projects={projects} onCreate={() => setShowCreate(true)} onOpen={setSelectedId} />}
    </section>
    {showCreate && <CreateDialog onClose={() => setShowCreate(false)} onCreate={createProject} />}
  </main>
}

function Landing({ onSignIn }: { onSignIn: () => void }) {
  return <main className="landing">
    <header className="landing-nav"><div className="landing-logo"><span className="logo-mark">A</span> atelier</div><nav><a>So funktioniert's</a><a>Vorlagen</a></nav><button className="sign-in-link" onClick={onSignIn}>Anmelden <span>→</span></button></header>
    <section className="landing-hero"><div className="hero-copy"><span className="eyebrow">WEBSITE CREATION STUDIO</span><h1>Websites, die<br /><span>wirken.</span></h1><p>Atelier macht aus einer Idee eine Website, die klar kommuniziert, gut aussieht und überall funktioniert.</p><div className="hero-actions"><button className="primary large" onClick={onSignIn}>Neue Website erstellen <span>→</span></button><button className="text-action" onClick={onSignIn}>Projekt öffnen</button></div><div className="trust-line"><i>✓</i> Erst Konzept und Design. Dann der Code.</div></div><div className="hero-preview"><div className="preview-toolbar"><span /><span /><span /><b>atelier / preview</b><em>●</em></div><div className="preview-page"><div className="preview-brand">nord.</div><div className="preview-menu">Home&nbsp;&nbsp; About&nbsp;&nbsp; Journal <button>Contact</button></div><div className="preview-content"><small>THE NEW STANDARD</small><h2>Made for<br />the moments<br />that matter.</h2><p>A distinctive approach to modern wellness.</p><button>Discover more <span>→</span></button></div><div className="preview-orb" /></div><span className="floating-label">Live Website Preview</span></div>
    </section>
    <section className="start-section"><div className="section-intro"><span className="eyebrow">DEIN EINSTIEG</span><h2>Womit möchtest du beginnen?</h2><p>Du bringst den Anlass mit. Atelier bringt Struktur, Designqualität und einen klaren Weg zum Ergebnis.</p></div><div className="start-options"><button onClick={onSignIn}><span className="option-icon">✦</span><strong>Mit einer Idee starten</strong><p>Von Ziel und Zielgruppe zu einem durchdachten Website-Konzept.</p><i>Loslegen →</i></button><button onClick={onSignIn}><span className="option-icon">▧</span><strong>Aus einer Vorlage starten</strong><p>Ein hochwertiger Ausgangspunkt, den du zu deiner Marke machst.</p><i>Vorlagen entdecken →</i></button><button onClick={onSignIn}><span className="option-icon">↗</span><strong>Etwas Bestehendes verbessern</strong><p>Struktur, Design oder Inhalte einer vorhandenen Seite weiterentwickeln.</p><i>Website verbessern →</i></button></div></section>
    <section className="promise"><div><span className="eyebrow">DER ATELIER-WEG</span><h2>Gute Websites entstehen<br />nicht durch Zufall.</h2></div><div className="promise-steps"><span><b>01</b> Klar denken <small>Ziel, Nutzer und Botschaft</small></span><span><b>02</b> Sicher gestalten <small>UX, Design und Marke</small></span><span><b>03</b> Stark umsetzen <small>Responsive Website und Launch</small></span></div></section>
    <footer className="landing-footer"><div className="landing-logo"><span className="logo-mark">A</span> atelier</div><span>Ein interner Engelhard PoC</span><button onClick={onSignIn}>Zum Workspace →</button></footer>
  </main>
}

function SignIn({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [email, setEmail] = useState('')
  return <main className="signin-screen"><button className="signin-logo" onClick={onBack}><span className="logo-mark">A</span> atelier</button><section className="signin-card"><button className="back-to-site" onClick={onBack}>← Zurück</button><span className="eyebrow">WORKSPACE</span><h1>Willkommen zurück.</h1><p>Melde dich an, um an deinen Website-Projekten weiterzuarbeiten.</p><form onSubmit={event => { event.preventDefault(); if (email.trim()) onComplete() }}><label>E-Mail-Adresse<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="name@unternehmen.de" autoFocus required /></label><button className="primary" type="submit">Weiter <span>→</span></button></form><div className="signin-divider"><span>oder</span></div><button className="sso-button" onClick={onComplete}><b>◇</b> Mit Unternehmens-Login fortfahren</button><small className="poc-note">Interner PoC · Die Anmeldung wird derzeit nur lokal simuliert.</small></section><aside className="signin-aside"><span className="eyebrow">ATELIER</span><h2>Die richtige Idee verdient eine richtig gute Website.</h2><p>Von der ersten Skizze bis zum letzten Detail – an einem Ort.</p><div className="aside-orbit"><i /><i /><b>✦</b></div></aside></main>
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

function ProjectDetail({ project, onBack, onUpdate, onSaveBriefing }: { project: Project; onBack: () => void; onUpdate: (brand: Project['brand']) => void; onSaveBriefing: (briefing: Briefing) => void }) {
  const [tab, setTab] = useState<'overview' | 'brand' | 'team'>('overview')
  const [brand, setBrand] = useState(project.brand)
  const [briefingOpen, setBriefingOpen] = useState(false)
  const stageIndex = stages.indexOf(project.stage)
  return <><header className="topbar"><button className="back" onClick={onBack}>← Alle Projekte</button><div className="topbar-right"><span className="saving">● Gespeichert</span><button className="bell">♧</button></div></header>
    <div className="detail-wrap"><section className="project-header"><div><span className="eyebrow">PROJEKT</span><h1>{project.name}</h1><p>{project.purpose} · Erstellt heute</p></div><button className="secondary-button">Teilen <span>↗</span></button></section>
      <div className="stagebar">{stages.map((stage, index) => <div className={index <= stageIndex ? 'done' : ''} key={stage}><span>{index < stageIndex ? '✓' : index + 1}</span><strong>{stage}</strong></div>)}</div>
      <div className="tabs"><button className={tab === 'overview' ? 'selected' : ''} onClick={() => setTab('overview')}>Übersicht</button><button className={tab === 'brand' ? 'selected' : ''} onClick={() => setTab('brand')}>Markenprofil</button><button className={tab === 'team' ? 'selected' : ''} onClick={() => setTab('team')}>Team</button></div>
      {tab === 'overview' && (project.briefing ? <ConceptResult project={project} briefing={project.briefing} onEdit={() => setBriefingOpen(true)} /> : <section className="next-step-panel"><div className="step-number">01</div><div><span className="eyebrow">AKTUELLE PHASE · BRIEFING</span><h2>Eine starke Website beginnt mit Klarheit.</h2><p>In wenigen Minuten definierst du Ziel, Zielgruppe und Botschaft. Atelier übersetzt deine Antworten in ein freigabefähiges Website-Konzept.</p><button className="primary" onClick={() => setBriefingOpen(true)}>Briefing starten <span>→</span></button></div><div className="checklist"><strong>Bereit für den Start</strong><span>✓ Projekt angelegt</span><span>✓ Markenrahmen definiert</span><span>○ Briefing formulieren</span></div></section>)}
      {tab === 'brand' && <section className="brand-layout"><article className="form-panel"><span className="eyebrow">MARKENPROFIL</span><h2>Der visuelle Rahmen.</h2><p>Diese Werte steuern später die Designrichtung und alle erzeugten Komponenten.</p><label>Markenname<input value={brand.name} onChange={e => setBrand({ ...brand, name: e.target.value })} /></label><label>Primärfarbe<input value={brand.primary} onChange={e => setBrand({ ...brand, primary: e.target.value })} /></label><label>Markenton<input value={brand.tone} onChange={e => setBrand({ ...brand, tone: e.target.value })} /></label><button className="primary" onClick={() => onUpdate(brand)}>Änderungen speichern</button></article><aside className="brand-preview"><span>LIVE PREVIEW</span><div style={{ background: brand.primary }}><b>{brand.name || 'Marke'}</b><em>Eine klare Botschaft<br />für deine Zielgruppe.</em><i>Mehr erfahren →</i></div></aside></section>}
      {tab === 'team' && <section className="team-panel"><span className="eyebrow">TEAM & FREIGABE</span><h2>Wer arbeitet an diesem Projekt?</h2><div className="team-row"><div className="avatar">AJ</div><div><strong>Alexander Jaquet</strong><small>Administrator · volle Rechte</small></div><span>Eigentümer</span></div><div className="empty-invite"><span>＋</span><div><strong>Teammitglied einladen</strong><small>Editoren und Reviewer werden in R0.3 ergänzt.</small></div></div></section>}
    </div>{briefingOpen && <BriefingFlow project={project} initial={project.briefing} onClose={() => setBriefingOpen(false)} onComplete={(briefing) => { onSaveBriefing(briefing); setBriefingOpen(false) }} />}</>
}

function ConceptResult({ project, briefing, onEdit }: { project: Project; briefing: Briefing; onEdit: () => void }) {
  const offer = briefing.offer || project.name
  const audience = briefing.audience || 'deine Zielgruppe'
  return <section className="concept-result"><div className="concept-top"><div><span className="eyebrow">BRIEFING · KONZEPTBEREIT</span><h2>Deine strategische Grundlage steht.</h2><p>Prüfe das Konzept. Nach der Freigabe wird daraus im UX Studio Seitenstruktur und Wireframes.</p></div><button className="secondary-button" onClick={onEdit}>Briefing bearbeiten</button></div><div className="concept-grid"><article className="concept-lead"><span className="concept-label">KERNBOTSCHAFT</span><h3>{offer} – klar gedacht für {audience}.</h3><p>{briefing.goal || 'Die Website vermittelt den Nutzen schnell und führt Besucher gezielt zur nächsten Aktion.'}</p></article><article><span className="concept-label">EMPFOHLENE SEITEN</span><ul><li>Startseite <em>Orientierung & Kernbotschaft</em></li><li>Leistung / Angebot <em>Nutzen, Details & Vertrauen</em></li><li>Über uns <em>Marke, Haltung & Glaubwürdigkeit</em></li><li>Kontakt <em>{briefing.action || 'Nächster Schritt'}</em></li></ul></article><article><span className="concept-label">GESTALTUNGSLEITPLANKEN</span><p><b>Ton:</b> {briefing.tone || project.brand.tone}</p><p><b>Marke:</b> {project.brand.name}</p><p><b>Referenz:</b> {briefing.reference || 'Wird im Design Studio konkretisiert.'}</p></article></div><div className="concept-footer"><span>✓ Briefing abgeschlossen</span><button className="primary disabled">Weiter zum UX Studio <span>→</span></button></div></section>
}

const briefingSteps: Array<{ key: keyof Briefing; eyebrow: string; title: string; description: string; label: string; placeholder: string }> = [
  { key: 'goal', eyebrow: 'SCHRITT 1 VON 6', title: 'Was soll diese Website erreichen?', description: 'Beschreibe den wichtigsten Erfolg. Zum Beispiel informieren, Vertrauen aufbauen, Anfragen gewinnen oder ein neues Angebot vorstellen.', label: 'Ziel der Website', placeholder: 'z. B. Unser neues Produkt verständlich erklären und qualifizierte Anfragen gewinnen.' },
  { key: 'audience', eyebrow: 'SCHRITT 2 VON 6', title: 'Wen möchtest du erreichen?', description: 'Je klarer wir den Besucher verstehen, desto präziser werden Struktur, Sprache und Design.', label: 'Primäre Zielgruppe', placeholder: 'z. B. Gesundheitsbewusste Menschen ab 40, die eine verlässliche Lösung suchen.' },
  { key: 'offer', eyebrow: 'SCHRITT 3 VON 6', title: 'Was steht im Mittelpunkt?', description: 'Benenne Angebot, Produkt, Thema oder Initiative, um die es auf der Website geht.', label: 'Angebot oder Kernthema', placeholder: 'z. B. Die neue Produktlinie für erholsamen Schlaf.' },
  { key: 'action', eyebrow: 'SCHRITT 4 VON 6', title: 'Was soll danach passieren?', description: 'Der gewünschte nächste Schritt gibt der Website eine klare Richtung.', label: 'Wichtigste Aktion', placeholder: 'z. B. Produkt kennenlernen, Termin vereinbaren oder Newsletter abonnieren.' },
  { key: 'tone', eyebrow: 'SCHRITT 5 VON 6', title: 'Wie soll sich die Marke anfühlen?', description: 'Beschreibe Tonalität und Wirkung in wenigen Worten.', label: 'Gewünschte Wirkung', placeholder: 'z. B. Modern, beruhigend, wissenschaftlich fundiert und nahbar.' },
  { key: 'reference', eyebrow: 'SCHRITT 6 VON 6', title: 'Gibt es etwas, das dir gefällt?', description: 'Eine Website, ein Design oder ein kurzer Hinweis reicht. Das hilft später im Design Studio.', label: 'Referenz oder Hinweis', placeholder: 'z. B. Viel Weißraum, starke Bildwelten und eine sehr klare Navigation.' }
]

function BriefingFlow({ project, initial, onClose, onComplete }: { project: Project; initial?: Briefing; onClose: () => void; onComplete: (briefing: Briefing) => void }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Briefing>(initial ?? { goal: '', audience: '', offer: '', action: '', tone: project.brand.tone, reference: '' })
  const current = briefingSteps[step]
  const ready = form[current.key].trim().length > 1
  return <div className="briefing-flow"><header className="briefing-header"><button className="briefing-logo" onClick={onClose}><span className="logo-mark">A</span> atelier</button><div className="briefing-project"><span>{project.name}</span><b>Briefing</b></div><button className="exit-briefing" onClick={onClose}>Entwurf schließen ×</button></header><div className="briefing-progress"><i style={{ width: `${((step + 1) / briefingSteps.length) * 100}%` }} /></div><main className="briefing-main"><aside className="briefing-aside"><span className="eyebrow">DEIN PROZESS</span>{briefingSteps.map((item, index) => <div className={index === step ? 'current' : index < step ? 'complete' : ''} key={item.key}><b>{index < step ? '✓' : String(index + 1).padStart(2, '0')}</b><span>{item.title}</span></div>)}</aside><section className="briefing-question"><span className="eyebrow">{current.eyebrow}</span><h1>{current.title}</h1><p>{current.description}</p><label>{current.label}<textarea value={form[current.key]} onChange={event => setForm({ ...form, [current.key]: event.target.value })} placeholder={current.placeholder} autoFocus /></label><div className="briefing-actions"><button className="ghost" onClick={() => step === 0 ? onClose() : setStep(step - 1)}>{step === 0 ? 'Abbrechen' : '← Zurück'}</button><button className="primary" disabled={!ready} onClick={() => step === briefingSteps.length - 1 ? onComplete(form) : setStep(step + 1)}>{step === briefingSteps.length - 1 ? 'Konzept erstellen' : 'Weiter'} <span>→</span></button></div></section></main></div>
}

function CreateDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, purpose: string) => void }) {
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('Landingpage')
  return <div className="overlay"><form className="dialog" onSubmit={e => { e.preventDefault(); if (name.trim()) onCreate(name.trim(), purpose) }}><button type="button" className="close" onClick={onClose}>×</button><span className="eyebrow">NEUES PROJEKT</span><h2>Womit möchtest du starten?</h2><p>Du beginnst mit dem Kontext. Danach führen wir dich durch UX, Design und Build.</p><label>Projektname<input placeholder="z. B. Produktkampagne 2026" value={name} onChange={e => setName(e.target.value)} autoFocus /></label><label>Seitentyp<select value={purpose} onChange={e => setPurpose(e.target.value)}><option>Landingpage</option><option>Informationsseite</option><option>Microsite</option></select></label><div className="dialog-actions"><button type="button" className="ghost" onClick={onClose}>Abbrechen</button><button className="primary" type="submit">Projekt anlegen <span>→</span></button></div></form></div>
}

createRoot(document.getElementById('root')!).render(<App />)

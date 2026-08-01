export function MobileDock({ onHome, onCreate }: { onHome: () => void; onCreate: () => void }) {
  return <nav className="mobile-dock" aria-label="Mobile Navigation">
    <button onClick={onHome}><span>▦</span>Projekte</button>
    <button className="dock-create" onClick={onCreate}><span>＋</span>Neu</button>
    <button><span>◈</span>Marken</button>
  </nav>
}

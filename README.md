# Atelier – Website Studio (interner PoC)

Atelier ist ein geführter Website-Creation-Prozess: Aus einem Projekt werden zuerst ein Briefing, dann UX, dann Design und erst anschließend eine Website.

## R0 – implementierter Stand

- Arbeitsbereich und Projektübersicht
- Projekt anlegen und browserlokal speichern
- Projektstatus und klare Prozessphasen
- editierbares Markenprofil (Name, Primärfarbe, Tonalität)
- vorbereitete Rollenübersicht: Administrator, Editor, Reviewer

Die aktuelle Datenhaltung ist absichtlich `localStorage`. Login, Datenbank, Audit-Log und produktive Rechteverwaltung werden erst ergänzt, wenn der R0-Nutzerfluss bestätigt ist.

## R0-Sprintplan

### Sprint 0.1 – Produktfundament (abgeschlossen)

**Ziel:** Ein interner Nutzer kann ein Projekt anlegen, wiederfinden und innerhalb eines klaren Prozessmodells einordnen.

**Akzeptanzkriterien:**

- Projekte lassen sich anlegen und bleiben nach einem Browser-Reload erhalten.
- Das Produkt erklärt sichtbar die Reihenfolge Briefing → UX → Design → Build.
- Es gibt einen ersten Markenrahmen je Projekt.

### Sprint 0.2 – Persistenz und Sicherheit

**Ziel:** Ablösung der lokalen Speicherung durch ein internes Backend.

- SSO-Anbindung (z. B. Entra ID) und Workspace-Mitgliedschaften
- PostgreSQL-Datenmodell für Projekte, Markenprofile und Rollen
- Rollenprüfung im Backend, Audit-Events, mandantenfähige Workspace-Grenzen
- Container-Deployment in der internen PoC-Umgebung

### Sprint 0.3 – R0-Abnahme

**Ziel:** R0 mit ausgewählten Testnutzern absichern und für R1 freigeben.

- Projektliste mit Suche und archivierten Projekten
- Einladungen für Editor und Reviewer
- Basis-Tests, Fehlertracking und datenschutzkonformes Logging
- 30-minütiger Usability-Test mit 3–5 internen Anwendern

## Lokaler Start

```bash
npm install
npm run dev
```

Für einen Produktionsbetrieb müssen API-Schlüssel ausschließlich serverseitig verwaltet werden. In R0 wird noch kein KI-Modell aufgerufen.

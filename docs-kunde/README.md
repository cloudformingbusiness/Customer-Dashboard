# docs-kunde/ – Kunden-Dokumentation

Alle Dokumente die der Kunde am Ende des Projekts erhält.
Claude befüllt diese Ordner automatisch wenn das Projekt fertig ist.

---

## Struktur

```
docs-kunde/
├── handbuch/
│   ├── BENUTZERHANDBUCH.md     ← Wie wird die App/Website genutzt?
│   ├── website-anleitung.md    ← Website-spezifische Anleitung
│   ├── webapp-anleitung.md     ← Web App Anleitung (Login, Dashboard, ...)
│   └── mobile-anleitung.md     ← Mobile App Anleitung
├── rechtliches/
│   ├── impressum.md            ← Fertiges Impressum (aus kunde/KUNDE.md)
│   ├── datenschutz.md          ← DSGVO Datenschutzerklärung
│   └── agb.md                  ← AGB (optional)
└── screenshots/                ← Screenshots der fertigen App (PNG/WebP)
    └── .gitkeep
```

---

## Wann befüllen?

Am Ende des Projekts – entweder manuell oder via Claude:

```
"Das Projekt ist fertig. Erstelle die komplette Kunden-Dokumentation
in docs-kunde/ basierend auf der fertigen App und den Kundendaten
aus kunde/KUNDE.md."
```

Claude generiert dann automatisch:
- Benutzerhandbuch basierend auf den tatsächlich gebauten Features
- Impressum aus den Firmendaten in `kunde/KUNDE.md`
- Datenschutzerklärung basierend auf genutzten Tools aus `kunde/KUNDE.md`

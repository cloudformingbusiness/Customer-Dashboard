# Design Tokens – [KUNDENNAME]

Alle Design-Entscheidungen an einem Ort.
Claude nutzt diese Werte für alle Komponenten und Styles.

---

## Farben

```css
/* ── Primärfarbe ─────────────────────────────────────────── */
--color-primary-50:  ✏️ #eff6ff;
--color-primary-100: ✏️ #dbeafe;
--color-primary-500: ✏️ #3b82f6;   /* Hauptfarbe */
--color-primary-600: ✏️ #2563eb;   /* Hover */
--color-primary-700: ✏️ #1d4ed8;   /* Active */

/* ── Sekundärfarbe ───────────────────────────────────────── */
--color-secondary-500: ✏️ #f97316; /* Hauptfarbe */
--color-secondary-600: ✏️ #ea580c; /* Hover */

/* ── Neutrale Töne ───────────────────────────────────────── */
--color-gray-50:  #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-500: #6b7280;
--color-gray-700: #374151;
--color-gray-900: #111827;

/* ── Feedback-Farben ─────────────────────────────────────── */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error:   #ef4444;
--color-info:    #3b82f6;

/* ── Hintergrund ─────────────────────────────────────────── */
--color-bg:         #ffffff;
--color-bg-subtle:  #f9fafb;
--color-bg-muted:   #f3f4f6;
```

### Tailwind Konfiguration (für tailwind.config.ts)

```js
colors: {
  primary: {
    50:  '✏️ #eff6ff',
    100: '✏️ #dbeafe',
    500: '✏️ #3b82f6',
    600: '✏️ #2563eb',
    700: '✏️ #1d4ed8',
    DEFAULT: '✏️ #3b82f6',
    dark:    '✏️ #2563eb',
    light:   '✏️ #60a5fa',
  },
  secondary: {
    500:     '✏️ #f97316',
    600:     '✏️ #ea580c',
    DEFAULT: '✏️ #f97316',
    dark:    '✏️ #ea580c',
    light:   '✏️ #fb923c',
  },
}
```

---

## Typografie

```css
/* ── Schriftarten ────────────────────────────────────────── */
--font-heading: ✏️ 'Inter', sans-serif;
--font-body:    ✏️ 'Inter', sans-serif;
--font-mono:    'JetBrains Mono', monospace;

/* ── Schriftgrößen ───────────────────────────────────────── */
--text-xs:   0.75rem;   /*  12px */
--text-sm:   0.875rem;  /*  14px */
--text-base: 1rem;      /*  16px */
--text-lg:   1.125rem;  /*  18px */
--text-xl:   1.25rem;   /*  20px */
--text-2xl:  1.5rem;    /*  24px */
--text-3xl:  1.875rem;  /*  30px */
--text-4xl:  2.25rem;   /*  36px */
--text-5xl:  3rem;      /*  48px */

/* ── Schriftgewichte ─────────────────────────────────────── */
--font-normal:    400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;

/* ── Zeilenhöhen ─────────────────────────────────────────── */
--leading-tight:  1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

---

## Abstände & Layout

```css
/* ── Abstände (Tailwind-kompatibel) ─────────────────────── */
--spacing-xs:  0.25rem;  /*  4px  – p-1  */
--spacing-sm:  0.5rem;   /*  8px  – p-2  */
--spacing-md:  1rem;     /* 16px  – p-4  */
--spacing-lg:  1.5rem;   /* 24px  – p-6  */
--spacing-xl:  2rem;     /* 32px  – p-8  */
--spacing-2xl: 3rem;     /* 48px  – p-12 */
--spacing-3xl: 4rem;     /* 64px  – p-16 */

/* ── Maximale Inhaltsbreite ──────────────────────────────── */
--max-width-content: 1280px;  /* max-w-7xl */
--max-width-text:    768px;   /* max-w-3xl – für Textspalten */

/* ── Border Radius ───────────────────────────────────────── */
--radius-sm:  0.25rem;  /* rounded    */
--radius-md:  0.5rem;   /* rounded-lg */
--radius-lg:  0.75rem;  /* rounded-xl */
--radius-xl:  1rem;     /* rounded-2xl */
--radius-full: 9999px;  /* rounded-full */
```

---

## Komponenten-Standards

```
Buttons:
  Primary:   bg-primary text-white hover:bg-primary-dark
  Secondary: bg-secondary text-white hover:bg-secondary-dark
  Outline:   border-2 border-primary text-primary hover:bg-primary-50
  Ghost:     text-primary hover:bg-primary-50
  Größe:     px-6 py-2.5 rounded-lg font-medium text-sm

Cards:
  Hintergrund: bg-white
  Border:      border border-gray-200
  Schatten:    shadow-sm hover:shadow-md
  Radius:      rounded-xl
  Padding:     p-6

Inputs:
  Border:      border border-gray-300 focus:border-primary
  Radius:      rounded-lg
  Padding:     px-4 py-2.5
  Fehler:      border-error text-error

Navigation:
  Höhe:        h-16
  Hintergrund: bg-white / border-b border-gray-200
  Link aktiv:  text-primary font-medium
```

---

## Schatten

```css
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

## Logo Verwendung

```
kunde/assets/logos/
├── logo-hell.svg        – Auf hellem Hintergrund (Standardversion)
├── logo-dunkel.svg      – Auf dunklem Hintergrund / Dark Mode
├── logo-icon.svg        – Nur Icon/Symbol (quadratisch, für Favicon etc.)
└── logo-wortmarke.svg   – Nur Schriftzug ohne Symbol

Mindestgröße:  100px Breite
Freiraum:      Mindestens 1x Logohöhe als Abstand zu anderen Elementen
Nicht erlaubt: Strecken, Farbe ändern, drehen, Schatten hinzufügen
```

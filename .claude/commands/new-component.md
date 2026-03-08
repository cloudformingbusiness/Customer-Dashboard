Erstelle eine neue React-Komponente: $ARGUMENTS

Frage zuerst: Für welches Frontend?
[1] website   – Öffentliche Website (Marketing, SEO)
[2] webapp    – App-Bereich (eingeloggt)
[3] mobileapp – React Native

---

### website → `src/frontend/website/src/components/$ARGUMENTS.tsx`

```typescript
import type { FC } from 'react'

interface I$ARGUMENTSProps {
  // ✏️ Props hier definieren
}

export const $ARGUMENTS: FC<I$ARGUMENTSProps> = ({ ...props }) => {
  return (
    <div className="...">
      {/* ✏️ Implementierung */}
    </div>
  )
}

export default $ARGUMENTS
```

Test: `src/frontend/website/src/__tests__/components/$ARGUMENTS.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { $ARGUMENTS } from '../../components/$ARGUMENTS'

describe('$ARGUMENTS', () => {
  it('rendert ohne Fehler', () => {
    render(<$ARGUMENTS />)
    // ✏️ Konkrete Assertions ergänzen
  })

  it('zeigt korrekten Inhalt', () => {
    render(<$ARGUMENTS />)
    // ✏️ z.B. expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('reagiert auf Interaktion', () => {
    // ✏️ userEvent / fireEvent Tests
  })
})
```

---

### webapp → `src/frontend/webapp/src/components/$ARGUMENTS.tsx`

Gleiche Struktur wie website.

Test: `src/frontend/webapp/src/__tests__/components/$ARGUMENTS.test.tsx`

---

### mobileapp → `src/frontend/mobileapp/components/$ARGUMENTS.tsx`

NativeWind statt Tailwind. `View`, `Text`, `Pressable` statt HTML.

Test: `src/frontend/mobileapp/__tests__/components/$ARGUMENTS.test.tsx`

```typescript
import { render, screen } from '@testing-library/react-native'
import { $ARGUMENTS } from '../../components/$ARGUMENTS'

describe('$ARGUMENTS', () => {
  it('rendert ohne Fehler', () => {
    render(<$ARGUMENTS />)
    // ✏️ Assertions
  })
})
```

---

## Nach dem Erstellen

- [ ] Komponente in der zugehörigen Seite einbinden
- [ ] Test ausführen: `npm run test` → grün?
- [ ] `.claude/progress.md` aktualisieren

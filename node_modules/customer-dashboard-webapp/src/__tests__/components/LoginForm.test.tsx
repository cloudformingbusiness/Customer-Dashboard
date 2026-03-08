import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Pattern für Login-Form Tests.
// Eigene Komponente + Store einbinden wenn vorhanden:
// import { LoginForm } from '../../components/LoginForm'
// import { useAuthStore } from '../../stores/authStore'

const mockLogin = vi.fn()

// Minimale Stub-Komponente – durch echte ersetzen
const LoginForm = ({ onLogin = mockLogin }: { onLogin?: (email: string, pw: string) => void }) => (
  <form onSubmit={e => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onLogin(fd.get('email') as string, fd.get('password') as string)
  }}>
    <label>
      E-Mail
      <input name="email" type="email" required />
    </label>
    <label>
      Passwort
      <input name="password" type="password" required />
    </label>
    <button type="submit">Einloggen</button>
  </form>
)

beforeEach(() => mockLogin.mockClear())

describe('LoginForm', () => {
  it('rendert E-Mail und Passwort Felder', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText('E-Mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Passwort')).toBeInTheDocument()
  })

  it('rendert Einloggen Button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: 'Einloggen' })).toBeInTheDocument()
  })

  it('ruft onLogin mit E-Mail und Passwort auf', async () => {
    render(<LoginForm onLogin={mockLogin} />)
    fireEvent.change(screen.getByLabelText('E-Mail'),   { target: { value: 'test@test.de' } })
    fireEvent.change(screen.getByLabelText('Passwort'), { target: { value: 'geheim123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Einloggen' }))
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.de', 'geheim123')
    })
  })

  it('ruft onLogin nicht auf bei leerem Formular', () => {
    render(<LoginForm onLogin={mockLogin} />)
    fireEvent.click(screen.getByRole('button', { name: 'Einloggen' }))
    expect(mockLogin).not.toHaveBeenCalled()
  })
})

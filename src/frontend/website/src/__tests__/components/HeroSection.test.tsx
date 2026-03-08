import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

// Wird durch echte Komponente ersetzt sobald sie existiert.
// Dieses Template zeigt das Test-Pattern für Website-Sektionen.
const HeroSection = ({
  headline = 'Willkommen',
  subline  = '',
  ctaText  = 'Jetzt starten',
  ctaHref  = '/kontakt',
}: {
  headline?: string
  subline?:  string
  ctaText?:  string
  ctaHref?:  string
}) => (
  <section>
    <h1>{headline}</h1>
    {subline && <p>{subline}</p>}
    <a href={ctaHref}>{ctaText}</a>
  </section>
)

describe('HeroSection', () => {
  it('rendert Headline', () => {
    render(<MemoryRouter><HeroSection headline="Automatisierung die wirkt" /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Automatisierung die wirkt')
  })

  it('rendert Subline wenn übergeben', () => {
    render(<MemoryRouter><HeroSection subline="Ihr Partner für digitale Prozesse" /></MemoryRouter>)
    expect(screen.getByText('Ihr Partner für digitale Prozesse')).toBeInTheDocument()
  })

  it('rendert keinen Subline-Text wenn nicht übergeben', () => {
    const { queryByText } = render(<MemoryRouter><HeroSection /></MemoryRouter>)
    expect(queryByText(/partner/i)).toBeNull()
  })

  it('rendert CTA-Link mit korrektem href', () => {
    render(<MemoryRouter><HeroSection ctaText="Anfragen" ctaHref="/kontakt" /></MemoryRouter>)
    const link = screen.getByRole('link', { name: 'Anfragen' })
    expect(link).toHaveAttribute('href', '/kontakt')
  })
})

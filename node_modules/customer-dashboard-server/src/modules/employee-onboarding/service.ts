// Mock data – no real DB table needed

export async function getOnboardingChecklist() {
  return [
    {
      id: '1',
      title: 'Arbeitsvertrag',
      description: 'Arbeitsvertrag wurde erstellt und unterschrieben.',
      status: 'completed',
      completedAt: '2026-03-01',
    },
    {
      id: '2',
      title: 'IT-Ausstattung',
      description: 'Laptop, Bildschirm und Peripheriegeräte bereitgestellt.',
      status: 'completed',
      completedAt: '2026-03-03',
    },
    {
      id: '3',
      title: 'Tool-Zugänge',
      description: 'E-Mail, Slack, GitHub und weitere Tool-Zugänge eingerichtet.',
      status: 'in_progress',
    },
    {
      id: '4',
      title: 'Einarbeitung',
      description: 'Strukturierte Einarbeitung mit Mentor und Dokumentation.',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Probezeit-Review',
      description: 'Feedbackgespräch und Bewertung nach der Probezeit.',
      status: 'pending',
    },
  ]
}

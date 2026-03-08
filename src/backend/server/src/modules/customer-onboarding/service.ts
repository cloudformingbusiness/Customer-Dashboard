// Mock data – no real DB table needed

export async function getOnboardingChecklist() {
  return [
    {
      id: '1',
      title: 'Vertrag unterschrieben',
      description: 'Vertrag wurde vom Kunden geprüft und unterzeichnet.',
      status: 'completed',
      completedAt: '2026-02-15',
    },
    {
      id: '2',
      title: 'Zugänge eingerichtet',
      description: 'Alle notwendigen Accounts und Zugänge wurden erstellt.',
      status: 'completed',
      completedAt: '2026-02-18',
    },
    {
      id: '3',
      title: 'Kickoff-Meeting',
      description: 'Erstes Meeting mit dem Kunden zur Projektbesprechung.',
      status: 'in_progress',
    },
    {
      id: '4',
      title: 'System-Setup',
      description: 'Technische Einrichtung der Systeme und Infrastruktur.',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Go-Live',
      description: 'Produktivsetzung und finale Übergabe an den Kunden.',
      status: 'pending',
    },
  ]
}

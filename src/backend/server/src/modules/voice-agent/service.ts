// Mock data – no real DB table needed

export async function getVoiceAgentStats() {
  return [
    {
      id: '1',
      label: 'Erreichbarkeit',
      value: 94.2,
      unit: '%',
      trend: 'up',
    },
    {
      id: '2',
      label: 'CSAT Score',
      value: 4.6,
      unit: '/ 5',
      trend: 'up',
    },
    {
      id: '3',
      label: 'Durchschnittliche Gesprächsdauer',
      value: '3:42',
      unit: 'min',
      trend: 'stable',
    },
    {
      id: '4',
      label: 'Anrufe heute',
      value: 127,
      unit: '',
      trend: 'down',
    },
  ]
}

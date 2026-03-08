import { useState, useEffect, type FormEvent } from 'react'
import { Save, Phone, Globe, Webhook, Settings2, ExternalLink, Cpu } from 'lucide-react'
import { PageHeader, Spinner, Card } from '../../../components/ui'
import { useVoiceAgentConfig, useVoiceAgentConfigMutation } from '../../../hooks/useApi'

// ── Provider definitions ─────────────────────────────────────

type ProviderType = 'retell' | 'vapi' | 'bland' | 'n8n' | 'custom'

interface IProviderOption {
  id: ProviderType
  name: string
  description: string
  icon: React.ReactNode
  website?: string
  fields: IConfigField[]
}

interface IConfigField {
  key: string
  label: string
  type: 'text' | 'url' | 'password' | 'textarea'
  placeholder: string
  required?: boolean
  helpText?: string
}

const COMMON_FIELDS: IConfigField[] = [
  { key: 'webhook_secret', label: 'Webhook Secret', type: 'password', placeholder: 'whsec_...', helpText: 'Zum Verifizieren eingehender Webhooks' },
]

const PROVIDERS: IProviderOption[] = [
  {
    id: 'retell',
    name: 'Retell AI',
    description: 'KI-Telefonagent mit natuerlicher Stimme. Ideal fuer Kundenservice und Terminbuchung.',
    icon: <Phone size={24} className="text-blue-600" />,
    website: 'https://retell.ai',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'key_...', required: true },
      { key: 'agent_id', label: 'Agent ID', type: 'text', placeholder: 'agent_...', required: true },
      ...COMMON_FIELDS,
    ],
  },
  {
    id: 'vapi',
    name: 'Vapi',
    description: 'Voice AI Platform mit flexibler Konfiguration. Gut fuer komplexe Gespraechsablaeufe.',
    icon: <Globe size={24} className="text-purple-600" />,
    website: 'https://vapi.ai',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'vapi_...', required: true },
      { key: 'assistant_id', label: 'Assistant ID', type: 'text', placeholder: 'asst_...', required: true },
      ...COMMON_FIELDS,
    ],
  },
  {
    id: 'bland',
    name: 'Bland.ai',
    description: 'KI-Anrufe im grossen Stil. Fuer Outbound-Kampagnen und hohe Volumen.',
    icon: <Phone size={24} className="text-orange-600" />,
    website: 'https://bland.ai',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'sk-...', required: true },
      { key: 'pathway_id', label: 'Pathway ID', type: 'text', placeholder: 'pathway_...', helpText: 'Optional: Vordefinierter Gespraechspfad' },
      ...COMMON_FIELDS,
    ],
  },
  {
    id: 'n8n',
    name: 'Eigener Agent (n8n)',
    description: 'Eigenen Voice Agent mit n8n-Workflows bauen. Volle Kontrolle ueber Logik und Anbindung.',
    icon: <Cpu size={24} className="text-green-600" />,
    fields: [
      { key: 'n8n_webhook_url', label: 'n8n Webhook URL (ausgehend)', type: 'url', placeholder: 'https://n8n.deine-domain.de/webhook/voice-agent', helpText: 'Webhook in n8n, der bei eingehenden Anrufen getriggert wird' },
      { key: 'n8n_workflow_id', label: 'n8n Workflow ID', type: 'text', placeholder: 'z.B. 42', helpText: 'ID des Voice Agent Workflows in n8n' },
      { key: 'sip_provider', label: 'SIP/Telefonie-Provider', type: 'text', placeholder: 'z.B. Twilio, Sipgate, Plivo', helpText: 'Welcher Telefonie-Provider die Anrufe liefert' },
      { key: 'sip_webhook_url', label: 'SIP Webhook URL', type: 'url', placeholder: 'https://api.twilio.com/...', helpText: 'Webhook-URL des Telefonie-Providers' },
      { key: 'tts_provider', label: 'TTS Provider (Text-to-Speech)', type: 'text', placeholder: 'z.B. ElevenLabs, OpenAI TTS, Google TTS' },
      { key: 'stt_provider', label: 'STT Provider (Speech-to-Text)', type: 'text', placeholder: 'z.B. Whisper, Deepgram, Google STT' },
      { key: 'llm_model', label: 'LLM Modell', type: 'text', placeholder: 'z.B. gpt-4o, claude-sonnet-4-20250514', helpText: 'KI-Modell fuer die Gespraechsfuehrung' },
      ...COMMON_FIELDS,
    ],
  },
  {
    id: 'custom',
    name: 'Custom Provider',
    description: 'Eigener oder anderer Voice Agent Provider. Daten werden per Webhook empfangen.',
    icon: <Webhook size={24} className="text-gray-600" />,
    fields: [
      { key: 'provider_name', label: 'Provider Name', type: 'text', placeholder: 'Mein Provider', required: true },
      { key: 'api_url', label: 'API URL', type: 'url', placeholder: 'https://api.mein-provider.de' },
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'API Key' },
      ...COMMON_FIELDS,
    ],
  },
]

// ── Component ───────────────────────────────────────────────

export default function VoiceAgentConfigPage() {
  const { data: config, isLoading } = useVoiceAgentConfig()
  const mutation = useVoiceAgentConfigMutation()

  const [selectedProvider, setSelectedProvider] = useState<ProviderType>('retell')
  const [phoneNumbers, setPhoneNumbers] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  // Load existing config
  useEffect(() => {
    if (config) {
      setSelectedProvider((config.provider as ProviderType) || 'retell')
      setPhoneNumbers(Array.isArray(config.phone_numbers) ? (config.phone_numbers as string[]).join(', ') : '')
      setIsActive(config.is_active as boolean ?? true)
      setSettings((config.settings as Record<string, string>) ?? {})
    }
  }, [config])

  const activeProvider = PROVIDERS.find((p) => p.id === selectedProvider)!

  const handleFieldChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaved(false)

    const numbers = phoneNumbers
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)

    await mutation.mutateAsync({
      provider: selectedProvider,
      phone_numbers: numbers,
      is_active: isActive,
      settings,
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const webhookUrl = `${window.location.origin.replace(/:\d+$/, ':3000')}/api/voice-agent/webhook`

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Voice Agent Konfiguration" subtitle="Provider und Einstellungen verwalten" />
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Voice Agent Konfiguration"
        subtitle="Provider, Telefonnummern und Einstellungen verwalten"
        actionIcon={Settings2}
      />

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">

        {/* ── Provider Selection ─────────────────────────────── */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider waehlen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROVIDERS.map((provider) => (
              <Card
                key={provider.id}
                hover
                onClick={() => setSelectedProvider(provider.id)}
                className={`p-4 ${selectedProvider === provider.id ? 'ring-2 ring-primary border-primary' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    {provider.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 text-sm">{provider.name}</h3>
                      {provider.website && (
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-primary"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{provider.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── n8n Architecture Info ─────────────────────────── */}
        {selectedProvider === 'n8n' && (
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Eigener Voice Agent mit n8n</h3>
            <p className="text-sm text-green-800 mb-3">
              Baue deinen eigenen KI-Telefonagenten mit voller Kontrolle. Der Aufbau:
            </p>
            <div className="bg-white rounded-lg p-4 border border-green-200 font-mono text-xs text-gray-700 space-y-1">
              <p>Anruf eingehend</p>
              <p className="text-gray-400">  |</p>
              <p>  Telefonie-Provider (Twilio/Sipgate/Plivo)</p>
              <p className="text-gray-400">  |  Webhook</p>
              <p>  n8n Workflow</p>
              <p className="text-gray-400">  |  ├── STT (Whisper/Deepgram) → Text</p>
              <p className="text-gray-400">  |  ├── LLM (GPT-4/Claude) → Antwort</p>
              <p className="text-gray-400">  |  ├── TTS (ElevenLabs/OpenAI) → Audio</p>
              <p className="text-gray-400">  |  └── Webhook → Dashboard</p>
              <p>  Dashboard (Anzeige + Analyse)</p>
            </div>
            <p className="text-sm text-green-800 mt-3">
              Der n8n-Workflow empfaengt Anrufe, verarbeitet sie mit KI und meldet die Ergebnisse ans Dashboard zurueck.
            </p>
          </Card>
        )}

        {/* ── Provider Settings ─────────────────────────────── */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {activeProvider.name} – Einstellungen
          </h2>

          <div className="space-y-4">
            {activeProvider.fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.key}
                    value={settings[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                  />
                ) : (
                  <input
                    id={field.key}
                    type={field.type}
                    value={settings[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                  />
                )}
                {field.helpText && (
                  <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* ── Phone Numbers ─────────────────────────────────── */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Telefonnummern</h2>
          <div>
            <label htmlFor="phone_numbers" className="block text-sm font-medium text-gray-700 mb-1">
              Telefonnummern (kommagetrennt)
            </label>
            <input
              id="phone_numbers"
              type="text"
              value={phoneNumbers}
              onChange={(e) => setPhoneNumbers(e.target.value)}
              placeholder="+49 89 12345678, +49 89 87654321"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              Die Telefonnummern, die der Voice Agent bedient
            </p>
          </div>
        </Card>

        {/* ── Webhook Info ──────────────────────────────────── */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhook Endpoint</h2>
          <p className="text-sm text-gray-600 mb-3">
            {selectedProvider === 'n8n'
              ? 'Trage diese URL in deinem n8n-Workflow als HTTP Request Node ein, um Anrufdaten ans Dashboard zu senden:'
              : 'Trage diese URL in deinem Provider ein, um Anrufdaten ans Dashboard zu senden:'}
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg text-sm font-mono break-all">
              POST {webhookUrl}
            </code>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(webhookUrl)}
              className="px-3 py-2.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Kopieren
            </button>
          </div>
          {selectedProvider === 'n8n' && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Webhook-Payload Beispiel:</p>
              <pre className="text-xs text-gray-600 font-mono overflow-x-auto">{`{
  "direction": "inbound",
  "status": "completed",
  "caller_number": "+49 151 12345678",
  "callee_number": "+49 89 12345678",
  "duration_seconds": 124,
  "sentiment": "positive",
  "summary": "Kunde fragt nach Lieferstatus...",
  "transcript": "Volltext des Gespraechs...",
  "provider": "n8n",
  "started_at": "2026-03-08T10:30:00Z",
  "ended_at": "2026-03-08T10:32:04Z"
}`}</pre>
            </div>
          )}
        </Card>

        {/* ── Active Toggle + Save ──────────────────────────── */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`relative w-11 h-6 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-gray-300'}`}
              onClick={() => setIsActive(!isActive)}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Voice Agent {isActive ? 'aktiv' : 'inaktiv'}
            </span>
          </label>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-green-600 font-medium">Gespeichert!</span>
            )}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {mutation.isPending ? 'Speichern...' : 'Speichern'}
            </button>
          </div>
        </div>

        {mutation.isError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
            Fehler beim Speichern: {(mutation.error as Error).message}
          </div>
        )}
      </form>
    </div>
  )
}

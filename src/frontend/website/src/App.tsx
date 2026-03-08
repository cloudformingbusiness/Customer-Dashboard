import { Routes, Route } from 'react-router-dom'

// ✏️ Seiten hier importieren und Routen ergänzen
// import { HomePage }    from './pages/HomePage'
// import { AboutPage }   from './pages/AboutPage'
// import { KontaktPage } from './pages/KontaktPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              FlowTecsMedia
            </h1>
            <p className="text-gray-500">
              ✏️ Website hier aufbauen – starte mit einem Prompt aus <code>prompts/starter-prompts.md</code>
            </p>
          </div>
        </div>
      } />
      {/* ✏️ Weitere Routen hier eintragen */}
    </Routes>
  )
}

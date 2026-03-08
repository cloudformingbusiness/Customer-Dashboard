import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ITopBarProps {
  sidebarCollapsed: boolean
}

export function TopBar({ sidebarCollapsed }: ITopBarProps) {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header
      className={`
        fixed top-0 right-0 h-16 bg-white border-b border-gray-200
        flex items-center justify-end px-6 z-20
        transition-all duration-200
        ${sidebarCollapsed ? 'left-16' : 'left-64'}
      `}
    >
      {/* User Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
            {user?.email?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">
            {user?.email ?? 'Benutzer'}
          </span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
            <button
              onClick={() => { setMenuOpen(false); navigate('/settings/profile') }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <User size={16} />
              Profil
            </button>
            <button
              onClick={() => { setMenuOpen(false); navigate('/settings') }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings size={16} />
              Einstellungen
            </button>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Abmelden
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

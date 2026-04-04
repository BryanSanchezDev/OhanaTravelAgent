import { useState, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import LoginScreen from './components/LoginScreen'

export interface AuthUser {
  userId: string
  userDetails: string
  userRoles: string[]
  identityProvider: string
}

interface AuthResponse {
  clientPrincipal: AuthUser | null
}

function App() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    fetch('/.auth/me')
      .then(res => res.json())
      .then(async (data: AuthResponse) => {
        const principal = data.clientPrincipal
        if (!principal) {
          setUser(null)
          return
        }
        // SWA CLI emulator doesn't inject custom roles into /.auth/me locally,
        // so we call get-roles directly to check membership.
        if (principal.userRoles.includes('approved-member')) {
          setUser(principal)
          return
        }
        const rolesRes = await fetch('/api/get-roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientPrincipal: principal }),
        })
        const rolesData = await rolesRes.json()
        if (rolesData.roles?.includes('approved-member')) {
          setUser(principal)
        } else {
          setUnauthorized(true)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false))
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl">🧳</div>
          <div className="flex gap-2">
            <div className="typing-dot w-3 h-3 bg-blue-400 rounded-full" />
            <div className="typing-dot w-3 h-3 bg-blue-400 rounded-full" />
            <div className="typing-dot w-3 h-3 bg-blue-400 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!user || unauthorized) {
    return <LoginScreen unauthorized={unauthorized} />
  }

  return <ChatWindow user={user} />
}

export default App

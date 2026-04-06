import { useState, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import LoginScreen from './components/LoginScreen'

type AuthState = 'loading' | 'valid' | 'invalid'

function App() {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [memberName, setMemberName] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')

    if (!urlToken) {
      setAuthState('invalid')
      return
    }

    fetch('/api/validate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: urlToken }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setToken(urlToken)
          setMemberName(data.memberName ?? null)
          setAuthState('valid')
        } else {
          setAuthState('invalid')
        }
      })
      .catch(() => setAuthState('invalid'))
  }, [])

  if (authState === 'loading') {
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

  if (authState === 'invalid') {
    return <LoginScreen />
  }

  return <ChatWindow token={token!} memberName={memberName ?? ''} />
}

export default App

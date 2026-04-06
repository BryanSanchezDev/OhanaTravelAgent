import { useState, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import LoginScreen from './components/LoginScreen'

type AuthState = 'loading' | 'valid' | 'invalid'

function App() {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [memberName, setMemberName] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Check localStorage first — returning members skip the API call
    const storedToken = localStorage.getItem('ohana_token')
    const storedName = localStorage.getItem('ohana_member_name')
    if (storedToken) {
      setToken(storedToken)
      setMemberName(storedName)
      setAuthState('valid')
      return
    }

    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')

    if (!urlToken) {
      setErrorMessage('This link is not valid. Please use the personal link sent to your email.')
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
          localStorage.setItem('ohana_token', urlToken)
          localStorage.setItem('ohana_member_name', data.name ?? '')
          setToken(urlToken)
          setMemberName(data.name ?? null)
          setAuthState('valid')
        } else {
          if (data.error === 'This link has already been used') {
            setErrorMessage('This link has already been used. Each link is personal and can only be used once. Please contact us in the Skool community for a new link.')
          } else if (data.error === 'This link has been deactivated') {
            setErrorMessage('Your access has been deactivated. Please contact us in the Skool community.')
          } else if (data.error === 'This link has expired') {
            setErrorMessage('Your link has expired. Please contact us in the Skool community for a new one.')
          } else {
            setErrorMessage('This link is not valid. Please use the personal link sent to your email.')
          }
          setAuthState('invalid')
        }
      })
      .catch(() => {
        setErrorMessage('This link is not valid. Please use the personal link sent to your email.')
        setAuthState('invalid')
      })
  }, [])

  function handleLogout() {
    localStorage.removeItem('ohana_token')
    localStorage.removeItem('ohana_member_name')
    setToken(null)
    setMemberName(null)
    setErrorMessage(null)
    setAuthState('invalid')
  }

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
    return <LoginScreen errorMessage={errorMessage ?? undefined} />
  }

  return <ChatWindow token={token!} memberName={memberName ?? ''} onLogout={handleLogout} />
}

export default App

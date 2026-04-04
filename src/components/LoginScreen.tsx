interface LoginScreenProps {
  unauthorized: boolean
}

export default function LoginScreen({ unauthorized }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-300/10 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center">
          {/* Logo / Avatar */}
          <div className="flex justify-center mb-2">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
              <span className="text-5xl">🧳</span>
            </div>
          </div>

          {/* Brand name */}
          <p className="text-sm font-semibold text-orange-500 tracking-widest uppercase mb-1">
            Ohana Travel
          </p>

          {unauthorized ? (
            <>
              {/* Access Denied State */}
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Access Restricted
              </h1>
              <p className="text-slate-500 mb-6 leading-relaxed">
                This app is exclusive to Ohana Travel premium community members.
                Your account hasn't been approved yet.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
                <p className="text-sm text-amber-700 font-medium mb-1">Not a member yet?</p>
                <p className="text-sm text-amber-600">
                  Join the Ohana Travel Skool community to unlock Bella, your personal family travel AI agent.
                </p>
              </div>

              <a
                href="/.auth/logout"
                className="block w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-2xl transition-colors duration-200"
              >
                Sign out
              </a>
            </>
          ) : (
            <>
              {/* Login State */}
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Meet Bella
              </h1>
              <p className="text-slate-500 mb-2 leading-relaxed">
                Your AI family travel agent. Tell Bella where you dream of going — she'll plan the perfect trip.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {['✈️ Flights', '🏨 Hotels', '🗺️ Itineraries', '👨‍👩‍👧 Family-friendly'].map(tag => (
                  <span key={tag} className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full border border-blue-100">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="/.auth/login/google"
                className="flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-white border-2 border-slate-200 hover:border-blue-400 hover:shadow-md text-slate-700 font-semibold rounded-2xl transition-all duration-200 group"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </a>

              <p className="text-xs text-slate-400 mt-4">
                Premium community members only
              </p>
            </>
          )}
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-white/70 text-sm mt-6">
          Making family travel magical, one trip at a time 🌴
        </p>
      </div>
    </div>
  )
}

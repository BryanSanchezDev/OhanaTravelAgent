export default function LoginScreen({ errorMessage }: { errorMessage?: string }) {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background decorative glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-300/10 rounded-full blur-3xl" />
      </div>

      {/* Scattered travel icons — decorative */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <span className="absolute top-[8%] left-[7%] text-4xl opacity-20 rotate-[-12deg]">✈️</span>
        <span className="absolute top-[14%] right-[10%] text-3xl opacity-15 rotate-[8deg]">🌴</span>
        <span className="absolute bottom-[12%] left-[12%] text-3xl opacity-15 rotate-[6deg]">🐚</span>
        <span className="absolute bottom-[18%] right-[8%] text-4xl opacity-20 rotate-[-8deg]">🗺️</span>
        <span className="absolute top-[42%] left-[3%] text-2xl opacity-10 rotate-[15deg]">⛵</span>
        <span className="absolute top-[38%] right-[3%] text-2xl opacity-10 rotate-[-10deg]">🌊</span>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md mx-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-900/30 px-8 py-8 text-center">

          {/* Avatar */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg shadow-orange-300/40 rotate-3">
              <img src="/OhanaTravelIcon.png" alt="Bella" className="w-full h-full object-cover -rotate-3" />
            </div>
          </div>

          {/* App name */}
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600 mb-1">
            Ohana Travel Agent
          </p>

          {/* Headline */}
          <h1 className="text-3xl font-extrabold text-slate-800 leading-tight mb-3">
            Welcome to your family<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              travel planning assistant
            </span>
          </h1>

          {/* Error message box */}
          {errorMessage && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-4 text-left">
              <div className="flex gap-3">
                <span className="text-xl mt-0.5">💡</span>
                <p className="text-sm text-amber-800 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-slate-200 my-5" />

          {/* Access message */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-blue-100 rounded-2xl p-5 text-left">
            <div className="flex gap-3">
              <span className="text-2xl mt-0.5">🔑</span>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Personal access link required</p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  To access Bella, please use the personal link sent to your email. If you need help, contact us in the{' '}
                  <span className="font-semibold text-blue-600">Skool community</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Feature strip */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            {[
              { icon: '✈️', label: 'Flights' },
              { icon: '🏨', label: 'Hotels' },
              { icon: '👨‍👩‍👧', label: 'Family trips' },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-blue-50 border border-blue-100 rounded-xl py-2.5 px-2 flex flex-col items-center gap-1">
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-medium text-blue-600">{label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Tagline below card */}
        <p className="text-center text-white/70 text-sm mt-5 font-medium drop-shadow">
          Making family travel magical, one trip at a time 🌴
        </p>
      </div>
    </div>
  )
}

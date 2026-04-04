export interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="message-bubble flex justify-end mb-4">
        <div className="max-w-[75%] sm:max-w-[65%]">
          <div className="bg-gradient-to-br from-orange-400 to-amber-500 text-white rounded-3xl rounded-tr-sm px-4 py-3 shadow-sm shadow-orange-200">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="message-bubble flex items-end gap-2.5 mb-4">
      {/* Bella avatar */}
      <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm text-base">
        🧳
      </div>
      <div className="max-w-[75%] sm:max-w-[65%]">
        <p className="text-xs text-slate-400 font-medium mb-1 pl-1">Bella</p>
        <div className="bg-white border border-blue-100 text-slate-700 rounded-3xl rounded-tl-sm px-4 py-3 shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="message-bubble flex items-end gap-2.5 mb-4">
      <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm text-base">
        🧳
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium mb-1 pl-1">Bella</p>
        <div className="bg-white border border-blue-100 rounded-3xl rounded-tl-sm px-4 py-3.5 shadow-sm">
          <div className="flex gap-1.5 items-center">
            <div className="typing-dot w-2 h-2 bg-blue-400 rounded-full" />
            <div className="typing-dot w-2 h-2 bg-blue-400 rounded-full" />
            <div className="typing-dot w-2 h-2 bg-blue-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

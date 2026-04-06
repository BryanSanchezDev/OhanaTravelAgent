import { useState, useRef, useEffect } from "react";
import MessageBubble, { TypingIndicator, type Message } from "./MessageBubble";
interface ChatWindowProps {
  token: string;
  memberName: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Aloha! I'm Bella, your family travel agent 🌺 Tell me about your dream trip — where are you thinking of going, and who's coming along? I'll help you plan every detail!",
};

const SUGGESTED_PROMPTS = [
  "Plan a week in Hawaii for a family of 4",
  "Best beach destinations for kids under 10",
  "Help me pack for a tropical vacation",
  "Find family-friendly resorts in Mexico",
];

export default function ChatWindow({ token, memberName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (res.status === 401) {
        setInvalidToken(true);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const replyText =
        data?.content?.[0]?.text ??
        data?.text ??
        data?.message ??
        "Sorry, I had trouble understanding that. Could you try again?";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Oops, I ran into a little turbulence! 🌤️ Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const showSuggestions = messages.length === 1;

  if (invalidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            Link no longer valid
          </h2>
          <p className="text-slate-500 leading-relaxed">
            Your access link is invalid. Please use the original link from your
            email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="shrink-0 bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg shadow-blue-900/20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Bella info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-inner">
              🧳
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">
                Hi {memberName}! I'm Bella 🧳
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-xs text-blue-200">
                  Family Travel Agent
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto chat-scroll">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          {/* Suggested prompts shown only at the start */}
          {showSuggestions && !isLoading && (
            <div className="mt-2 mb-4">
              <p className="text-xs text-slate-400 font-medium mb-2 pl-11">
                Try asking...
              </p>
              <div className="pl-11 flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs bg-white hover:bg-blue-50 border border-blue-100 hover:border-blue-300 text-blue-600 font-medium px-3 py-1.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input area */}
      <div className="shrink-0 border-t border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <form
            onSubmit={handleSubmit}
            className="flex items-end justify-center gap-3"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Bella about your next family adventure..."
                rows={1}
                disabled={isLoading}
                className="w-full resize-none bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-2xl px-4 py-3 pr-12 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-200 max-h-32 disabled:opacity-50"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
              <div className="absolute right-3 bottom-3 text-xs text-slate-300 pointer-events-none">
                ↵
              </div>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-11 h-11 bg-gradient-to-br from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 disabled:from-slate-200 disabled:to-slate-300 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
              aria-label="Send message"
            >
              <svg
                className="w-5 h-5 rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
          <p className="text-center text-xs text-slate-300 mt-2">
            Shift+Enter for new line · Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}

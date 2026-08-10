"use client";

import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";

export default function ChatBot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [quickActions] = useState([
    "Cek jadwal dokter umum",
    "Booking dokter gigi",
    "Jam operasional RS",
    "Biaya konsultasi",
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuickAction = (action: string) => {
    handleInputChange({ target: { value: action } } as any);
    setTimeout(() => {
      const form = scrollRef.current?.closest("form") as HTMLFormElement;
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }, 100);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-sky-100">
      <div className="bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-4">
        <h3 className="text-white font-semibold text-lg">AI Asisten RS Booking</h3>
        <p className="text-sky-100 text-sm">Tanya jadwal, booking, biaya, dan info lainnya</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="text-center py-4">
              <span className="text-4xl">🤖</span>
              <p className="text-gray-500 text-sm mt-2">Halo! Saya asisten AI RS Booking. Silakan tanyakan:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action)}
                  className="text-left text-sm px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition border border-sky-100"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-sky-500 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-sky-50 flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Tanyakan jadwal atau booking..."
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-2.5 bg-sky-500 text-white rounded-xl hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}

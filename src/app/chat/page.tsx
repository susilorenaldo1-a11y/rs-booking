import ChatBot from "@/components/chat/ChatBot";

export default function ChatPage() {
  return (
    <div className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Asisten RS Booking</h1>
          <p className="text-gray-700 mt-2">Konsultasi jadwal dokter & booking melalui chat dengan AI</p>
        </div>
        <ChatBot />
      </div>
    </div>
  );
}

// src/components/admin/chatbot/ChatbotTestPanel.tsx

import { useState } from "react";
import { chatbotService } from "../../../services/chatbot/chatbotService";
import Button from "../../ui/Button";
import { Send, Bot } from "lucide-react";
import type { BotReply } from "../../../types/chatbot/chatbot";

interface ErrorResponse {
  error: string;
}

type TestResponse = BotReply | ErrorResponse;

function isErrorResponse(response: TestResponse): response is ErrorResponse {
  return 'error' in response;
}

export default function ChatbotTestPanel() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TestResponse | null>(null);

  const handleTest = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      const reply = await chatbotService.testReply(message);
      setResponse(reply);
    } catch (err) {
      console.error("Error probando chatbot:", err);
      setResponse({ error: "Error al probar el chatbot" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTest();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#C6E3D3] shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-[#0D784A]" />
        <h3 className="font-semibold text-[#0D784A]">Probar Chatbot</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Escribe un mensaje para probar cómo responde el chatbot con las FAQs actuales.
      </p>

      {/* Input de prueba */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: ¿Cuáles son los horarios?"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#0D784A] focus:ring-1 focus:ring-[#0D784A] outline-none"
          disabled={loading}
        />
        <Button onClick={handleTest} disabled={loading || !message.trim()}>
          <Send className="w-4 h-4" />
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </div>

      {/* Respuesta */}
      {response && (
        <div
          className={`rounded-lg p-4 ${
            isErrorResponse(response)
              ? "bg-red-50 border border-red-200"
              : response.type === "fallback"
              ? "bg-yellow-50 border border-yellow-200"
              : "bg-green-50 border border-green-200"
          }`}
        >
          {isErrorResponse(response) ? (
            <p className="text-red-700 text-sm">{response.error}</p>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-medium text-gray-900">Respuesta del bot:</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    response.type === "answer"
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {response.type === "answer" ? "Respuesta encontrada" : "Fallback"}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-3">{response.reply}</p>

              {/* Metadata */}
              {response.meta && (
                <div className="text-xs text-gray-600 space-y-1 pt-3 border-t border-gray-200">
                  {response.faqId && (
                    <p>
                      <span className="font-medium">FAQ ID:</span> {response.faqId}
                    </p>
                  )}
                  {response.confidence !== undefined && (
                    <p>
                      <span className="font-medium">Confianza:</span>{" "}
                      {(response.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                  {response.meta.matchedQuestion && (
                    <p>
                      <span className="font-medium">Pregunta coincidente:</span>{" "}
                      {response.meta.matchedQuestion}
                    </p>
                  )}
                  {response.meta.tokens && response.meta.tokens.length > 0 && (
                    <p>
                      <span className="font-medium">Tokens buscados:</span>{" "}
                      {response.meta.tokens.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
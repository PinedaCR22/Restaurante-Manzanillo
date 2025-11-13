// src/pages/admin/AdminFaqChatbotPage.tsx

import { useMemo, useState } from "react";
import { useFaqAdmin } from "../../hooks/faq/useFaqAdmin";
import { useChatbotAdmin } from "../../hooks/chatbot/useChatbotAdmin";
import FaqFormModal from "../../components/admin/faq/FaqFormModal";
import FaqRow from "../../components/admin/faq/FaqRow";
import ChatbotMessageFormModal from "../../components/admin/chatbot/ChatbotMessageFormModal";
import ChatbotTestPanel from "../../components/admin/chatbot/ChatbotTestPanel";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { FaqItem, FaqForm } from "../../types/faqs/faq";
import type { ChatbotMessage, ChatbotMessageForm } from "../../types/chatbot/chatbot";
import { HelpCircle, Bot, RefreshCw, Plus, Power, Trash2, Pencil } from "lucide-react";

type TabKey = "faq" | "chatbot";

export default function AdminFaqChatbotPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("faq");

  // FAQs
  const faqHook = useFaqAdmin();
  const [query, setQuery] = useState("");
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [confirmDeleteFaq, setConfirmDeleteFaq] = useState<number | null>(null);
  const [savingFaq, setSavingFaq] = useState(false);

  // Chatbot
  const chatbotHook = useChatbotAdmin();
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<ChatbotMessage | null>(null);
  const [confirmDeleteMessage, setConfirmDeleteMessage] = useState<number | null>(null);
  const [savingMessage, setSavingMessage] = useState(false);
  const [reloading, setReloading] = useState(false);

  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  // 🔍 Filtro FAQs
  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqHook.items;
    return faqHook.items.filter((faq) => {
      const inQuestion = faq.question.toLowerCase().includes(q);
      const inAnswer = faq.answer.toLowerCase().includes(q);
      const tags = Array.isArray(faq.tags) ? faq.tags : [];
      const inTags = tags.some((tag) => tag.toLowerCase().includes(q));
      return inQuestion || inAnswer || inTags;
    });
  }, [faqHook.items, query]);

  const sortedFaqs = useMemo(
    () => [...filteredFaqs].sort((a, b) => a.displayOrder - b.displayOrder),
    [filteredFaqs]
  );

  const totalFaqPages = Math.max(1, Math.ceil(sortedFaqs.length / PAGE_SIZE));
  const pagedFaqs = sortedFaqs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Mensajes del chatbot ordenados
  const sortedMessages = useMemo(
    () => [...chatbotHook.messages].sort((a, b) => a.displayOrder - b.displayOrder),
    [chatbotHook.messages]
  );

  // ⚙️ Acciones FAQs
  async function handleSaveFaq(payload: FaqForm) {
    setSavingFaq(true);
    try {
      if (editingFaq) {
        await faqHook.onEdit(editingFaq.id, payload);
      } else {
        await faqHook.onCreate({ ...payload, displayOrder: payload.displayOrder || faqHook.nextOrder });
      }
      setFaqModalOpen(false);
      setEditingFaq(null);
    } finally {
      setSavingFaq(false);
    }
  }

  async function handleDeleteFaq(id: number) {
    await faqHook.onDelete(id);
    setConfirmDeleteFaq(null);
  }

  // ⚙️ Acciones Chatbot
  async function handleToggleChatbot() {
    if (!chatbotHook.setting) return;
    await chatbotHook.toggleChatbot(!chatbotHook.setting.isEnabled);
  }

  async function handleReloadIndex() {
    setReloading(true);
    try {
      await chatbotHook.reloadIndex();
    } finally {
      setReloading(false);
    }
  }

  async function handleSaveMessage(payload: ChatbotMessageForm) {
    setSavingMessage(true);
    try {
      if (editingMessage) {
        await chatbotHook.updateMessage(editingMessage.id, payload);
      } else {
        await chatbotHook.createMessage({ ...payload, displayOrder: payload.displayOrder || chatbotHook.nextOrder });
      }
      setMessageModalOpen(false);
      setEditingMessage(null);
    } finally {
      setSavingMessage(false);
    }
  }

  async function handleDeleteMessage(id: number) {
    await chatbotHook.deleteMessage(id);
    setConfirmDeleteMessage(null);
  }

  return (
    <section className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0D784A] flex items-center gap-2">
          <HelpCircle className="w-6 h-6" />
          Preguntas Frecuentes & Chatbot
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-full p-0.5 flex text-sm sm:text-base">
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeTab === "faq" ? "bg-[#0D784A] text-white" : "text-gray-700 hover:text-[#0D784A]"
            }`}
          >
            <HelpCircle className="inline w-4 h-4 mr-1" />
            Preguntas Frecuentes
          </button>
          <button
            onClick={() => setActiveTab("chatbot")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeTab === "chatbot" ? "bg-[#0D784A] text-white" : "text-gray-700 hover:text-[#0D784A]"
            }`}
          >
            <Bot className="inline w-4 h-4 mr-1" />
            Chatbot
          </button>
        </div>
      </div>

      {/* ========================== TAB: FAQs ========================== */}
      {activeTab === "faq" && (
        <>
          {/* Resumen FAQs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#E6F4EE] border border-[#C6E3D3] rounded-2xl shadow-sm p-4 text-center">
              <h3 className="text-sm text-slate-600 font-medium">Total de FAQs</h3>
              <p className="text-3xl font-extrabold text-[#0D784A] mt-1">{faqHook.items.length}</p>
            </div>
            <div className="bg-[#E9F8EF] border border-[#B7E4C3] rounded-2xl shadow-sm p-4 text-center">
              <h3 className="text-sm text-slate-600 font-medium">Visibles</h3>
              <p className="text-3xl font-extrabold text-[#0D784A] mt-1">
                {faqHook.items.filter((f) => f.isVisible).length}
              </p>
            </div>
            <div className="bg-[#FDECEC] border border-[#F5C2C2] rounded-2xl shadow-sm p-4 text-center">
              <h3 className="text-sm text-slate-600 font-medium">Ocultas</h3>
              <p className="text-3xl font-extrabold text-red-600 mt-1">
                {faqHook.items.filter((f) => !f.isVisible).length}
              </p>
            </div>
          </div>

          {/* Buscador + Botón */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por pregunta, respuesta o tags..."
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0D784A] focus:ring-1 focus:ring-[#0D784A] outline-none"
            />
            <Button onClick={() => { setEditingFaq(null); setFaqModalOpen(true); }}>
              <Plus className="w-4 h-4" /> Nueva FAQ
            </Button>
          </div>

          {/* Listado FAQs */}
          <div className="space-y-4 min-h-[200px]">
            {faqHook.loading ? (
              <p className="text-center text-gray-500 py-8">Cargando…</p>
            ) : pagedFaqs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {query ? "No se encontraron FAQs." : "No hay FAQs registradas."}
              </p>
            ) : (
              pagedFaqs.map((faq) => (
                <FaqRow
                  key={faq.id}
                  item={faq}
                  onEdit={(item) => { setEditingFaq(item); setFaqModalOpen(true); }}
                  onDelete={(id) => setConfirmDeleteFaq(id)}
                  onChangeOrder={faqHook.onReorder}
                  onToggleVisible={faqHook.onToggleVisible}
                />
              ))
            )}
          </div>

          {/* Paginación */}
          {totalFaqPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination page={page} total={totalFaqPages} onChange={setPage} />
            </div>
          )}
        </>
      )}

      {/* ========================== TAB: CHATBOT ========================== */}
      {activeTab === "chatbot" && (
        <>
          {/* Estado del Chatbot */}
          <div className="bg-white rounded-xl border border-[#C6E3D3] shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#0D784A] mb-1 flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Estado del Chatbot
                </h3>
                <p className="text-sm text-gray-600">
                  {chatbotHook.setting?.isEnabled
                    ? "El chatbot está activo y respondiendo a los usuarios."
                    : "El chatbot está desactivado."}
                </p>
              </div>
              <button
                onClick={handleToggleChatbot}
                disabled={chatbotHook.loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  chatbotHook.setting?.isEnabled
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Power className="w-4 h-4" />
                {chatbotHook.setting?.isEnabled ? "Activado" : "Desactivado"}
              </button>
            </div>
          </div>

          {/* Herramientas */}
          <div className="bg-white rounded-xl border border-[#C6E3D3] shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-[#0D784A] mb-3">Herramientas</h3>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleReloadIndex} disabled={reloading}>
                <RefreshCw className={`w-4 h-4 ${reloading ? "animate-spin" : ""}`} />
                {reloading ? "Recargando..." : "Recargar índice de FAQs"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recarga el índice después de modificar FAQs para que el chatbot use la información actualizada.
            </p>
          </div>

          {/* Panel de prueba */}
          <div className="mb-6">
            <ChatbotTestPanel />
          </div>

          {/* Mensajes automáticos */}
          <div className="bg-white rounded-xl border border-[#C6E3D3] shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#0D784A]">Mensajes Automáticos</h3>
              <Button size="sm" onClick={() => { setEditingMessage(null); setMessageModalOpen(true); }}>
                <Plus className="w-4 h-4" /> Nuevo Mensaje
              </Button>
            </div>

            {chatbotHook.loading ? (
              <p className="text-center text-gray-500 py-6">Cargando mensajes…</p>
            ) : sortedMessages.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No hay mensajes configurados.</p>
            ) : (
              <div className="space-y-3">
                {sortedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E6F4EE] text-[#0D784A] font-medium">
                            {msg.kind}
                          </span>
                          <span className={`text-xs ${msg.isActive ? "text-green-600" : "text-gray-400"}`}>
                            {msg.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{msg.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingMessage(msg); setMessageModalOpen(true); }}
                          className="p-1.5 rounded-lg border border-[#0D784A] text-[#0D784A] hover:bg-[#E6F4EE]"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteMessage(msg.id)}
                          className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      <FaqFormModal
        open={faqModalOpen}
        initial={editingFaq || undefined}
        saving={savingFaq}
        onClose={() => { setFaqModalOpen(false); setEditingFaq(null); }}
        onSubmit={handleSaveFaq}
      />

      <ChatbotMessageFormModal
        open={messageModalOpen}
        initial={editingMessage || undefined}
        saving={savingMessage}
        onClose={() => { setMessageModalOpen(false); setEditingMessage(null); }}
        onSubmit={handleSaveMessage}
      />

      {/* Confirmaciones */}
      <ConfirmDialog
        open={!!confirmDeleteFaq}
        message="¿Seguro que deseas eliminar esta FAQ?"
        onCancel={() => setConfirmDeleteFaq(null)}
        onConfirm={() => {
          if (confirmDeleteFaq !== null) {
            handleDeleteFaq(confirmDeleteFaq);
          }
        }}
      />

      <ConfirmDialog
        open={!!confirmDeleteMessage}
        message="¿Seguro que deseas eliminar este mensaje?"
        onCancel={() => setConfirmDeleteMessage(null)}
        onConfirm={() => {
          if (confirmDeleteMessage !== null) {
            handleDeleteMessage(confirmDeleteMessage);
          }
        }}
      />
    </section>
  );
}
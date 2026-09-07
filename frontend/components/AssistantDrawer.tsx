'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Sparkles, X, Send, Bot, User, BookOpen, 
  ExternalLink, AlertTriangle, Maximize2, RefreshCw, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { api, AssistantChatResponse, AssistantCitation } from '@/lib/api';
import { useTranslation } from '@/lib/i18n-context';
import { useAuth } from '@/lib/auth-context';

interface AssistantDrawerProps {
  productId?: string;
  productName?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: AssistantCitation[];
  response_type?: 'grounded_answer' | 'insufficient_evidence' | 'safe_abstention';
  safe_abstention?: boolean;
}

export default function AssistantDrawer({ productId, productName }: AssistantDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { language, t } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: productName
          ? t('drawer_welcome_product')
          : t('drawer_welcome_generic')
      }
    ]);
  }, [productName, language, t]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const handleSend = async (customQuery?: string) => {
    const q = (customQuery || input).trim();
    if (!q || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatAssistant({
        message: q,
        product_id: productId,
        language: language
      });
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: res.response,
        citations: res.citations,
        response_type: res.response_type,
        safe_abstention: res.safe_abstention
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: `e-${Date.now()}`, sender: 'assistant', text: t('assistant_error_connect') }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Trigger Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FF7828] to-[#FF9933] hover:from-[#E05E10] hover:to-[#FF7828] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-orange-500/30 transition-all transform hover:scale-105 font-bold text-xs"
          title={t('drawer_btn_ask')}
        >
          <Sparkles size={16} className="animate-pulse" />
          <span className="hidden sm:inline">{t('drawer_title')}</span>
        </button>
      </div>

      {/* Slide-over Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#0B132B] border-l border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-[#070D1B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[#FF7828] flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-none">
                {t('drawer_title')}
              </h3>
              {productName && (
                <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[220px]">
                  {t('drawer_context_label')} {productName}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href={productId ? `/assistant?product_id=${productId}` : '/assistant'}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={t('drawer_fullscreen')}
            >
              <Maximize2 size={13} />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#070D1B]/40 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2.5 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#FF7828] text-white rounded-tr-none font-medium'
                    : 'bg-[#121E36] text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line text-[11px]">{m.text}</div>

                {m.response_type === 'safe_abstention' && (
                  <div className="mt-2 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] flex items-center gap-1.5">
                    <ShieldAlert size={12} className="text-rose-400 flex-shrink-0" />
                    <span>{t('assistant_evasion_badge')}</span>
                  </div>
                )}

                {m.response_type === 'insufficient_evidence' && (
                  <div className="mt-2 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] flex items-center gap-1.5">
                    <AlertTriangle size={12} className="text-amber-400 flex-shrink-0" />
                    <span>{t('assistant_insufficient_badge')}</span>
                  </div>
                )}

                {(m.response_type === 'grounded_answer' || (!m.response_type && !m.safe_abstention && m.citations && m.citations.length > 0)) && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-semibold">
                    <CheckCircle2 size={10} className="text-emerald-400 flex-shrink-0" />
                    <span>{t('assistant_grounded_badge')}</span>
                  </div>
                )}

                {(!m.response_type && m.safe_abstention) && (
                  <div className="mt-2 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] flex items-center gap-1.5">
                    <AlertTriangle size={12} className="text-amber-400 flex-shrink-0" />
                    <span>{t('assistant_abstention_badge')}</span>
                  </div>
                )}

                {m.citations && m.citations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-700/60 space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      {t('drawer_verified_sources')}
                    </span>
                    {m.citations.slice(0, 2).map((c, i) => (
                      <div key={i} className="text-[10px] text-slate-300 bg-[#070D1B]/80 p-1.5 rounded border border-slate-800">
                        <strong>{c.title}</strong> ({c.clause})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

            {loading && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400 p-2 bg-[#121E36]/60 rounded-lg border border-slate-800">
                <RefreshCw size={12} className="animate-spin text-[#FF7828]" />
                <span>{t('drawer_checking')}</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-1.5 bg-[#070D1B] border-t border-slate-800/80 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend(t('drawer_chip_standards'))}
              className="whitespace-nowrap px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              {t('drawer_chip_standards')}
            </button>
            <button
              onClick={() => handleSend(t('drawer_chip_tests'))}
              className="whitespace-nowrap px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              {t('drawer_chip_tests')}
            </button>
            <button
              onClick={() => handleSend(t('drawer_chip_crs'))}
              className="whitespace-nowrap px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              {t('drawer_chip_crs')}
            </button>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-[#0B132B] border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('drawer_placeholder')}
              disabled={loading}
              className="flex-1 bg-[#070D1B] border border-slate-800 focus:border-[#FF7828] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-[#FF7828] hover:bg-[#E05E10] disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors"
            >
              <Send size={13} />
            </button>
          </form>

        </div>
    </>
  );
}

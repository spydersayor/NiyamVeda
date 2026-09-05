'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  ExternalLink,
  AlertTriangle,
  Layers,
  RefreshCw,
} from 'lucide-react';

import {
  api,
  Product,
  AssistantCitation,
} from '@/lib/api';

import { useTranslation } from '@/lib/i18n-context';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: AssistantCitation[];
  safe_abstention?: boolean;
  abstention_reason?: string;
  timestamp: string;
}

const DEFAULT_SUGGESTIONS = [
  'What BIS standards apply to an electric kettle?',
  'What are the requirements for an RO water purifier under IS 16240?',
  'What are the food grade requirements for stainless steel cookware under IS 6911?',
  'What is the difference between CRS registration and ISI mark?',
  'What are the glow-wire test requirements under IS 302 Clause 30.2?',
];

function AssistantPageContent() {
  const searchParams = useSearchParams();
  const urlProductId = searchParams.get('product_id') || '';

  const { language, t } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] =
    useState<string>(urlProductId);

  const [inputQuery, setInputQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text:
        'Welcome to the **NiyamVeda Regulatory Intelligence Assistant**.\n\n' +
        'I provide source-grounded guidance on Indian Standards (BIS) and mandatory Quality Control Orders (QCOs) for electrical appliances, drinking water systems, and stainless steel cookware.\n\n' +
        'You can ask general regulatory questions or select one of your products to evaluate requirements specific to your technical parameters.',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /*
   * Load user's products.
   */
  useEffect(() => {
    async function loadProducts() {
      try {
        const prods = await api.listProducts();

        setProducts(prods || []);

        if (
          urlProductId &&
          prods.some((p) => p.id === urlProductId)
        ) {
          setSelectedProductId(urlProductId);
        }
      } catch (err) {
        console.error(
          'Failed to load products for assistant',
          err
        );
      }
    }

    loadProducts();
  }, [urlProductId]);

  /*
   * Automatically scroll to the latest message.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isSubmitting]);

  /*
   * Send assistant message.
   */
  const handleSendMessage = async (
    queryToSend?: string
  ) => {
    const query = (
      queryToSend || inputQuery
    ).trim();

    if (!query || isSubmitting) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInputQuery('');
    setIsSubmitting(true);

    try {
      const res = await api.chatAssistant({
        message: query,
        product_id:
          selectedProductId || undefined,
        language: language,

        history: messages
          .slice(-4)
          .map((m) => ({
            role: m.sender,
            content: m.text,
          })),
      });

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: res.response,
        citations: res.citations || [],
        safe_abstention:
          res.safe_abstention,
        abstention_reason:
          res.abstention_reason,

        timestamp:
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
      };

      setMessages((prev) => [
        ...prev,
        assistantMsg,
      ]);
    } catch (err) {
      console.error(
        'Assistant request failed',
        err
      );

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',

        text:
          'We encountered a temporary connection issue. Please verify your query or try again.',

        timestamp:
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
      };

      setMessages((prev) => [
        ...prev,
        errorMsg,
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProductObj =
    products.find(
      (p) => p.id === selectedProductId
    );

  return (
    <div className="min-h-[92vh] flex flex-col max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4">

      {/* =====================================================
          ASSISTANT HEADER
      ====================================================== */}

      <div className="bg-[#0B132B]/85 border border-slate-800 rounded-xl p-4 sm:p-5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7828] to-[#FF9933] flex items-center justify-center text-white shadow-md shadow-orange-500/20 flex-shrink-0">
            <Sparkles size={20} />
          </div>

          <div>

            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">

              <span>
                {t('assistant_title')}
              </span>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                BIS GROUNDED
              </span>

            </h1>

            <p className="text-xs text-slate-400 mt-0.5">
              {t('assistant_subtitle')}
            </p>

          </div>
        </div>

        {/* =================================================
            PRODUCT CONTEXT DROPDOWN
        ================================================== */}

        <div className="flex items-center gap-2 bg-[#070D1B] border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs">

          <Layers
            size={14}
            className="text-[#FF7828] flex-shrink-0"
          />

          <div className="flex flex-col">

            <span className="text-[10px] text-slate-400 font-medium">
              {t('assistant_select_product')}
            </span>

            <select
              value={selectedProductId}
              onChange={(e) =>
                setSelectedProductId(
                  e.target.value
                )
              }
              className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer pr-1"
            >

              <option
                value=""
                className="bg-[#0B1426] text-slate-300"
              >
                {t('assistant_no_product')}
              </option>

              {products.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  className="bg-[#0B1426] text-white"
                >
                  {p.product_name} ({p.category})
                </option>
              ))}

            </select>

          </div>
        </div>

      </div>

      {/* =====================================================
          ACTIVE PRODUCT CONTEXT
      ====================================================== */}

      {selectedProductObj && (
        <div className="bg-[#1E355B]/40 border border-sky-500/30 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">

          <div className="flex items-center gap-2">

            <span className="font-semibold text-sky-400">
              Context Active:
            </span>

            <span>
              Evaluating queries against{' '}
              <strong>
                {selectedProductObj.product_name}
              </strong>{' '}
              (
              {selectedProductObj.operating_voltage ||
                '230V AC'}
              ,{' '}
              {selectedProductObj.material_composition ||
                'Material'}
              )
            </span>

          </div>

          <button
            onClick={() =>
              setSelectedProductId('')
            }
            className="text-[11px] text-slate-400 hover:text-slate-200 underline"
          >
            Clear Context
          </button>

        </div>
      )}

      {/* =====================================================
          CHAT MESSAGES
      ====================================================== */}

      <div className="flex-1 bg-[#070D1B]/70 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-6 min-h-[450px] max-h-[580px] backdrop-blur-md">

        {messages.map((msg) => (

          <div
            key={msg.id}
            className={`flex gap-3.5 ${
              msg.sender === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >

            {/* Assistant avatar */}

            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-[#FF7828] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={16} />
              </div>
            )}

            {/* Message bubble */}

            <div
              className={`max-w-2xl space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-[#FF7828] text-white rounded-2xl rounded-tr-none px-4 py-3 text-xs font-medium shadow-md shadow-orange-500/10'
                  : 'bg-[#0B132B] text-slate-200 border border-slate-800 rounded-2xl rounded-tl-none px-5 py-4 text-xs shadow-md'
              }`}
            >

              {/* Message text */}

              <div className="whitespace-pre-line leading-relaxed">
                {msg.text}
              </div>

              {/* =================================================
                  SAFE ABSTENTION
              ================================================== */}

              {msg.safe_abstention && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">

                  <div className="flex items-center gap-2 font-bold text-[11px]">

                    <AlertTriangle
                      size={14}
                      className="text-amber-400"
                    />

                    <span>
                      {t(
                        'assistant_abstention_badge'
                      )}
                    </span>

                  </div>

                  {msg.abstention_reason && (
                    <div className="text-[11px] text-amber-200/90 pl-5">
                      {msg.abstention_reason}
                    </div>
                  )}

                </div>
              )}

              {/* =================================================
                  CITATIONS
              ================================================== */}

              {msg.citations &&
                msg.citations.length > 0 && (

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">

                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">

                      <BookOpen
                        size={12}
                        className="text-[#FF7828]"
                      />

                      <span>
                        {t(
                          'assistant_citations'
                        )}
                      </span>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                      {msg.citations.map(
                        (cit, idx) => (

                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-[#070D1B]/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-1"
                          >

                            <div className="flex items-center justify-between">

                              <span className="font-bold text-slate-200 text-[11px] truncate">
                                {cit.title}
                              </span>

                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                                VERIFIED
                              </span>

                            </div>

                            <div className="text-[10px] text-slate-400 truncate">
                              {cit.clause}
                            </div>

                            {cit.official_url && (
                              <a
                                href={
                                  cit.official_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#FF9933] hover:underline pt-0.5"
                              >

                                <span>
                                  Official Standard Source
                                </span>

                                <ExternalLink
                                  size={10}
                                />

                              </a>
                            )}

                          </div>

                        )
                      )}

                    </div>

                  </div>
                )}

              {/* Timestamp */}

              <div className="text-[10px] text-right text-slate-400/80 pt-1">
                {msg.timestamp}
              </div>

            </div>

            {/* User avatar */}

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-[#FF7828] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={16} />
              </div>
            )}

          </div>

        ))}

        {/* =====================================================
            LOADING STATE
        ====================================================== */}

        {isSubmitting && (
          <div className="flex gap-3.5 justify-start">

            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-[#FF7828] flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>

            <div className="bg-[#0B132B] border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2 text-slate-400">

              <RefreshCw
                size={14}
                className="animate-spin text-[#FF7828]"
              />

              <span>
                Retrieving authoritative Indian Standards & evaluating grounded context...
              </span>

            </div>

          </div>
        )}

        <div ref={messagesEndRef} />

      </div>

      {/* =====================================================
          QUICK SUGGESTIONS
      ====================================================== */}

      <div className="space-y-1.5">

        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {t('assistant_quick_queries')}:
        </span>

        <div className="flex flex-wrap gap-2">

          {DEFAULT_SUGGESTIONS.map(
            (suggestion, idx) => (

              <button
                key={idx}
                onClick={() =>
                  handleSendMessage(
                    suggestion
                  )
                }
                disabled={isSubmitting}
                className="text-[11px] font-medium bg-[#0B132B] hover:bg-[#1E293B] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition-colors text-left"
              >
                {suggestion}
              </button>

            )
          )}

        </div>
      </div>

      {/* =====================================================
          CHAT INPUT
      ====================================================== */}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center"
      >

        <input
          type="text"
          value={inputQuery}
          onChange={(e) =>
            setInputQuery(e.target.value)
          }
          placeholder={t(
            'assistant_placeholder'
          )}
          disabled={isSubmitting}
          className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF7828] focus:ring-1 focus:ring-[#FF7828] rounded-xl pl-4 pr-24 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
        />

        <button
          type="submit"
          disabled={
            !inputQuery.trim() ||
            isSubmitting
          }
          className="absolute right-2 px-3 py-1.5 bg-[#FF7828] hover:bg-[#E05E10] disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
        >

          <span>
            {t('assistant_send')}
          </span>

          <Send size={12} />

        </button>

      </form>

      {/* =====================================================
          DISCLAIMER
      ====================================================== */}

      <p className="text-[10px] text-center text-slate-500 leading-tight">
        {t('assistant_disclaimer')}
      </p>

    </div>
  );
}

/*
 * IMPORTANT:
 *
 * useSearchParams() is used inside AssistantPageContent.
 * The Suspense boundary here prevents the Next.js 14
 * prerender/build error:
 *
 * "useSearchParams() should be wrapped in a suspense boundary"
 */

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[92vh] flex items-center justify-center text-slate-400 text-sm">
          Loading Regulatory Assistant...
        </div>
      }
    >
      <AssistantPageContent />
    </Suspense>
  );
}
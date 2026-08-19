import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Send, MapPin, Bot, Star } from 'lucide-react';
import { askAssistant } from '../api/assistant';
import type { AssistantResponse, HotelPriceResponse } from '../types/api';

type ChatMessage =
    | { role: 'user'; text: string }
    | { role: 'assistant'; text: string; hotels: HotelPriceResponse[]; dates?: { checkIn: string | null; checkOut: string | null } };

const SUGGESTIONS = [
    'A hotel in Las Vegas with a pool',
    'Pet friendly stay in Boston this weekend',
    'How many hotels are in New York?',
];

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=60';
const GREETED_KEY = 'stanza.assistantGreeted';

export default function ChatAssistant() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [showGreeting, setShowGreeting] = useState(false);
    const [unread, setUnread] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Pop a friendly greeting + notification badge a moment after landing (first visit only).
    useEffect(() => {
        if (localStorage.getItem(GREETED_KEY)) return;
        const t = setTimeout(() => {
            setShowGreeting(true);
            setUnread(true);
        }, 1800);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, loading, open]);

    function toggle() {
        setOpen((o) => {
            const next = !o;
            if (next) {
                setUnread(false);
                setShowGreeting(false);
                localStorage.setItem(GREETED_KEY, '1');
            }
            return next;
        });
    }

    async function send(text: string) {
        const message = text.trim();
        if (!message || loading) return;
        setInput('');
        setMessages((m) => [...m, { role: 'user', text: message }]);
        setLoading(true);
        try {
            const res: AssistantResponse = await askAssistant(message);
            setMessages((m) => [
                ...m,
                { role: 'assistant', text: res.reply, hotels: res.hotels ?? [], dates: { checkIn: res.checkInDate, checkOut: res.checkOutDate } },
            ]);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Something went wrong.';
            setMessages((m) => [...m, { role: 'assistant', text: `Sorry — ${msg}`, hotels: [] }]);
        } finally {
            setLoading(false);
        }
    }

    function openHotel(hotel: HotelPriceResponse, dates?: { checkIn: string | null; checkOut: string | null }) {
        const params = new URLSearchParams();
        if (dates?.checkIn) params.set('startDate', dates.checkIn);
        if (dates?.checkOut) params.set('endDate', dates.checkOut);
        params.set('roomsCount', '1');
        setOpen(false);
        navigate(`/hotels/${hotel.id}?${params.toString()}`);
    }

    return (
        <>
            {/* keyframes for entrance + typing dots (self-contained, no extra deps) */}
            <style>{`
                @keyframes stanzaPop { from { opacity: 0; transform: translateY(14px) scale(.96); } to { opacity: 1; transform: none; } }
                @keyframes stanzaBlink { 0%, 80%, 100% { opacity: .25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
            `}</style>

            {/* Greeting bubble / notification toast */}
            {showGreeting && !open && (
                <div
                    className="fixed bottom-28 right-6 z-50 flex max-w-[240px] items-start gap-2 rounded-2xl rounded-br-sm border border-slate-200 bg-white px-3 py-2.5 shadow-xl"
                    style={{ animation: 'stanzaPop .3s ease-out' }}
                >
                    <span className="mt-0.5 text-lg leading-none">👋</span>
                    <button onClick={toggle} className="text-left text-sm text-slate-700">
                        Hi! Need help finding a stay? <span className="font-semibold text-indigo-600">Ask me anything.</span>
                    </button>
                    <button
                        onClick={() => setShowGreeting(false)}
                        aria-label="Dismiss"
                        className="ml-1 rounded-full p-0.5 text-slate-400 hover:bg-slate-100"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            {/* Floating launcher */}
            <button
                onClick={toggle}
                aria-label="Open AI assistant"
                className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-600/40 transition hover:scale-105"
            >
                {/* pulse ring when there's an unread notification */}
                {unread && !open && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-60" />
                )}
                <span className="relative">{open ? <X className="h-7 w-7" /> : <Sparkles className="h-7 w-7" />}</span>
                {/* red unread badge */}
                {unread && !open && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-[11px] font-bold text-white">
                        1
                    </span>
                )}
            </button>

            {/* Chat panel */}
            {open && (
                <div
                    className="fixed bottom-28 right-6 z-50 flex h-[72vh] max-h-[600px] w-[92vw] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
                    style={{ animation: 'stanzaPop .28s ease-out' }}
                >
                    {/* Header */}
                    <div className="relative flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-white">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                            <Bot className="h-5 w-5" />
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold leading-tight">Stanza Assistant</p>
                            <p className="flex items-center gap-1 text-xs text-indigo-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online · AI-powered
                            </p>
                        </div>
                        <button onClick={toggle} aria-label="Close" className="rounded-full p-1.5 transition hover:bg-white/15">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100/60 p-3.5">
                        {messages.length === 0 && (
                            <div className="space-y-3">
                                <div className="flex items-end gap-2">
                                    <Avatar />
                                    <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm">
                                        Hi there! 👋 Tell me where you want to stay and what you need — I'll find matching hotels or answer questions about them.
                                    </div>
                                </div>
                                <p className="pl-9 text-xs font-medium uppercase tracking-wide text-slate-400">Try asking</p>
                                <div className="space-y-2 pl-9">
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => send(s)}
                                            className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 hover:shadow"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((m, i) =>
                            m.role === 'user' ? (
                                <div key={i} className="flex justify-end">
                                    <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-br from-indigo-600 to-violet-600 px-3.5 py-2.5 text-sm text-white shadow-sm">
                                        {m.text}
                                    </div>
                                </div>
                            ) : (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-end gap-2">
                                        <Avatar />
                                        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm">
                                            {m.text}
                                        </div>
                                    </div>
                                    {m.hotels.length > 0 && (
                                        <div className="space-y-2 pl-9">
                                            {m.hotels.map((h) => (
                                                <button
                                                    key={h.id}
                                                    onClick={() => openHotel(h, m.dates)}
                                                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                                                >
                                                    <img src={h.photos?.[0] ?? FALLBACK} alt={h.name} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-slate-900">{h.name}</p>
                                                        <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                                                            <MapPin className="h-3 w-3" /> {h.city}
                                                        </p>
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {h.amenities?.slice(0, 2).map((a) => (
                                                                <span key={a} className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">{a}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0 text-right">
                                                        <p className="text-sm font-bold text-indigo-600">${Math.round(h.price)}</p>
                                                        <p className="text-[10px] text-slate-400">/ night</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ),
                        )}

                        {loading && (
                            <div className="flex items-end gap-2">
                                <Avatar />
                                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                                    {[0, 1, 2].map((d) => (
                                        <span
                                            key={d}
                                            className="h-2 w-2 rounded-full bg-indigo-400"
                                            style={{ animation: 'stanzaBlink 1.2s infinite', animationDelay: `${d * 0.18}s` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); send(input); }}
                        className="flex items-center gap-2 border-t border-slate-200 bg-white p-2.5"
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about a stay…"
                            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                            aria-label="Send"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>

                    <p className="flex items-center justify-center gap-1 border-t border-slate-100 bg-white pb-2 pt-1 text-[10px] text-slate-400">
                        <Star className="h-2.5 w-2.5" /> Powered by AI · results come from Stanza's live listings
                    </p>
                </div>
            )}
        </>
    );
}

function Avatar() {
    return (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
            <Bot className="h-4 w-4" />
        </div>
    );
}
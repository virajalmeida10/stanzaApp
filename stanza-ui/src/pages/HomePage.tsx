import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck, Zap, BadgeDollarSign, Headphones, Building2, MapPin, Users, Star, ArrowRight,
} from 'lucide-react';
import Hero from '../components/Hero';

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (base: string, n: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
};

const CITY_FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';

const STATS = [
    { icon: <Building2 className="h-6 w-6" />, end: 2000, suffix: '+', label: 'Hotels' },
    { icon: <MapPin className="h-6 w-6" />, end: 60, suffix: '+', label: 'US cities' },
    { icon: <Users className="h-6 w-6" />, end: 25, suffix: 'k+', label: 'Happy guests' },
    { icon: <Star className="h-6 w-6" />, end: 99.9, suffix: '%', label: 'Secure uptime', decimals: 1 },
];

const FEATURES = [
    { icon: <ShieldCheck className="h-6 w-6" />, title: 'Verified stays', body: 'Every property is reviewed and confirmed before it goes live.' },
    { icon: <Zap className="h-6 w-6" />, title: 'Instant confirmation', body: 'Real-time inventory means your room is locked in the moment you pay.' },
    { icon: <BadgeDollarSign className="h-6 w-6" />, title: 'Best-price guarantee', body: 'Transparent pricing with taxes shown upfront — no surprises.' },
    { icon: <Headphones className="h-6 w-6" />, title: '24/7 support', body: 'Real people on call any time, before and during your trip.' },
];

const CITIES = [
    { name: 'New York', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=70' },
    { name: 'Las Vegas', img: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=800&q=70' },
    { name: 'San Francisco', img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=70' },
    { name: 'Chicago', img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=70' },
    { name: 'Boston', img: 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?auto=format&fit=crop&w=800&q=70' },
    { name: 'Virginia', img: 'https://images.unsplash.com/photo-1617293834026-5eefd0a54b8f?auto=format&fit=crop&w=800&q=70' },
];

export default function HomePage() {
    const navigate = useNavigate();

    function goToCity(city: string) {
        const start = today();
        const params = new URLSearchParams({ city, startDate: start, endDate: plusDays(start, 1), roomsCount: '1' });
        navigate(`/search?${params.toString()}`);
    }

    return (
        <div className="space-y-14">
            <Hero />

            {/* Stat band */}
            <section className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-4">
                {STATS.map((s) => (
                    <div key={s.label} className="flex flex-col items-center text-center">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">{s.icon}</div>
                        <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals} />
                        <p className="text-sm text-slate-500">{s.label}</p>
                    </div>
                ))}
            </section>

            {/* Why book with Stanza */}
            <section>
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Why book with Stanza</h2>
                    <p className="mt-2 text-slate-500">Everything a modern traveler expects — built in.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">{f.icon}</div>
                            <h3 className="font-semibold text-slate-900">{f.title}</h3>
                            <p className="mt-1 text-sm text-slate-500">{f.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popular destinations */}
            <section>
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Popular destinations</h2>
                        <p className="mt-2 text-slate-500">Where travelers are booking this week.</p>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {CITIES.map((c) => (
                        <button
                            key={c.name}
                            onClick={() => goToCity(c.name)}
                            className="group relative h-48 overflow-hidden rounded-2xl text-left shadow-sm"
                        >
                            <img
                                src={c.img}
                                alt={c.name}
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = CITY_FALLBACK; }}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-4 text-white">
                                <div>
                                    <p className="text-lg font-bold">{c.name}</p>
                                    <p className="flex items-center gap-1 text-xs text-slate-200"><MapPin className="h-3 w-3" /> Explore stays</p>
                                </div>
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:bg-white/30">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* CTA band */}
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-10 text-center text-white">
                <h2 className="text-2xl font-bold md:text-3xl">Ready to find your next stay?</h2>
                <p className="mx-auto mt-2 max-w-xl text-indigo-100">Search 2,000+ hotels across the US with real-time availability and instant confirmation.</p>
                <button
                    onClick={() => goToCity('')}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-indigo-600 shadow-lg transition hover:scale-105"
                >
                    Browse all hotels <ArrowRight className="h-4 w-4" />
                </button>
            </section>
        </div>
    );
}

/** Lightweight count-up that runs once the element scrolls into view. */
function CountUp({ end, suffix = '', decimals = 0 }: { end: number; suffix?: string; decimals?: number }) {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLParagraphElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started.current) {
                started.current = true;
                const duration = 1200;
                const start = performance.now();
                const tick = (now: number) => {
                    const p = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - p, 3);
                    setValue(end * eased);
                    if (p < 1) requestAnimationFrame(tick);
                    else setValue(end);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.4 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [end]);

    return (
        <p ref={ref} className="text-3xl font-extrabold text-slate-900">
            {value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
        </p>
    );
}
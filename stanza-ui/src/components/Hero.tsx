import type { ReactNode } from 'react';
import { ShieldCheck, Zap, BadgeDollarSign, Star } from 'lucide-react';
import SearchBar from './SearchBar';

/**
 * Image-forward hero that "shows" what Stanza is (a modern hotel-booking
 * platform) rather than telling it in a paragraph: a real resort photo, a
 * floating rating chip, trust pills, and the live search bar front and center.
 */
export default function Hero() {
    return (
        <section className="relative">
            <div className="relative overflow-hidden rounded-3xl">
                {/* Background image */}
                <img
                    src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1920&q=80"
                    alt="Luxury hotel"
                    className="h-[380px] w-full object-cover md:h-[440px]"
                />
                {/* Overlays for depth + contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-indigo-900/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />

                {/* Floating "product" chip — top right */}
                <div className="absolute right-5 top-5 hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-white backdrop-blur-md sm:flex">
                    <div className="flex items-center gap-1 text-amber-300">
                        <Star className="h-4 w-4 fill-amber-300" />
                        <span className="text-sm font-bold">4.9</span>
                    </div>
                    <span className="h-4 w-px bg-white/25" />
                    <span className="text-xs text-slate-100">Rated by 25k+ guests</span>
                </div>

                {/* Copy */}
                <div className="absolute inset-x-0 top-0 p-6 md:p-12">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live availability across 60+ US cities
                    </span>
                    <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                        Your next stay,<br />
                        <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">booked in seconds.</span>
                    </h1>

                    {/* Trust pills — convey the product without a wall of text */}
                    <div className="mt-6 flex flex-wrap gap-2.5">
                        <Pill icon={<ShieldCheck className="h-4 w-4" />} label="Verified stays" />
                        <Pill icon={<Zap className="h-4 w-4" />} label="Instant confirmation" />
                        <Pill icon={<BadgeDollarSign className="h-4 w-4" />} label="Best-price guarantee" />
                    </div>
                </div>
            </div>

            {/* Search bar floating over the hero's bottom edge */}
            <div className="relative z-10 mx-auto -mt-10 w-[95%] md:-mt-12">
                <SearchBar />
            </div>
        </section>
    );
}

function Pill({ icon, label }: { icon: ReactNode; label: string }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur-md">
            <span className="text-indigo-200">{icon}</span>
            {label}
        </span>
    );
}
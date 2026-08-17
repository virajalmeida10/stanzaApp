import { useEffect, useRef, useState } from 'react';
import { Building2, MapPin, Users, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Stat = { icon: LucideIcon; end: number; suffix?: string; label: string };
const STATS: Stat[] = [
    { icon: Building2, end: 1000, suffix: '+', label: 'Hotels' },
    { icon: MapPin,      end: 60,   suffix: '+',  label: 'US cities' },
    { icon: Users,       end: 25,   suffix: 'k+', label: 'Happy guests' },
    { icon: ShieldCheck, end: 99.9, suffix: '%',  label: 'Secure uptime' },
];

function useCountUp(end: number, run: boolean, duration = 1400) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!run) return;
        let raf = 0; const start = performance.now();
        const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            setVal(end * (1 - Math.pow(1 - p, 3)));   // easeOutCubic
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [end, run, duration]);
    return val;
}

function StatItem({ stat, run }: { stat: Stat; run: boolean }) {
    const val = useCountUp(stat.end, run);
    const display = Number.isInteger(stat.end) ? Math.round(val) : val.toFixed(1);
    const Icon = stat.icon;
    return (
        <div className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Icon className="h-6 w-6" />
            </span>
            <p className="text-3xl font-extrabold text-slate-900">{display}{stat.suffix}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
        </div>
    );
}

export default function StatBand() {
    const ref = useRef<HTMLDivElement>(null);
    const [run, setRun] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun(true); io.disconnect(); } }, { threshold: 0.4 });
        io.observe(el); return () => io.disconnect();
    }, []);
    return (
        <section ref={ref} className="card grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => <StatItem key={s.label} stat={s} run={run} />)}
        </section>
    );
}
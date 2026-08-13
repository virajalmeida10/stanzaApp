import { Headset, ShieldCheck, BadgePercent } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Feature = { icon: LucideIcon; title: string; subtitle: string };

const FEATURES: Feature[] = [
    { icon: Headset, title: '24/7 Customer Support', subtitle: 'Get help in under 2 minutes' },
    { icon: ShieldCheck, title: 'Secured Payments', subtitle: 'Visa, Mastercard and more' },
    { icon: BadgePercent, title: 'Exclusive Hotel Deals', subtitle: 'Lowest price guarantee on select stays' },
];

export default function TrustBar() {
    return (
        <section className="card grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
                <div key={f.title} className="flex items-center gap-3">
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <f.icon className="h-6 w-6" />
                    </span>
                    <div>
                        <p className="font-semibold text-slate-900">{f.title}</p>
                        <p className="text-sm text-slate-500">{f.subtitle}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}
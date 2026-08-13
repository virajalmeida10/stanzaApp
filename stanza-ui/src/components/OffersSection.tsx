import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getOffers } from '../api/offers';

export default function OffersSection() {
    const scroller = useRef<HTMLDivElement>(null);
    const { data: offers } = useQuery({ queryKey: ['offers'], queryFn: getOffers });

    if (!offers || offers.length === 0) return null;

    const scroll = (dir: number) => scroller.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });

    return (
        <section className="card">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Super Offers</h2>
                <div className="flex gap-2">
                    <button type="button" onClick={() => scroll(-1)} aria-label="Previous offers"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => scroll(1)} aria-label="More offers"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div ref={scroller} className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {offers.map((o) => (
                    <Link key={o.code} to={`/offers/${o.code}`}
                          className="group flex w-[320px] flex-shrink-0 gap-4 rounded-2xl border border-slate-100 p-4 shadow-sm transition hover:shadow-md">
                        <img src={o.image} alt="" className="h-28 w-28 flex-shrink-0 rounded-xl object-cover" />
                        <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold leading-snug text-slate-900">{o.title}</h3>
                                <span className="whitespace-nowrap pt-0.5 text-[10px] font-medium tracking-wide text-slate-400">T&amp;C&apos;S APPLY</span>
                            </div>
                            <div className="mt-2 h-0.5 w-8 rounded bg-rose-400" />
                            <p className="mt-2 text-sm text-slate-500">{o.description}</p>
                            <span className="mt-auto pt-3 text-sm font-semibold text-indigo-600 group-hover:underline">
                                Up to {o.discountPercent}% OFF · BOOK NOW
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
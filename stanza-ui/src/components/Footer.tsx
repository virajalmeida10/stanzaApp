import { Link } from 'react-router-dom';

const LINKS: Record<string, [string, string][]> = {
    Company: [['About us', '/about'], ['Careers', '/careers'], ['Contact', '/contact']],
    Support: [['Help Center', '/help'], ['Cancellation options', '/cancellation'], ['Safety information', '/safety']],
    Legal: [['Terms & Conditions', '/terms'], ['Privacy Policy', '/privacy'], ['Cookie Policy', '/cookies']],
};

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="mt-12 border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h3 className="gradient-text text-lg font-bold">Stanza</h3>
                        <p className="mt-2 text-sm text-slate-500">Real-time availability, dynamic pricing, and instant confirmation for stays across the US.</p>
                        <p className="mt-3 text-sm text-slate-700">
                            24/7 Support:{' '}
                            <a href="tel:+18005550199" className="font-semibold text-indigo-600 hover:underline">+1 (800) 555-0199</a>
                        </p>
                    </div>
                    {Object.entries(LINKS).map(([heading, items]) => (
                        <div key={heading}>
                            <h4 className="text-sm font-semibold text-slate-900">{heading}</h4>
                            <ul className="mt-3 space-y-2 text-sm text-slate-500">
                                {items.map(([label, to]) => (
                                    <li key={to}><Link to={to} className="transition hover:text-indigo-600">{label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 text-sm text-slate-400 sm:flex-row">
                    <p>© {year} Viraj Almeida. All rights reserved.</p>
                    <p>Built by Viraj Almeida</p>
                </div>
            </div>
        </footer>
    );
}
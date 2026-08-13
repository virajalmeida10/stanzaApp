export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="mt-12 border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h3 className="text-lg font-bold text-indigo-600">Stanza</h3>
                        <p className="mt-2 text-sm text-slate-500">Real-time availability, dynamic pricing, and instant confirmation for stays across the US.</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900">Company</h4>
                        <ul className="mt-3 space-y-2 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-indigo-600">About us</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900">Support</h4>
                        <ul className="mt-3 space-y-2 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-indigo-600">Help Center</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Cancellation options</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Safety information</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
                        <ul className="mt-3 space-y-2 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-indigo-600">Terms &amp; Conditions</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 text-sm text-slate-400 sm:flex-row">
                    <p>© {year} Viraj Almeida. All rights reserved.</p>
                    <p>Built by Viraj Almeida</p>
                </div>
            </div>
        </footer>
    );
}
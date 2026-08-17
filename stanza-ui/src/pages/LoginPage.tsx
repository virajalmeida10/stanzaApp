import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Hotel, Mail, Lock } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const next = params.get('next') ?? '/';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);

    async function submit(e: FormEvent) {
        e.preventDefault();
        setBusy(true);
        try {
            await login({ email, password });
            toast.success('Welcome back!');
            navigate(next, { replace: true });
        } catch (err) { toast.error((err as Error).message); }
        finally { setBusy(false); }
    }

    return (
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid md:grid-cols-2">
            <div className="relative hidden md:block">
                <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=900&q=80" alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/85 to-violet-700/80" />
                <div className="relative flex h-full flex-col justify-between p-8 text-white">
                    <div className="flex items-center gap-2 text-lg font-bold"><Hotel className="h-5 w-5" /> Stanza</div>
                    <div>
                        <h2 className="text-3xl font-extrabold leading-tight">Welcome back</h2>
                        <p className="mt-2 text-indigo-100">Your next getaway is just a few clicks away.</p>
                    </div>
                    <p className="text-sm text-indigo-200">2000+ hotels · 60+ US cities</p>
                </div>
            </div>

            <div className="p-8 sm:p-10">
                <h1 className="text-2xl font-bold text-slate-900">Log in</h1>
                <p className="mt-1 text-sm text-slate-500">Continue to your bookings.</p>
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Email</span>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-9" />
                        </div>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Password</span>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-9" />
                        </div>
                    </label>
                    <button disabled={busy} className="btn-primary w-full">{busy ? 'Logging in…' : 'Log in'}</button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">
                    No account? <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
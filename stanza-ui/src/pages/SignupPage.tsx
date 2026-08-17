import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Hotel, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function SignupPage() {
    const { signup, login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [busy, setBusy] = useState(false);
    const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

    async function submit(e: FormEvent) {
        e.preventDefault();
        setBusy(true);
        try {
            await signup(form);
            await login({ email: form.email, password: form.password });
            toast.success('Account created!');
            navigate('/');
        } catch (err) { toast.error((err as Error).message); }
        finally { setBusy(false); }
    }

    return (
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid md:grid-cols-2">
            <div className="p-8 sm:p-10">
                <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
                <p className="mt-1 text-sm text-slate-500">Join Stanza and start booking.</p>
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Full name</span>
                        <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input required value={form.name} onChange={set('name')} className="input pl-9" />
                        </div>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Email</span>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input type="email" required value={form.email} onChange={set('email')} className="input pl-9" />
                        </div>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Password</span>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input type="password" required value={form.password} onChange={set('password')} className="input pl-9" />
                        </div>
                    </label>
                    <button disabled={busy} className="btn-primary w-full">{busy ? 'Creating…' : 'Sign up'}</button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">
                    Have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Log in</Link>
                </p>
            </div>

            <div className="relative hidden md:block">
                <img src="https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=900&q=80" alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-700/85 to-indigo-700/80" />
                <div className="relative flex h-full flex-col justify-between p-8 text-white">
                    <div className="flex items-center gap-2 text-lg font-bold"><Hotel className="h-5 w-5" /> Stanza</div>
                    <div>
                        <h2 className="text-3xl font-extrabold leading-tight">Adventure awaits</h2>
                        <p className="mt-2 text-indigo-100">Unlock member prices and instant confirmation.</p>
                    </div>
                    <p className="text-sm text-indigo-200">Secure payments · Free cancellation on select stays</p>
                </div>
            </div>
        </div>
    );
}
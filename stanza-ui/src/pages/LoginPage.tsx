import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
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
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="mx-auto max-w-md">
            <div className="card">
                <h1 className="text-2xl font-bold">Log in</h1>
                <p className="mt-1 text-sm text-slate-500">Welcome back to Stanza.</p>
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Email</span>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Password</span>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
                    </label>
                    <button disabled={busy} className="btn-primary w-full">{busy ? 'Logging in…' : 'Log in'}</button>
                </form>
                <p className="mt-4 text-center text-sm text-slate-500">
                    No account? <Link to="/signup" className="font-medium text-indigo-600">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';

export default function SignupPage() {
    const { signup, login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [busy, setBusy] = useState(false);
    const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [k]: e.target.value });

    async function submit(e: FormEvent) {
        e.preventDefault();
        setBusy(true);
        try {
            await signup(form);
            await login({ email: form.email, password: form.password }); // auto-login
            toast.success('Account created!');
            navigate('/');
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="mx-auto max-w-md">
            <div className="card">
                <h1 className="text-2xl font-bold">Create account</h1>
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Full name</span>
                        <input required value={form.name} onChange={set('name')} className="input" />
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Email</span>
                        <input type="email" required value={form.email} onChange={set('email')} className="input" />
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Password</span>
                        <input type="password" required value={form.password} onChange={set('password')} className="input" />
                    </label>
                    <button disabled={busy} className="btn-primary w-full">{busy ? 'Creating…' : 'Sign up'}</button>
                </form>
                <p className="mt-4 text-center text-sm text-slate-500">
                    Have an account? <Link to="/login" className="font-medium text-indigo-600">Log in</Link>
                </p>
            </div>
        </div>
    );
}
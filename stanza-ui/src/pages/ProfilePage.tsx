import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getMyProfile, updateProfile } from '../api/users';
import Spinner from '../components/Spinner';
import type { Gender } from '../types/api';

export default function ProfilePage() {
    const { data, isLoading } = useQuery({ queryKey: ['profile'], queryFn: getMyProfile });
    const [name, setName] = useState('');
    const [gender, setGender] = useState<Gender>('MALE');
    const [dob, setDob] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (data) {
            setName(data.name ?? '');
            setGender(data.gender ?? 'MALE');
            setDob(data.dateOfBirth ?? '');
        }
    }, [data]);

    async function submit(e: FormEvent) {
        e.preventDefault();
        setBusy(true);
        try {
            await updateProfile({ name, gender, dateOfBirth: dob });
            toast.success('Profile updated');
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setBusy(false);
        }
    }

    if (isLoading) return <Spinner />;

    return (
        <div className="mx-auto max-w-md">
            <div className="card">
                <h1 className="text-2xl font-bold">My profile</h1>
                <p className="mt-1 text-sm text-slate-500">{data?.email}</p>
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Name</span>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Gender</span>
                        <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="input">
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-600">Date of birth</span>
                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="input" />
                    </label>
                    <button disabled={busy} className="btn-primary w-full">{busy ? 'Saving…' : 'Save changes'}</button>
                </form>
            </div>
        </div>
    );
}
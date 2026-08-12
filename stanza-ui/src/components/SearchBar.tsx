import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (base: string, n: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
};

export default function SearchBar({ initial }: { initial?: URLSearchParams }) {
    const navigate = useNavigate();
    const [city, setCity] = useState(initial?.get('city') ?? '');
    const [startDate, setStart] = useState(initial?.get('startDate') ?? today());
    const [endDate, setEnd] = useState(initial?.get('endDate') ?? plusDays(today(), 1));
    const [rooms, setRooms] = useState(Number(initial?.get('roomsCount') ?? 1));

    function submit(e: FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams({ city, startDate, endDate, roomsCount: String(rooms) });
        navigate(`/search?${params.toString()}`);
    }

    return (
        <form
            onSubmit={submit}
            className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1.5fr_1fr_1fr_0.7fr_auto] md:items-end"
        >
            <Field icon={<MapPin className="h-4 w-4" />} label="City">
                <input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" className="input" />
            </Field>
            <Field icon={<Calendar className="h-4 w-4" />} label="Check in">
                <input type="date" min={today()} value={startDate} onChange={(e) => setStart(e.target.value)} className="input" />
            </Field>
            <Field icon={<Calendar className="h-4 w-4" />} label="Check out">
                <input type="date" min={startDate} value={endDate} onChange={(e) => setEnd(e.target.value)} className="input" />
            </Field>
            <Field icon={<Users className="h-4 w-4" />} label="Rooms">
                <input type="number" min={1} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className="input" />
            </Field>
            <button type="submit" className="flex h-[42px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 font-medium text-white hover:bg-indigo-700">
                <Search className="h-4 w-4" /> Search
            </button>
        </form>
    );
}

function Field({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500">{icon}{label}</span>
            {children}
        </label>
    );
}
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

const TOP_CITIES = [
    'New York', 'San Francisco', 'Las Vegas', 'Boston', 'Virginia Beach', 'Chicago',
    'Los Angeles', 'Miami', 'Seattle', 'Austin', 'New Orleans', 'Nashville',
    'San Diego', 'Washington', 'Orlando',
];

export default function SearchBar({ initial }: { initial?: URLSearchParams }) {
    const navigate = useNavigate();
    const [city, setCity] = useState(initial?.get('city') ?? '');
    const [startDate, setStart] = useState(initial?.get('startDate') ?? today());
    const [endDate, setEnd] = useState(initial?.get('endDate') ?? plusDays(today(), 1));
    const [rooms, setRooms] = useState(Number(initial?.get('roomsCount') ?? 1));

    const [cityOpen, setCityOpen] = useState(false);
    const suggestions = city.trim() === ''
        ? TOP_CITIES                                   // focused, nothing typed → show all top cities
        : TOP_CITIES.filter((c) => c.toLowerCase().includes(city.toLowerCase()));

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
            <div className="relative">
                <Field icon={<MapPin className="h-4 w-4" />} label="City">
                    <input
                        value={city}
                        onChange={(e) => { setCity(e.target.value); setCityOpen(true); }}
                        onFocus={() => setCityOpen(true)}
                        onBlur={() => setTimeout(() => setCityOpen(false), 120)}  // delay so option click fires first
                        placeholder="e.g. New York"
                        className="input"
                        autoComplete="off"
                    />
                </Field>
                {cityOpen && suggestions.length > 0 && (
                    <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                        {suggestions.map((c) => (
                            <li key={c}>
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}   // prevent input blur before click
                                    onClick={() => { setCity(c); setCityOpen(false); }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-100"
                                >
                                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> {c}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Field icon={<Calendar className="h-4 w-4" />} label="Check in">
                <input
                    type="date"
                    min={today()}
                    value={startDate}
                    onChange={(e) => {
                        const newStart = e.target.value;
                        setStart(newStart);
                        setEnd(plusDays(newStart, 1));   // check-out auto-set to the day after check-in
                    }}
                    className="input"
                />
            </Field>

            <Field icon={<Calendar className="h-4 w-4" />} label="Check out">
                <input
                    type="date"
                    min={plusDays(startDate, 1)}
                    value={endDate}
                    onChange={(e) => setEnd(e.target.value)}
                    className="input"
                />
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
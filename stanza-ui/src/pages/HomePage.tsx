import SearchBar from '../components/SearchBar';

export default function HomePage() {
    return (
        <div className="space-y-2">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-16 text-white">
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-4xl font-bold leading-tight md:text-5xl">Find your next stay</h1>
                    <p className="mt-3 text-indigo-100">Real-time availability, dynamic pricing, instant confirmation.</p>
                </div>
                <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-24 right-24 h-72 w-72 rounded-full bg-white/10" />
            </section>
            <div className="relative z-10 -mt-12 px-2">
                <SearchBar />
            </div>
        </div>
    );
}
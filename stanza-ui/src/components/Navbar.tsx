import { Link, useNavigate } from 'react-router-dom';
import { Hotel, LogOut, User, CalendarCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
    const { isAuthenticated, email, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
                    <Hotel className="h-6 w-6" /> Stanza
                </Link>
                <nav className="flex items-center gap-4 text-sm">
                    {isAuthenticated ? (
                        <>
                            <Link to="/my-bookings" className="flex items-center gap-1 text-slate-600 hover:text-indigo-600">
                                <CalendarCheck className="h-4 w-4" /> My Bookings
                            </Link>
                            <Link to="/profile" className="flex items-center gap-1 text-slate-600 hover:text-indigo-600">
                                <User className="h-4 w-4" /> {email?.split('@')[0] ?? 'Profile'}
                            </Link>
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="flex items-center gap-1 text-slate-500 hover:text-rose-600"
                            >
                                <LogOut className="h-4 w-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-600 hover:text-indigo-600">Login</Link>
                            <Link to="/signup" className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
                                Sign up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
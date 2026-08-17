import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Hotel, LogOut, User, CalendarCheck, ShoppingCart, Menu, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getMyBookings } from '../api/users';

export default function Navbar() {
    const { isAuthenticated, email, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const { data: bookings } = useQuery({ queryKey: ['my-bookings'], queryFn: getMyBookings, enabled: isAuthenticated });
    const cartCount = bookings?.filter((b) => b.bookingStatus === 'RESERVED' || b.bookingStatus === 'GUESTS_ADDED').length ?? 0;

    const close = () => setOpen(false);
    const doLogout = () => { logout(); close(); navigate('/'); };

    return (
        <header className="sticky top-0 z-30 border-b border-white/50 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Link to="/" onClick={close} className="group flex items-center gap-2 text-xl font-extrabold">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
                        <Hotel className="h-5 w-5" />
                    </span>
                    <span className="gradient-text">Stanza</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 text-sm sm:flex sm:gap-2">
                    {isAuthenticated ? (
                        <>
                            <CartLink count={cartCount} onClick={close} />
                            <NavItem to="/my-bookings" icon={<CalendarCheck className="h-4 w-4" />}>My Bookings</NavItem>
                            <NavItem to="/profile" icon={<User className="h-4 w-4" />}>{email?.split('@')[0] ?? 'Profile'}</NavItem>
                            <button onClick={doLogout} className="flex items-center gap-1 rounded-lg px-3 py-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600">
                                <LogOut className="h-4 w-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600">Login</Link>
                            <Link to="/signup" className="btn-primary text-sm">Sign up</Link>
                        </>
                    )}
                </nav>

                {/* Mobile: cart + hamburger */}
                <div className="flex items-center gap-1 sm:hidden">
                    {isAuthenticated && <CartLink count={cartCount} onClick={close} compact />}
                    <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu panel */}
            {open && (
                <nav className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
                    <div className="flex flex-col gap-1 text-sm">
                        {isAuthenticated ? (
                            <>
                                <MobileLink to="/my-bookings" onClick={close} icon={<CalendarCheck className="h-4 w-4" />}>My Bookings</MobileLink>
                                <MobileLink to="/profile" onClick={close} icon={<User className="h-4 w-4" />}>{email?.split('@')[0] ?? 'Profile'}</MobileLink>
                                <button onClick={doLogout} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-slate-500 hover:bg-rose-50 hover:text-rose-600">
                                    <LogOut className="h-4 w-4" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <MobileLink to="/login" onClick={close}>Login</MobileLink>
                                <Link to="/signup" onClick={close} className="btn-primary mt-1 text-center text-sm">Sign up</Link>
                            </>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}

function CartLink({ count, onClick, compact }: { count: number; onClick: () => void; compact?: boolean }) {
    return (
        <Link to="/my-bookings" onClick={onClick} title="Your cart"
              className="relative flex items-center gap-1 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600">
            <ShoppingCart className="h-5 w-5" />
            {!compact && <span>Cart</span>}
            {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white shadow ring-2 ring-white">
                    {count}
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
                </span>
            )}
        </Link>
    );
}
function NavItem({ to, icon, children }: { to: string; icon: ReactNode; children: ReactNode }) {
    return (
        <Link to={to} className="flex items-center gap-1 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600">
            {icon}{children}
        </Link>
    );
}
function MobileLink({ to, icon, children, onClick }: { to: string; icon?: ReactNode; children: ReactNode; onClick: () => void }) {
    return (
        <Link to={to} onClick={onClick} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-indigo-600">
            {icon}{children}
        </Link>
    );
}
import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatAssistant from './ChatAssistant';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
            <Footer />
            <ChatAssistant />
        </div>
    );
}
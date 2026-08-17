import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export default function Reveal({ children, delay = 0, className = '' }:
                               { children: ReactNode; delay?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setShown(true); io.disconnect(); }
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                transition: 'opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)',
                transitionDelay: `${delay}ms`,
                opacity: shown ? 1 : 0,
                transform: shown ? 'none' : 'translateY(28px)',
            }}
        >
            {children}
        </div>
    );
}
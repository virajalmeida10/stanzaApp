import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Reveal from '../components/Reveal';

type Section = { heading?: string; paragraphs?: string[]; bullets?: string[] };
type PageContent = { title: string; subtitle: string; sections: Section[] };

const SUPPORT_PHONE = '+1 (800) 555-0199';
const SUPPORT_EMAIL = 'support@stanza.example';

const PAGES: Record<string, PageContent> = {
    about: {
        title: 'About Stanza', subtitle: 'Effortless stays across the United States.',
        sections: [
            { paragraphs: ['Stanza began with a simple belief: booking a great place to stay should be fast, transparent, and a little delightful. Today we connect travellers with 2,000+ hotels across 60+ US cities.'] },
            { heading: 'Our mission', paragraphs: ['To make every trip start with confidence — real-time availability, honest pricing, and instant confirmation, every time.'] },
            { heading: 'By the numbers', bullets: ['2,000+ hotels', '60+ cities', '25,000+ happy guests', '99.9% secure uptime'] },
        ],
    },
    careers: {
        title: 'Careers at Stanza', subtitle: 'Build the future of travel with us.',
        sections: [
            { paragraphs: ["We're a small, ambitious team that ships fast and cares deeply about the traveller experience. If that sounds like you, we'd love to talk."] },
            { heading: 'Open roles', bullets: ['Senior Frontend Engineer (React)', 'Backend Engineer (Java / Spring Boot)', 'Product Designer', 'Customer Experience Lead'] },
            { heading: 'Why Stanza', bullets: ['Remote-friendly team', 'Meaningful equity', 'Annual learning budget', 'Generous travel perks'] },
        ],
    },
    contact: {
        title: 'Contact us', subtitle: "We're here to help, 24/7.",
        sections: [{ heading: 'Get in touch', paragraphs: ['Questions about a booking, a refund, or anything else? Our team is available around the clock.'] }],
    },
    help: {
        title: 'Help Center', subtitle: 'Answers to common questions.',
        sections: [
            { heading: 'How do I book a room?', paragraphs: ["Search a city and dates, pick a hotel and room, then pay securely with Stripe. You'll get instant confirmation."] },
            { heading: 'How do I cancel?', paragraphs: ['Open My Bookings, select the reservation, and choose cancel. See Cancellation options for details.'] },
            { heading: 'When am I charged?', paragraphs: ["Your room is held for 30 minutes while you pay. You're only charged once payment completes."] },
        ],
    },
    cancellation: {
        title: 'Cancellation options', subtitle: 'Flexible where it matters.',
        sections: [
            { paragraphs: ['Many stays include free cancellation up to 24 hours before check-in. The exact policy is shown before you pay.'] },
            { heading: 'How it works', bullets: ['Items in your cart can be removed any time.', 'Unpaid payment-holds are released automatically after 30 minutes.', "Confirmed bookings follow the property's cancellation policy."] },
        ],
    },
    safety: {
        title: 'Safety information', subtitle: 'Your security is our priority.',
        sections: [
            { heading: 'Secure payments', paragraphs: ['All payments are processed by Stripe over encrypted connections. We never store your card details.'] },
            { heading: 'Verified stays', paragraphs: ['Hotels on Stanza are reviewed for accuracy, so what you see is what you get.'] },
            { heading: 'Account protection', paragraphs: ['Your session is protected with industry-standard tokens and secure, http-only cookies.'] },
        ],
    },
    terms: {
        title: 'Terms & Conditions', subtitle: 'The essentials, in plain language.',
        sections: [
            { paragraphs: ['By using Stanza you agree to these terms. This is a demo application; bookings and payments are for demonstration purposes.'] },
            { heading: 'Using the service', bullets: ['You must be 18+ to book.', 'Provide accurate information.', 'Do not misuse or disrupt the service.'] },
            { heading: 'Bookings & payments', paragraphs: ['Prices include the charges shown at checkout. Confirmation is issued once payment succeeds.'] },
        ],
    },
    privacy: {
        title: 'Privacy Policy', subtitle: 'How we handle your data.',
        sections: [
            { paragraphs: ['We collect only what we need to provide the service — your name, email, and booking details.'] },
            { heading: 'What we collect', bullets: ['Account details (name, email)', 'Booking history', 'Payment status (never card numbers)'] },
            { heading: 'Your choices', paragraphs: ['You can request access to or deletion of your data any time by contacting support.'] },
        ],
    },
    cookies: {
        title: 'Cookie Policy', subtitle: 'How we use cookies.',
        sections: [
            { paragraphs: ['We use a small number of cookies to keep you signed in and to remember your session securely.'] },
            { heading: 'Types we use', bullets: ['Essential: keep you logged in (secure, http-only).', 'Preferences: remember your search defaults.'] },
        ],
    },
};

export default function InfoPage({ slug }: { slug: string }) {
    const content = PAGES[slug];
    if (!content) return <p className="card text-slate-500">Page not found.</p>;

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
                <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>

            <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-12 text-white sm:px-8">
                <h1 className="text-3xl font-extrabold sm:text-4xl">{content.title}</h1>
                <p className="mt-2 text-indigo-100">{content.subtitle}</p>
            </section>

            <div className="space-y-4">
                {content.sections.map((s, i) => (
                    <Reveal key={i} delay={i * 60}>
                        <div className="card">
                            {s.heading && <h2 className="text-lg font-semibold text-slate-900">{s.heading}</h2>}
                            {s.paragraphs?.map((p, j) => <p key={j} className="mt-2 leading-relaxed text-slate-600">{p}</p>)}
                            {s.bullets && (
                                <ul className="mt-3 space-y-1.5">
                                    {s.bullets.map((b, j) => (
                                        <li key={j} className="flex items-start gap-2 text-slate-600">
                                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" /> {b}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Reveal>
                ))}

                {slug === 'contact' && (
                    <Reveal>
                        <div className="card grid gap-4 sm:grid-cols-2">
                            <ContactRow icon={<Phone className="h-5 w-5" />} label="24/7 Support" value={SUPPORT_PHONE} />
                            <ContactRow icon={<Mail className="h-5 w-5" />} label="Email" value={SUPPORT_EMAIL} />
                            <ContactRow icon={<MapPin className="h-5 w-5" />} label="Head office" value="500 Market St, San Francisco, CA" />
                            <ContactRow icon={<Clock className="h-5 w-5" />} label="Hours" value="Always open — 24/7/365" />
                        </div>
                    </Reveal>
                )}
            </div>
        </div>
    );
}

function ContactRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">{icon}</span>
            <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                <p className="font-medium text-slate-800">{value}</p>
            </div>
        </div>
    );
}
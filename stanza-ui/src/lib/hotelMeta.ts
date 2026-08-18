import {
    Wifi, Waves, Car, Dumbbell, UtensilsCrossed, Wine, Snowflake, BellRing,
    Sparkles, PawPrint, Coffee, Plane, Briefcase, Tv, Baby, Zap, Umbrella, Shirt, Bath, Mountain,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Amenity = { label: string; Icon: LucideIcon };

const POOL: Amenity[] = [
    { label: 'Free WiFi', Icon: Wifi },
    { label: 'Swimming Pool', Icon: Waves },
    { label: 'Free Parking', Icon: Car },
    { label: 'Fitness Center', Icon: Dumbbell },
    { label: 'Restaurant', Icon: UtensilsCrossed },
    { label: 'Bar & Lounge', Icon: Wine },
    { label: 'Air Conditioning', Icon: Snowflake },
    { label: '24h Front Desk', Icon: BellRing },
    { label: 'Spa & Wellness', Icon: Sparkles },
    { label: 'Pet Friendly', Icon: PawPrint },
    { label: 'Free Breakfast', Icon: Coffee },
    { label: 'Airport Shuttle', Icon: Plane },
    { label: 'Business Center', Icon: Briefcase },
    { label: 'Smart TV', Icon: Tv },
    { label: 'Family Rooms', Icon: Baby },
    { label: 'EV Charging', Icon: Zap },
    { label: 'Beach Access', Icon: Umbrella },
    { label: 'Laundry Service', Icon: Shirt },
    { label: 'Spa Bath', Icon: Bath },
    { label: 'Scenic View', Icon: Mountain },
];

/** Stable 3.7–4.9 rating derived from the hotel id (so it varies per hotel, never flickers). */
export function ratingFor(id: number): number {
    return Math.round((3.7 + ((id * 37) % 13) / 10) * 10) / 10;
}

export function reviewsFor(id: number): number {
    return 80 + ((id * 53) % 1400);
}

/** A varied, stable subset of amenities for a hotel (step 7 is coprime with 20 → good spread). */
export function amenitiesFor(id: number, count = 8): Amenity[] {
    const start = (id * 7) % POOL.length;
    const picked = new Map<string, Amenity>();
    let i = 0;
    while (picked.size < Math.min(count, POOL.length)) {
        const a = POOL[(start + i * 7) % POOL.length];
        picked.set(a.label, a);
        i++;
    }
    return [...picked.values()];
}
import type { Role } from '../types/api';

interface JwtPayload { sub: string; email?: string; roles?: string; exp?: number; }

export function decodeJwt(token: string): JwtPayload | null {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
        return null;
    }
}

export function rolesFromToken(token: string): Role[] {
    const roles = decodeJwt(token)?.roles;
    if (!roles) return [];
    // "[GUEST, HOTEL_MANAGER]" -> ["GUEST", "HOTEL_MANAGER"]
    return roles.replace(/[[\]\s]/g, '').split(',').filter(Boolean) as Role[];
}
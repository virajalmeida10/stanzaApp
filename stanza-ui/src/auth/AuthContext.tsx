import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { tokenStore } from '../lib/apiClient';
import { decodeJwt, rolesFromToken } from '../lib/jwt';
import * as authApi from '../api/auth';
import type { LoginRequest, Role, SignUpRequest } from '../types/api';

interface AuthState {
    token: string | null;
    userId: number | null;
    email: string | null;
    roles: Role[];
    isAuthenticated: boolean;
    isManager: boolean;
    login: (body: LoginRequest) => Promise<void>;
    signup: (body: SignUpRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => tokenStore.get());

    const value = useMemo<AuthState>(() => {
        const payload = token ? decodeJwt(token) : null;
        const roles = token ? rolesFromToken(token) : [];
        return {
            token,
            userId: payload?.sub ? Number(payload.sub) : null,
            email: payload?.email ?? null,
            roles,
            isAuthenticated: !!token,
            isManager: roles.includes('HOTEL_MANAGER'),
            login: async (body) => setToken(await authApi.login(body)),
            signup: async (body) => { await authApi.signup(body); },
            logout: () => { tokenStore.clear(); setToken(null); },
        };
    }, [token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
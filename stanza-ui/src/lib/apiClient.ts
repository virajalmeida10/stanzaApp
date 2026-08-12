import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiEnvelope } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';
const TOKEN_KEY = 'stanza.accessToken';

export const tokenStore = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // send/receive the httpOnly refreshToken cookie
});

// Attach bearer token to every request
api.interceptors.request.use((config) => {
    const token = tokenStore.get();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
    // bare axios to avoid interceptor recursion; cookie carries the refresh token
    const { data } = await axios.post<ApiEnvelope<{ accessToken: string }>>(
        `${BASE_URL}/auth/refresh`, null, { withCredentials: true },
    );
    const token = data.data!.accessToken;
    tokenStore.set(token);
    return token;
}

api.interceptors.response.use(
    (response) => {
        // unwrap { timeStamp, data, error } -> data
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
            response.data = (response.data as ApiEnvelope<unknown>).data;
        }
        return response;
    },
    async (error: AxiosError<ApiEnvelope<unknown>>) => {
        const original = error.config as (AxiosRequestConfig & { _retried?: boolean }) | undefined;
        const isAuthCall = original?.url?.includes('/auth/');

        if (error.response?.status === 401 && original && !original._retried && !isAuthCall) {
            try {
                original._retried = true;
                refreshing = refreshing ?? refreshAccessToken();
                const token = await refreshing;
                refreshing = null;
                original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
                return api(original);
            } catch {
                refreshing = null;
                tokenStore.clear();
            }
        }
        const message = error.response?.data?.error?.message ?? error.message ?? 'Something went wrong';
        return Promise.reject(new Error(message));
    },
);
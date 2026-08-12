import { api, tokenStore } from '../lib/apiClient';
import type { LoginRequest, SignUpRequest, UserDto } from '../types/api';

export async function login(body: LoginRequest): Promise<string> {
    const { data } = await api.post<{ accessToken: string }>('/auth/login', body);
    tokenStore.set(data.accessToken);
    return data.accessToken;
}

export async function signup(body: SignUpRequest): Promise<UserDto> {
    const { data } = await api.post<UserDto>('/auth/signup', body);
    return data;
}
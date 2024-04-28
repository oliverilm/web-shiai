import type { AxiosResponse } from 'axios';
import { api } from '../instances';

// -------------------------------------
export type RegisterData = {
    email: string;
    password: string;
}

export interface Profile {
    id: number
    last_login: string
    is_superuser: boolean
    username: string
    first_name: string
    last_name: string
    email: string
    is_staff: boolean
    is_active: boolean
    date_joined: string
    google_profile: number;
    groups: number[]
    user_permissions: number[]
}

export function signUp(data: RegisterData): Promise<AxiosResponse<Profile>> {
  return api.post('auth/', data);
}

// -------------------------------------
export type AuthenticateData = {
    password: string;
    username: string;
}

export interface TokensResponse {
    access: string,
    refresh: string,
    username: string,
}
export function authenticate(data: AuthenticateData): Promise<AxiosResponse<TokensResponse>> {
  return api.post('token/pair', data);
}

// -------------------------------------
export type VerifyData = {
    token: string;
}
export function verifyToken(data: VerifyData) {
  return api.post('token/verify', data);
}

// -------------------------------------
export type RefreshData = {
    refresh: string;
}
export function refreshToken(data: RefreshData): Promise<AxiosResponse<TokensResponse>> {
  return api.post('token/refresh', data);
}

// -------------------------------------
export function getProfile(): Promise<AxiosResponse<Profile>> {
  return api.get('auth/me', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    },
  });
}

// -------------------------------------

// eslint-disable-next-line camelcase
export function googleAuth(access_token: string): Promise<AxiosResponse<Omit<TokensResponse, 'username'>>> {
  // eslint-disable-next-line camelcase
  return api.post('auth/google', { access_token });
}
// eslint-disable-next-line camelcase
export function linkGoogleToAccount(access_token: string): Promise<AxiosResponse<unknown>> {
// eslint-disable-next-line camelcase
  return api.post('auth/google-link', { access_token });
}

// eslint-disable-next-line camelcase
export function unlinkGoogleToAccount(): Promise<AxiosResponse<unknown>> {
  // eslint-disable-next-line camelcase
  return api.post('google-unlink', {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    },
  });
}

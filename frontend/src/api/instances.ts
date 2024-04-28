import { notifications } from '@mantine/notifications';
import axios, { InternalAxiosRequestConfig } from 'axios';

const PORT = 8000;
const BASE = 'http://0.0.0.0';

const absBase = `${BASE}:${PORT}/`;

export const api = axios.create({
  baseURL: absBase,
});

/**
 * create an interceptor for incoming responses
 *
 * capture errors and messages
 */
api.interceptors.response.use((value) => {
  if (value.data.message && value.data.status) {
    const { data: { message, status } } = value;
    notifications.show({ title: status, message, color: 'green' });
  }

  return value;
}, (error) => {
  if (error?.response?.data?.message && error?.response?.data?.detail) {
    const errorData: { detail: string, message: string[]} = error?.response?.data;
    errorData.message.forEach((message) => {
      notifications.show({ title: errorData.detail, message, color: 'red' });
    });
  }
});

/**
 * add auth headers with requests
 */
api.interceptors.request.use((conf) => ({
  ...conf,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access')}`,
    'Content-Type': 'application/json',
  },
}) as InternalAxiosRequestConfig<unknown>);

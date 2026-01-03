export const BASE_BACKEND_URL =
  import.meta.env.VITE_ENV === 'production'
    ? 'https://www.treble-events.be/api'
    : 'https://www.staging.treble-events.be/api';

export const NO_INTERNET_ACCESS_ERROR_RESPONSE = errorResponseFor('Geen internetverbinding');
export const FALLBACK_ERROR_RESPONSE = errorResponseFor('Ongekende error opgetreden');

export function dataResponseFor<T>(data: T): { data: T; error: null } {
  return { data, error: null };
}

export function errorResponseFor(error: string): { data: null; error: string } {
  return { data: null, error };
}

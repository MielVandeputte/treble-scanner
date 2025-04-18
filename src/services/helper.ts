export function getBaseBackendUrl(): string {
  return import.meta.env.VITE_ENV === 'production'
    ? 'https://www.treble-events.be/api'
    : 'https://www.staging.treble-events.be/api';
}

export function dataResponseFor<T>(data: T): { data: T; error: null } {
  return { data, error: null };
}

export function errorResponseFor(error: string): { data: null; error: string } {
  return { data: null, error };
}

export function noInternetAccessErrorResponse(): { data: null; error: string } {
  return errorResponseFor('Geen internetverbinding');
}

export function fallbackErrorResponse(): { data: null; error: string } {
  return errorResponseFor('Ongekende error opgetreden');
}

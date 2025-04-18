export function getBaseBackendUrl(): string {
  return import.meta.env.VITE_ENV === 'production'
    ? 'https://www.treble-events.be/api'
    : 'https://www.staging.treble-events.be/api';
}

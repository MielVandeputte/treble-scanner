export function getBaseBackendUrl(): string {
    if (import.meta.env.VITE_ENV === 'production') {
        return 'https://www.treble-events.be/api';
    } else {
        return 'https://www.staging.treble-events.be/api';
    }
}

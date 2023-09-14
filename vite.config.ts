import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Glow Scanner',
                short_name: 'Glow Scanner',
                description: 'Scan de QR-codes op de tickets van Glow Events',
                theme_color: '#18181B',
                icons: [
                    {
                        src: 'pwa-72x72.png',
                        sizes: '72x72',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'maskable-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    },
                    {
                        src: 'maskable-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    }
                ],
                screenshots: [
                    {
                        src: 'screenshot-start.png',
                        sizes: '2467x1080',
                        type: 'image/png'
                    },
                    {
                        src: 'screenshot-scanner.png',
                        sizes: '2467x1080',
                        type: 'image/png'
                    },
                    {
                        src: 'screenshot-scanner-success.png',
                        sizes: '2467x1080',
                        type: 'image/png'
                    },
                    {
                        src: 'screenshot-scanner-already-scanned.png',
                        sizes: '2467x1080',
                        type: 'image/png'
                    },
                ]
            }
        }),
    ],
})

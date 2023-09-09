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
                short_name: 'Scanner',
                description: 'Scan QR-codes van Glow Events',
                theme_color: '#18181B'
            }
        }),
    ],
})

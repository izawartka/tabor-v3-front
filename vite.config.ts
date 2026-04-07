import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    base: mode === 'prod' ? '/txt/tabor/v3/' : '/',
    plugins: [react()],
    server: {
        proxy: {
            '/api-static': {
                target: 'https://maseuko.pl',
                changeOrigin: true,
                rewrite: (path): string => path.replace(/^\/api-static/, '/txt/tabor/api3/static')
            },
            '/thumb-photos': {
                target: 'https://maseuko.pl',
                changeOrigin: true,
                rewrite: (path): string =>
                    path.replace(/^\/thumb-photos/, '/txt/tabor/thumbs_tabor3/foto')
            },
            '/photos': {
                target: 'https://maseuko.pl',
                changeOrigin: true,
                rewrite: (path): string => path.replace(/^\/photos/, '/txt/tabor/foto')
            },
            '/api': {
                target: 'https://maseuko.pl',
                changeOrigin: true,
                rewrite: (path): string => path.replace(/^\/api/, '/txt/tabor/api3')
            }
        }
    },
    test: {
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        globals: true,
        css: true,
        maxWorkers: 2
    }
}));

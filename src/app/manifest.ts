import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'CrankSmith Pro',
        short_name: 'CrankSmith',
        description: 'The definitive bicycle configuration tool for mechanics and performance cyclists.',
        start_url: '/builder',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#1e40af',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}

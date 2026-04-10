import { MetadataRoute } from 'next'
import { STANDARDS } from '@/app/compatibility/standards';
import templates from '@/data/templates.json';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://cranksmith.com';
    const now = new Date();

    const staticRoutes = [
        { path: '', changeFrequency: 'weekly' as const, priority: 1 },
        { path: '/builder', changeFrequency: 'weekly' as const, priority: 0.95 },
        { path: '/garage', changeFrequency: 'weekly' as const, priority: 0.85 },
        { path: '/performance', changeFrequency: 'weekly' as const, priority: 0.85 },
        { path: '/tire-pressure', changeFrequency: 'weekly' as const, priority: 0.85 },
        { path: '/weight', changeFrequency: 'weekly' as const, priority: 0.85 },
        { path: '/guides', changeFrequency: 'weekly' as const, priority: 0.8 },
        { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
        { path: '/features', changeFrequency: 'monthly' as const, priority: 0.75 },
        { path: '/features/bike-compatibility-checker', changeFrequency: 'monthly' as const, priority: 0.8 },
        { path: '/features/gear-ratio-calculator', changeFrequency: 'monthly' as const, priority: 0.8 },
        { path: '/features/bike-weight-calculator', changeFrequency: 'monthly' as const, priority: 0.8 },
        { path: '/standards', changeFrequency: 'monthly' as const, priority: 0.75 },
        { path: '/standards/bottom-bracket', changeFrequency: 'monthly' as const, priority: 0.75 },
        { path: '/standards/axles', changeFrequency: 'monthly' as const, priority: 0.75 },
        { path: '/standards/freehub', changeFrequency: 'monthly' as const, priority: 0.75 },
        { path: '/standards/brake-mounts', changeFrequency: 'monthly' as const, priority: 0.75 },
        { path: '/showcase', changeFrequency: 'weekly' as const, priority: 0.8 },
        { path: '/settings', changeFrequency: 'monthly' as const, priority: 0.4 },
        { path: '/offline', changeFrequency: 'yearly' as const, priority: 0.3 },
        { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
        { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
        { path: '/hubs/big-tire-revolution', changeFrequency: 'weekly' as const, priority: 0.8 },
        { path: '/hubs/gravel-drivetrain-bible', changeFrequency: 'weekly' as const, priority: 0.8 },
        { path: '/hubs/gravel-standards-master', changeFrequency: 'weekly' as const, priority: 0.8 },
    ];

    const guideSlugs = [
        'gravel-groupsets-explained',
        'bottom-bracket-standards',
        'brake-mount-standards',
    ];

    const frameStandards = Object.entries(STANDARDS)
        .filter(([, standard]) => standard.type === 'Frame')
        .map(([key, standard]) => ({
            slug: key.replace('frame-', ''),
            hasBbShell: Boolean(standard.interfaces?.bottom_bracket_shell),
            hasRearAxle: Boolean(standard.interfaces?.rear_axle),
        }));

    const bbStandards = Object.keys(STANDARDS)
        .filter((key) => key.startsWith('bb-'))
        .map((key) => key.replace('bb-', ''));

    const wheelStandards = Object.keys(STANDARDS)
        .filter((key) => key.startsWith('wheel-'))
        .map((key) => key.replace('wheel-', ''));

    const compatibilityPaths = [
        ...frameStandards
            .filter((frame) => frame.hasBbShell)
            .flatMap((frame) => bbStandards.map((bb) => `bottom-bracket/${frame.slug}-vs-${bb}`)),
        ...frameStandards
            .filter((frame) => frame.hasRearAxle)
            .flatMap((frame) => wheelStandards.map((wheel) => `wheels/${frame.slug}-vs-${wheel}`)),
    ];

    const showcasePaths = templates.map((template) => `/showcase/${template.id}`);

    return [
        ...staticRoutes.map((route) => ({
            url: `${baseUrl}${route.path}`,
            lastModified: now,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
        })),
        ...guideSlugs.map((slug) => ({
            url: `${baseUrl}/guides/${slug}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.75,
        })),
        ...compatibilityPaths.map((path) => ({
            url: `${baseUrl}/compatibility/${path}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
        ...showcasePaths.map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ];
}

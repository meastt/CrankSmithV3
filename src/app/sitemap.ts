import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://cranksmith.com' // Replace with actual domain when deployed

    // Define all guides
    const guides = [
        'mullet-drivetrain-guide',
        't47-explained',
        'gravel-gearing-1x-vs-2x'
    ];

    // Define sample compatibility pages (these are dynamic but we can list common ones)
    const compatibilityPages = [
        'bottom-bracket/t47-vs-bsa',
        'bottom-bracket/bb30-vs-bsa',
        'bottom-bracket/pf30-vs-t47',
        'wheels/boost-vs-standard',
        'wheels/super-boost-vs-boost'
    ];

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/builder`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/guides`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/garage`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        // Guide pages
        ...guides.map((slug) => ({
            url: `${baseUrl}/guides/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
        // Compatibility pages
        ...compatibilityPages.map((path) => ({
            url: `${baseUrl}/compatibility/${path}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]
}

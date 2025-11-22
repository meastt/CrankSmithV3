import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://cranksmith.com' // Replace with actual domain when deployed

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}

/**
 * Dynamic sitemap generation for FaxBella.
 * Serves at https://faxbella.com/sitemap.xml
 */

import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://faxbella.com';
    const now = new Date().toISOString();

    return [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: '2026-02-01',
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: '2026-02-01',
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];
}

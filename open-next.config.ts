/**
 * OpenNext configuration for deploying FaxBella to Cloudflare Pages/Workers.
 *
 * OpenNext adapts the Next.js build output so it can run on Cloudflare's edge
 * network instead of Node.js/Vercel. This gives us:
 *   - Global edge deployment (300+ cities)
 *   - Automatic static asset caching via Cloudflare CDN
 *   - Workers for SSR and API routes
 *
 * Docs: https://opennext.js.org/cloudflare
 */

import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
    default: {
        override: {
            wrapper: 'cloudflare-node',
            converter: 'edge',
            proxyExternalRequest: 'fetch',
            incrementalCache: 'dummy',
            tagCache: 'dummy',
            queue: 'dummy',
        },
    },

    edgeExternals: ['node:crypto'],

    middleware: {
        external: true,
        override: {
            wrapper: 'cloudflare-edge',
            converter: 'edge',
            proxyExternalRequest: 'fetch',
            incrementalCache: 'dummy',
            tagCache: 'dummy',
            queue: 'dummy',
        },
    },
};

export default config;

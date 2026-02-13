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

import type { OpenNextConfig } from 'open-next/types/open-next';

const config: OpenNextConfig = {
    default: {
        // Use Cloudflare Workers for server-side rendering
        override: {
            wrapper: 'cloudflare-node',
            converter: 'edge',
            // Incremental Static Regeneration via Cloudflare KV
            incrementalCache: 'dummy',
            tagCache: 'dummy',
            queue: 'dummy',
        },
    },

    // Middleware runs at the edge on every request
    middleware: {
        external: true,
        override: {
            wrapper: 'cloudflare-edge',
            converter: 'edge',
            proxyExternalRequest: 'fetch',
        },
    },

    // Build output configuration
    buildCommand: 'npx next build',
    buildOutputPath: '.next',

    // Dangerous: skip certain build validations (use carefully)
    // dangerous: {
    //     disableIncrementalCache: true,
    // },
};

export default config;

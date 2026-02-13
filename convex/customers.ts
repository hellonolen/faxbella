/**
 * Customer management for FaxAI SaaS
 */

import { mutation, query, internalMutation, internalQuery } from './_generated/server';
import { v } from 'convex/values';

// Generate a secure webhook secret
function generateWebhookSecret(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let secret = 'faxai_';
    for (let i = 0; i < 32; i++) {
        secret += chars[crypto.getRandomValues(new Uint32Array(1))[0] % chars.length];
    }
    return secret;
}

// Plan limits — single-tier pricing: $55/mo per 500-fax block, unlimited recipients
const PLAN_LIMITS: Record<string, { faxes: number; recipients: number }> = {
    standard: { faxes: 500, recipients: 999999 },
    daypass: { faxes: 5, recipients: 999999 },
    // Legacy support
    starter: { faxes: 500, recipients: 999999 },
    business: { faxes: 500, recipients: 999999 },
    enterprise: { faxes: 500, recipients: 999999 },
};

// Create customer after Stripe checkout
export const createCustomer = internalMutation({
    args: {
        email: v.string(),
        name: v.optional(v.string()),
        stripeCustomerId: v.string(),
        stripeSubscriptionId: v.optional(v.string()),
        plan: v.string(),
    },
    handler: async (ctx, args) => {
        const webhookSecret = generateWebhookSecret();
        const limits = PLAN_LIMITS[args.plan] || PLAN_LIMITS.standard;

        const customerId = await ctx.db.insert('customers', {
            email: args.email,
            name: args.name,
            stripeCustomerId: args.stripeCustomerId,
            stripeSubscriptionId: args.stripeSubscriptionId,
            plan: args.plan,
            planStatus: 'active',
            webhookSecret,
            faxesThisMonth: 0,
            faxesLimit: limits.faxes,
            createdAt: Date.now(),
        });

        return { customerId, webhookSecret };
    },
});

// Get customer dashboard data
export const getDashboard = query({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const customer = await ctx.db
            .query('customers')
            .withIndex('by_email', (q) => q.eq('email', args.email))
            .first();

        if (!customer) {
            return null;
        }

        // Get recipients count
        const recipients = await ctx.db
            .query('recipients')
            .withIndex('by_customer', (q) => q.eq('customerId', customer._id))
            .collect();

        // Get recent faxes
        const recentFaxes = await ctx.db
            .query('inboundFaxes')
            .withIndex('by_customer', (q) => q.eq('customerId', customer._id))
            .order('desc')
            .take(10);

        // Plan limits for recipient count — all plans get unlimited
        const planRecipientLimits: Record<string, number> = {
            standard: 999999,
            daypass: 999999,
            starter: 999999,
            business: 999999,
            enterprise: 999999,
        };

        return {
            customer: {
                _id: customer._id,
                email: customer.email,
                name: customer.name,
                plan: customer.plan,
                planStatus: customer.planStatus,
                faxesThisMonth: customer.faxesThisMonth,
                faxesLimit: customer.faxesLimit,
                recipientLimit: planRecipientLimits[customer.plan] || 999999,
                faxNumber: customer.faxNumber,
                humbleFaxAccessKey: customer.humbleFaxAccessKey ? '***configured***' : undefined,
                humbleFaxSecretKey: customer.humbleFaxSecretKey ? '***configured***' : undefined,
                geminiApiKey: customer.geminiApiKey ? '***configured***' : undefined,
                createdAt: customer.createdAt,
            },
            recipientsCount: recipients.length,
            recipients: recipients.map(r => ({
                id: r._id,
                name: r.name,
                email: r.email,
                keywords: r.keywords,
                active: r.active,
            })),
            recentFaxes: recentFaxes.map(f => ({
                id: f._id,
                fromNumber: f.fromNumber,
                toNumber: f.toNumber,
                numPages: f.numPages,
                status: f.status,
                confidence: f.routingConfidence,
                reason: f.routingReason,
                documentType: f.documentType,
                urgency: f.urgency,
                receivedAt: f.receivedAt,
                processedAt: f.processedAt,
            })),
        };
    },
});

// Get webhook secret (auth-gated, separate from dashboard)
export const getWebhookSecret = query({
    args: {
        sessionToken: v.string(),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db
            .query('passkeySessions')
            .withIndex('by_sessionToken', (q) => q.eq('sessionToken', args.sessionToken))
            .first();
        if (!session || session.expiresAt < Date.now()) {
            return null;
        }
        const customer = await ctx.db
            .query('customers')
            .withIndex('by_email', (q) => q.eq('email', session.email))
            .first();
        if (!customer) return null;
        return { webhookSecret: customer.webhookSecret };
    },
});

// Update customer's fax provider credentials
export const updateFaxCredentials = mutation({
    args: {
        sessionToken: v.string(),
        email: v.string(),
        faxNumber: v.string(),
        humbleFaxAccessKey: v.optional(v.string()),
        humbleFaxSecretKey: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db
            .query('passkeySessions')
            .withIndex('by_sessionToken', (q) => q.eq('sessionToken', args.sessionToken))
            .first();
        if (!session || session.expiresAt < Date.now()) {
            throw new Error('Authentication required');
        }
        if (session.email !== args.email) {
            throw new Error('Access denied');
        }

        const customer = await ctx.db
            .query('customers')
            .withIndex('by_email', (q) => q.eq('email', args.email))
            .first();

        if (!customer) {
            throw new Error('Customer not found');
        }

        await ctx.db.patch(customer._id, {
            faxNumber: args.faxNumber,
            humbleFaxAccessKey: args.humbleFaxAccessKey,
            humbleFaxSecretKey: args.humbleFaxSecretKey,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Update customer's LLM API key
export const updateLLMKey = mutation({
    args: {
        sessionToken: v.string(),
        email: v.string(),
        geminiApiKey: v.string(),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db
            .query('passkeySessions')
            .withIndex('by_sessionToken', (q) => q.eq('sessionToken', args.sessionToken))
            .first();
        if (!session || session.expiresAt < Date.now()) {
            throw new Error('Authentication required');
        }
        if (session.email !== args.email) {
            throw new Error('Access denied');
        }

        const customer = await ctx.db
            .query('customers')
            .withIndex('by_email', (q) => q.eq('email', args.email))
            .first();

        if (!customer) {
            throw new Error('Customer not found');
        }

        await ctx.db.patch(customer._id, {
            geminiApiKey: args.geminiApiKey,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Get customer by email (internal — used by R2, notifications, etc.)
export const getCustomerByEmail = internalQuery({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('customers')
            .withIndex('by_email', (q) => q.eq('email', args.email))
            .first();
    },
});

// Reset monthly fax counts (run via cron on 1st of month)
export const resetMonthlyCounts = internalMutation({
    args: {},
    handler: async (ctx) => {
        const customers = await ctx.db.query('customers').collect();

        for (const customer of customers) {
            await ctx.db.patch(customer._id, {
                faxesThisMonth: 0,
                updatedAt: Date.now(),
            });
        }

        return { reset: customers.length };
    },
});

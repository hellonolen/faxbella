/**
 * Recipient management for FaxAI SaaS
 */

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Add a new recipient
export const addRecipient = mutation({
    args: {
        customerEmail: v.string(),
        name: v.string(),
        email: v.string(),
        company: v.optional(v.string()),
        keywords: v.optional(v.array(v.string())),
        deliveryMethod: v.optional(v.string()),
        webhookUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Find the customer
        const customer = await ctx.db
            .query('customers')
            .withIndex('by_email', (q) => q.eq('email', args.customerEmail))
            .first();

        if (!customer) {
            throw new Error('Customer not found');
        }

        // Check recipient limits
        const existingRecipients = await ctx.db
            .query('recipients')
            .withIndex('by_customer', (q) => q.eq('customerId', customer._id))
            .collect();

        const limits: Record<string, number> = {
            starter: 5,
            business: 25,
            enterprise: 999999,
        };

        if (existingRecipients.length >= (limits[customer.plan] || 5)) {
            throw new Error('Recipient limit reached. Please upgrade your plan.');
        }

        // Check for duplicate email
        const existing = await ctx.db
            .query('recipients')
            .withIndex('by_customer_email', (q) =>
                q.eq('customerId', customer._id).eq('email', args.email)
            )
            .first();

        if (existing) {
            throw new Error('Recipient with this email already exists');
        }

        const recipientId = await ctx.db.insert('recipients', {
            customerId: customer._id,
            name: args.name,
            email: args.email,
            company: args.company,
            keywords: args.keywords || [],
            deliveryMethod: args.deliveryMethod || 'email',
            webhookUrl: args.webhookUrl,
            active: true,
            createdAt: Date.now(),
        });

        return { recipientId };
    },
});

// Update a recipient
export const updateRecipient = mutation({
    args: {
        recipientId: v.id('recipients'),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        company: v.optional(v.string()),
        keywords: v.optional(v.array(v.string())),
        deliveryMethod: v.optional(v.string()),
        webhookUrl: v.optional(v.string()),
        active: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { recipientId, ...updates } = args;

        const recipient = await ctx.db.get(recipientId);
        if (!recipient) {
            throw new Error('Recipient not found');
        }

        const patch: Record<string, unknown> = {};
        if (updates.name !== undefined) patch.name = updates.name;
        if (updates.email !== undefined) patch.email = updates.email;
        if (updates.company !== undefined) patch.company = updates.company;
        if (updates.keywords !== undefined) patch.keywords = updates.keywords;
        if (updates.deliveryMethod !== undefined) patch.deliveryMethod = updates.deliveryMethod;
        if (updates.webhookUrl !== undefined) patch.webhookUrl = updates.webhookUrl;
        if (updates.active !== undefined) patch.active = updates.active;

        await ctx.db.patch(recipientId, patch);

        return { success: true };
    },
});

// Delete a recipient
export const deleteRecipient = mutation({
    args: {
        recipientId: v.id('recipients'),
    },
    handler: async (ctx, args) => {
        const recipient = await ctx.db.get(args.recipientId);
        if (!recipient) {
            throw new Error('Recipient not found');
        }

        await ctx.db.delete(args.recipientId);

        return { success: true };
    },
});

// List recipients for a customer
export const listRecipients = query({
    args: {
        customerEmail: v.string(),
    },
    handler: async (ctx, args) => {
        const customer = await ctx.db
            .query('customers')
            .withIndex('by_email', (q) => q.eq('email', args.customerEmail))
            .first();

        if (!customer) {
            return [];
        }

        const recipients = await ctx.db
            .query('recipients')
            .withIndex('by_customer', (q) => q.eq('customerId', customer._id))
            .collect();

        return recipients.map(r => ({
            id: r._id,
            name: r.name,
            email: r.email,
            company: r.company,
            keywords: r.keywords,
            deliveryMethod: r.deliveryMethod,
            active: r.active,
            createdAt: r.createdAt,
        }));
    },
});

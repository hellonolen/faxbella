/**
 * Inbound Fax Queries for FaxBella Dashboard
 */

import { query } from './_generated/server';
import { v } from 'convex/values';

// List inbound faxes with optional filters
export const listInboundFaxes = query({
    args: {
        customerEmail: v.string(),
        status: v.optional(v.string()),
        urgency: v.optional(v.string()),
        documentType: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const customer = await ctx.db
            .query('customers')
            .withIndex('by_email', (q) => q.eq('email', args.customerEmail))
            .first();

        if (!customer) {
            return { faxes: [], total: 0 };
        }

        const limit = args.limit || 50;

        // Use the most specific index available
        let faxQuery;

        if (args.status) {
            faxQuery = ctx.db
                .query('inboundFaxes')
                .withIndex('by_customer_status', (q) =>
                    q.eq('customerId', customer._id).eq('status', args.status!)
                );
        } else if (args.urgency) {
            faxQuery = ctx.db
                .query('inboundFaxes')
                .withIndex('by_customer_urgency', (q) =>
                    q.eq('customerId', customer._id).eq('urgency', args.urgency!)
                );
        } else if (args.documentType) {
            faxQuery = ctx.db
                .query('inboundFaxes')
                .withIndex('by_customer_documentType', (q) =>
                    q.eq('customerId', customer._id).eq('documentType', args.documentType!)
                );
        } else {
            faxQuery = ctx.db
                .query('inboundFaxes')
                .withIndex('by_customer', (q) => q.eq('customerId', customer._id));
        }

        const allFaxes = await faxQuery.order('desc').take(limit);

        // Get recipient names for routed faxes
        const recipientIds = allFaxes
            .filter((f) => f.routedToRecipientId)
            .map((f) => f.routedToRecipientId!);

        const recipientMap: Record<string, string> = {};
        for (const rid of recipientIds) {
            if (!recipientMap[rid]) {
                const r = await ctx.db.get(rid);
                if (r) recipientMap[rid] = r.name;
            }
        }

        const faxes = allFaxes.map((f) => ({
            id: f._id,
            fromNumber: f.fromNumber,
            toNumber: f.toNumber,
            numPages: f.numPages,
            status: f.status,
            routedTo: f.routedToRecipientId ? recipientMap[f.routedToRecipientId] || 'Unknown' : undefined,
            routingConfidence: f.routingConfidence,
            routingReason: f.routingReason,
            documentType: f.documentType,
            urgency: f.urgency,
            urgencyReason: f.urgencyReason,
            r2ObjectKey: f.r2ObjectKey,
            fileName: f.fileName,
            hasFile: !!(f.r2ObjectKey || f.storageId),
            receivedAt: f.receivedAt,
            processedAt: f.processedAt,
        }));

        return { faxes, total: faxes.length };
    },
});

// Get a single inbound fax with full details
export const getInboundFax = query({
    args: {
        faxId: v.id('inboundFaxes'),
        customerEmail: v.string(),
    },
    handler: async (ctx, args) => {
        const fax = await ctx.db.get(args.faxId);
        if (!fax) return null;

        // Verify the fax belongs to the customer
        const customer = await ctx.db
            .query('customers')
            .withIndex('by_email', (q) => q.eq('email', args.customerEmail))
            .first();

        if (!customer || fax.customerId !== customer._id) return null;

        // Get recipient info if routed
        let recipientInfo = null;
        if (fax.routedToRecipientId) {
            const r = await ctx.db.get(fax.routedToRecipientId);
            if (r) {
                recipientInfo = {
                    id: r._id,
                    name: r.name,
                    email: r.email,
                    company: r.company,
                };
            }
        }

        // Get child faxes if this was split
        let splits = undefined;
        if (fax.totalSplits && fax.totalSplits > 1) {
            const childFaxes = await ctx.db
                .query('inboundFaxes')
                .withIndex('by_parentFax', (q) => q.eq('parentFaxId', fax._id))
                .collect();

            splits = childFaxes.map((c) => ({
                id: c._id,
                splitIndex: c.splitIndex,
                status: c.status,
                documentType: c.documentType,
            }));
        }

        return {
            id: fax._id,
            fromNumber: fax.fromNumber,
            toNumber: fax.toNumber,
            numPages: fax.numPages,
            status: fax.status,
            routedTo: recipientInfo,
            routingConfidence: fax.routingConfidence,
            routingReason: fax.routingReason,
            extractedText: fax.extractedText,
            documentType: fax.documentType,
            urgency: fax.urgency,
            urgencyReason: fax.urgencyReason,
            structuredData: fax.structuredData,
            webhookDelivered: fax.webhookDelivered,
            webhookDeliveredAt: fax.webhookDeliveredAt,
            // File access
            r2ObjectKey: fax.r2ObjectKey,
            fileName: fax.fileName,
            fileSize: fax.fileSize,
            mimeType: fax.mimeType,
            storageId: fax.storageId ? String(fax.storageId) : undefined,
            hasFile: !!(fax.r2ObjectKey || fax.storageId),
            splits,
            error: fax.error,
            receivedAt: fax.receivedAt,
            processedAt: fax.processedAt,
            createdAt: fax.createdAt,
        };
    },
});

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    // SaaS customers (businesses using FaxAI)
    customers: defineTable({
        email: v.string(),
        name: v.optional(v.string()),
        // Stripe
        stripeCustomerId: v.string(),
        stripeSubscriptionId: v.optional(v.string()),
        plan: v.string(), // 'starter', 'business', 'enterprise'
        planStatus: v.string(), // 'active', 'canceled', 'past_due'
        // HumbleFax credentials (optional - customer can use their own)
        humbleFaxAccessKey: v.optional(v.string()),
        humbleFaxSecretKey: v.optional(v.string()),
        faxNumber: v.optional(v.string()), // Their receiving fax number
        // Webhook security
        webhookSecret: v.string(), // Unique per customer for webhook verification
        // Usage tracking
        faxesThisMonth: v.number(),
        faxesLimit: v.number(), // Based on plan
        // LLM configuration (customer can bring their own key)
        geminiApiKey: v.optional(v.string()),
        // Timestamps
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
    })
        .index('by_email', ['email'])
        .index('by_stripeCustomer', ['stripeCustomerId'])
        .index('by_webhookSecret', ['webhookSecret']),

    // Recipients within a customer's organization
    recipients: defineTable({
        customerId: v.id('customers'),
        name: v.string(),
        email: v.string(),
        company: v.optional(v.string()),
        keywords: v.optional(v.array(v.string())), // Routing keywords
        // Delivery preferences
        deliveryMethod: v.string(), // 'email', 'webhook'
        webhookUrl: v.optional(v.string()),
        // Status
        active: v.boolean(),
        createdAt: v.number(),
    })
        .index('by_customer', ['customerId'])
        .index('by_customer_email', ['customerId', 'email']),

    // Inbound faxes processed by the system
    // Enhanced with competitor-inspired features:
    // - Document classification (Medsender AI, Phelix AI)
    // - Urgency detection (Phelix AI)
    // - Structured data extraction (Concord, eFax Clarity, ETHERFAX)
    // - Multi-document splitting (Phelix AI, Luma Health)
    inboundFaxes: defineTable({
        customerId: v.id('customers'),
        providerFaxId: v.string(), // HumbleFax fax ID
        fromNumber: v.string(),
        toNumber: v.string(),
        numPages: v.number(),

        // Routing
        status: v.string(), // 'pending', 'processing', 'routed', 'unroutable', 'error'
        routedToRecipientId: v.optional(v.id('recipients')),
        routingConfidence: v.optional(v.number()),
        routingReason: v.optional(v.string()),

        // AI extracted text (OCR)
        extractedText: v.optional(v.string()),

        // === ENHANCED AI FEATURES (Competitor-Inspired) ===

        // Document Classification (like Medsender AI, Phelix AI)
        documentType: v.optional(v.string()), // 'referral', 'prescription_refill', 'lab_results', 'invoice', 'prior_auth', 'medical_records', 'other'

        // Urgency Detection (like Phelix AI Inbox Assistant)
        urgency: v.optional(v.string()), // 'urgent', 'routine', 'low'
        urgencyReason: v.optional(v.string()), // Why it's flagged urgent

        // Structured Data Extraction (like Concord, eFax Clarity, ETHERFAX AI Insights)
        structuredData: v.optional(v.object({
            // Patient/Contact Info
            patientName: v.optional(v.string()),
            patientDOB: v.optional(v.string()),
            patientPhone: v.optional(v.string()),
            patientMRN: v.optional(v.string()), // Medical Record Number

            // Sender Info
            senderName: v.optional(v.string()),
            senderOrganization: v.optional(v.string()),
            senderPhone: v.optional(v.string()),
            senderFax: v.optional(v.string()),

            // Document-Specific Fields
            referralType: v.optional(v.string()), // 'specialist', 'imaging', 'lab', etc.
            prescriptionDrug: v.optional(v.string()),
            invoiceNumber: v.optional(v.string()),
            invoiceAmount: v.optional(v.string()),
            dateOfService: v.optional(v.string()),

            // Insurance/Authorization
            insuranceProvider: v.optional(v.string()),
            authorizationNumber: v.optional(v.string()),

            // Custom extracted fields
            customFields: v.optional(v.array(v.object({
                key: v.string(),
                value: v.string(),
            }))),
        })),

        // Multi-Document Splitting (like Phelix AI)
        // If a fax contains multiple patients/documents, split into separate records
        parentFaxId: v.optional(v.id('inboundFaxes')), // Points to original if this is a split
        splitIndex: v.optional(v.number()), // 1, 2, 3... if split from parent
        totalSplits: v.optional(v.number()), // Total number of splits

        // Webhook Delivery Status (for enterprise customers)
        webhookDelivered: v.optional(v.boolean()),
        webhookDeliveredAt: v.optional(v.number()),
        webhookResponse: v.optional(v.string()),

        // Storage
        storageId: v.optional(v.id('_storage')),
        r2ObjectKey: v.optional(v.string()),
        fileName: v.optional(v.string()),
        fileSize: v.optional(v.number()),
        mimeType: v.optional(v.string()),

        // Error tracking
        error: v.optional(v.string()),

        // Timestamps
        receivedAt: v.number(),
        processedAt: v.optional(v.number()),
        createdAt: v.number(),
    })
        .index('by_customer', ['customerId'])
        .index('by_customer_status', ['customerId', 'status'])
        .index('by_customer_urgency', ['customerId', 'urgency'])
        .index('by_customer_documentType', ['customerId', 'documentType'])
        .index('by_providerFaxId', ['providerFaxId'])
        .index('by_parentFax', ['parentFaxId']),

    // ─── Passkey Auth (WebAuthn) ───────────────────────────────

    passkeyCredentials: defineTable({
        email: v.string(),
        credentialId: v.string(),
        publicKey: v.string(),           // Base64-encoded COSE public key
        algorithm: v.number(),           // COSE algorithm (-7 for ES256, -257 for RS256)
        transports: v.array(v.string()), // e.g. ['internal', 'hybrid']
        signCount: v.number(),
        createdAt: v.number(),
        lastUsedAt: v.number(),
    })
        .index('by_email', ['email'])
        .index('by_credentialId', ['credentialId']),

    passkeyChallenge: defineTable({
        email: v.string(),
        challenge: v.string(),
        type: v.string(),    // 'registration' | 'authentication'
        expiresAt: v.number(),
        createdAt: v.number(),
    })
        .index('by_email_challenge', ['email', 'challenge']),

    passkeySessions: defineTable({
        email: v.string(),
        sessionToken: v.string(),
        expiresAt: v.number(),
        createdAt: v.number(),
        lastActiveAt: v.number(),
    })
        .index('by_sessionToken', ['sessionToken'])
        .index('by_email', ['email']),

    // ─── Payment Settings ──────────────────────────────────────

    paymentSettings: defineTable({
        key: v.string(),                 // Always 'global'
        activeProcessor: v.string(),     // 'stripe' | 'whop'
        updatedAt: v.number(),
        updatedBy: v.optional(v.string()),
    })
        .index('by_key', ['key']),

    // Outbound faxes sent by customers
    outboundFaxes: defineTable({
        customerId: v.id('customers'),
        recipientNumber: v.string(),
        recipientName: v.optional(v.string()),
        subject: v.optional(v.string()),
        message: v.optional(v.string()),
        // Status
        status: v.string(), // 'queued', 'sending', 'delivered', 'failed'
        providerFaxId: v.optional(v.string()),
        error: v.optional(v.string()),
        // Storage (for attachments)
        storageId: v.optional(v.id('_storage')),
        r2ObjectKey: v.optional(v.string()),
        fileName: v.optional(v.string()),
        fileSize: v.optional(v.number()),
        mimeType: v.optional(v.string()),
        hasCoverPage: v.optional(v.boolean()),
        // Resend tracking
        originalFaxId: v.optional(v.id('outboundFaxes')),
        // Timestamps
        createdAt: v.number(),
        sentAt: v.optional(v.number()),
    })
        .index('by_customer', ['customerId'])
        .index('by_customer_status', ['customerId', 'status']),

    // Cover pages generated for outbound faxes
    coverPages: defineTable({
        customerId: v.id('customers'),
        outboundFaxId: v.id('outboundFaxes'),
        r2ObjectKey: v.string(),
        generatedAt: v.number(),
    })
        .index('by_outboundFax', ['outboundFaxId']),
});


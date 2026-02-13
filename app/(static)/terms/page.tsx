import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingHeader from '@/components/marketing-header';
import MarketingFooter from '@/components/marketing-footer';
import { SITE_CONFIG, PLANS, ROUTES } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'Terms of Service - FaxBella',
    description:
        'FaxBella terms of service. Rules and conditions for using our AI-powered fax routing platform.',
};

/* ============================================
   Plan data for pricing table
   ============================================ */
const PLAN_ROWS = [
    {
        name: PLANS.starter.name,
        price: `$${PLANS.starter.price}/month`,
        faxes: String(PLANS.starter.faxLimit),
        recipients: String(PLANS.starter.recipientLimit),
    },
    {
        name: PLANS.business.name,
        price: `$${PLANS.business.price}/month`,
        faxes: String(PLANS.business.faxLimit),
        recipients: String(PLANS.business.recipientLimit),
    },
    {
        name: PLANS.enterprise.name,
        price: `$${PLANS.enterprise.price}/month`,
        faxes: 'Unlimited',
        recipients: 'Unlimited',
    },
] as const;

const TABLE_HEADERS = ['Plan', 'Price', 'Faxes/Month', 'Recipients'] as const;

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[var(--color-vc-bg)]">
            <MarketingHeader />

            <main className="pt-[72px]">
                {/* ============================================
                    Dark Hero
                   ============================================ */}
                <section className="bg-[var(--color-vc-surface-dark)] py-16 md:py-20">
                    <div className="max-w-3xl mx-auto px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="accent-line w-12" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)]">
                                Legal
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-text-on-dark)] leading-[1.1]">
                            Terms of Service
                            <span className="text-[var(--color-vc-accent)]">.</span>
                        </h1>

                        <p className="mt-4 font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-vc-text-tertiary)]">
                            Effective Date: February 1, 2026 &middot; Last
                            Updated: February 1, 2026
                        </p>
                    </div>
                </section>

                {/* ============================================
                    Content
                   ============================================ */}
                <section className="py-16 md:py-20 bg-[var(--color-vc-bg)]">
                    <div className="max-w-3xl mx-auto px-6 lg:px-8 leading-relaxed text-[var(--color-vc-text-secondary)]">
                        <p className="text-base leading-relaxed">
                            These Terms of Service (&quot;Terms&quot;) govern
                            your use of {SITE_CONFIG.name}, an AI-powered fax
                            routing platform operated by {SITE_CONFIG.company}{' '}
                            (&quot;Company,&quot; &quot;we,&quot;
                            &quot;us&quot;). By using {SITE_CONFIG.name} at{' '}
                            {SITE_CONFIG.domain} (the &quot;Service&quot;), you
                            agree to these Terms.
                        </p>

                        {/* 1 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            1. Service Description
                        </h2>
                        <p>
                            {SITE_CONFIG.name} provides AI-powered fax routing
                            for businesses. The Service receives incoming faxes
                            via our fax provider, uses AI technology to analyze
                            fax content, identifies the intended recipient, and
                            delivers the fax via email notification or webhook.
                            The Service also supports outbound fax sending.
                        </p>

                        {/* 2 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            2. Account Registration
                        </h2>
                        <p>
                            To use {SITE_CONFIG.name}, you must create an
                            account with a valid email address. Authentication
                            is handled via passkey credentials for passwordless,
                            secure access. You are responsible for maintaining
                            the security of your devices and authentication
                            credentials. You must be at least 18 years old and
                            have the authority to bind your organization to
                            these Terms.
                        </p>

                        {/* 3 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            3. Subscription Plans and Pricing
                        </h2>
                        <div className="overflow-x-auto my-5 rounded-[var(--radius-md)] border border-[var(--color-vc-border)]">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-[var(--color-vc-border)]">
                                        {TABLE_HEADERS.map((header) => (
                                            <th
                                                key={header}
                                                className="text-left p-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)]"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {PLAN_ROWS.map((plan) => (
                                        <tr
                                            key={plan.name}
                                            className="border-b border-[var(--color-vc-border)] last:border-b-0"
                                        >
                                            <td className="p-3 text-[var(--color-vc-text-secondary)]">
                                                {plan.name}
                                            </td>
                                            <td className="p-3 text-[var(--color-vc-text-secondary)]">
                                                {plan.price}
                                            </td>
                                            <td className="p-3 text-[var(--color-vc-text-secondary)]">
                                                {plan.faxes}
                                            </td>
                                            <td className="p-3 text-[var(--color-vc-text-secondary)]">
                                                {plan.recipients}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p>
                            Subscriptions are billed monthly. You may cancel at
                            any time; access continues through the end of your
                            billing period. We may adjust pricing with 30
                            days&apos; written notice.
                        </p>

                        {/* 4 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            4. Payment Processing
                        </h2>
                        <p>
                            Payments are processed through our authorized
                            payment processor. By subscribing, you authorize
                            recurring charges to your payment method. All fees
                            are non-refundable except as required by law or at
                            our sole discretion.
                        </p>

                        {/* 5 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            5. Acceptable Use
                        </h2>
                        <p>You agree not to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>
                                Use the Service to send unsolicited faxes (spam)
                                or violate the Telephone Consumer Protection Act
                                (TCPA)
                            </li>
                            <li>
                                Transmit content that is illegal, defamatory, or
                                infringes on intellectual property rights
                            </li>
                            <li>
                                Attempt to reverse-engineer, decompile, or
                                exploit the AI routing engine
                            </li>
                            <li>
                                Share account credentials or allow unauthorized
                                access to your account
                            </li>
                            <li>
                                Exceed your plan&apos;s fax or recipient limits
                                through automated means
                            </li>
                            <li>
                                Use the Service to circumvent any fax-related
                                regulations in your jurisdiction
                            </li>
                            <li>
                                Interfere with or disrupt the Service
                                infrastructure
                            </li>
                        </ul>

                        {/* 6 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            6. AI Routing Accuracy
                        </h2>
                        <p>
                            {SITE_CONFIG.name} uses AI to route faxes based on
                            content analysis. While we strive for high accuracy,
                            AI routing is probabilistic and may occasionally
                            misroute a fax. We provide confidence scores and
                            routing reasons for transparency. Faxes with low
                            confidence scores are flagged for manual review. We
                            are not liable for damages resulting from misrouted
                            faxes.
                        </p>

                        {/* 7 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            7. Data and Privacy
                        </h2>
                        <p>
                            Your use of the Service is also governed by our{' '}
                            <Link
                                href={ROUTES.privacy}
                                className="text-[var(--color-vc-accent)] hover:underline"
                            >
                                Privacy Policy
                            </Link>
                            . Fax content is processed by AI solely for routing
                            purposes and is not used for model training. You
                            retain ownership of all fax content transmitted
                            through the Service.
                        </p>

                        {/* 8 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            8. Healthcare and HIPAA
                        </h2>
                        <p>
                            If you use {SITE_CONFIG.name} to process faxes
                            containing Protected Health Information (PHI), you
                            must contact us to execute a Business Associate
                            Agreement (BAA) before transmitting PHI. Using the
                            Service to process PHI without a BAA is a violation
                            of these Terms.
                        </p>

                        {/* 9 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            9. Service Availability
                        </h2>
                        <p>
                            We target 99.9% uptime but do not guarantee
                            uninterrupted service. The Service depends on
                            third-party providers for fax transmission, AI
                            processing, email delivery, and database
                            infrastructure. Outages in these services may affect{' '}
                            {SITE_CONFIG.name} availability.
                        </p>

                        {/* 10 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            10. Intellectual Property
                        </h2>
                        <p>
                            {SITE_CONFIG.name}, its AI routing engine, user
                            interface, and all associated branding are the
                            intellectual property of {SITE_CONFIG.company}. You
                            are granted a limited, non-exclusive,
                            non-transferable license to use the Service during
                            your active subscription.
                        </p>

                        {/* 11 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            11. Limitation of Liability
                        </h2>
                        <p className="uppercase text-sm tracking-wide">
                            To the maximum extent permitted by law,{' '}
                            {SITE_CONFIG.company} shall not be liable for any
                            indirect, incidental, special, consequential, or
                            punitive damages, including but not limited to loss
                            of profits, data, or business opportunities arising
                            from your use of the Service. Our total liability
                            shall not exceed the fees paid by you in the 12
                            months preceding the claim.
                        </p>

                        {/* 12 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            12. Indemnification
                        </h2>
                        <p>
                            You agree to indemnify and hold harmless{' '}
                            {SITE_CONFIG.company} from any claims, damages, or
                            expenses arising from your use of the Service,
                            violation of these Terms, or infringement of any
                            third-party rights.
                        </p>

                        {/* 13 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            13. Termination
                        </h2>
                        <p>
                            We may suspend or terminate your account for
                            violation of these Terms, non-payment, or abuse of
                            the Service. Upon termination, your right to use the
                            Service ceases immediately. Data will be retained
                            for 30 days after termination, then permanently
                            deleted.
                        </p>

                        {/* 14 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            14. Governing Law
                        </h2>
                        <p>
                            These Terms are governed by the laws of the State of
                            Delaware, United States, without regard to conflict
                            of law principles. Any disputes shall be resolved in
                            the courts located in Delaware.
                        </p>

                        {/* 15 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            15. Changes to Terms
                        </h2>
                        <p>
                            We may modify these Terms at any time. We will
                            notify you of material changes via email or a
                            prominent notice on the Service. Continued use after
                            changes constitutes acceptance.
                        </p>

                        {/* 16 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            16. Contact
                        </h2>
                        <p>
                            For questions about these Terms, contact us at:
                        </p>
                        <p className="mt-3">
                            <strong className="text-[var(--color-vc-primary)]">
                                {SITE_CONFIG.name}
                            </strong>
                            <br />
                            Email:{' '}
                            <a
                                href="mailto:legal@faxbella.com"
                                className="text-[var(--color-vc-accent)] hover:underline"
                            >
                                legal@faxbella.com
                            </a>
                            <br />
                            Web:{' '}
                            <Link
                                href="/"
                                className="text-[var(--color-vc-accent)] hover:underline"
                            >
                                {SITE_CONFIG.domain}
                            </Link>
                        </p>
                    </div>
                </section>
            </main>

            <MarketingFooter />
        </div>
    );
}

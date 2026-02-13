import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - FaxBella',
  description:
    'Simple, transparent pricing plans for AI-powered fax routing. Choose Starter, Business, or Enterprise.',
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

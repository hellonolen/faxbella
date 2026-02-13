'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { usePasskey } from '@/hooks/use-passkey';
import { MOCK_DASHBOARD_DATA } from '@/lib/constants';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface DashboardCustomer {
  _id: string;
  email: string;
  name?: string;
  plan: string;
  planStatus: string;
  faxesThisMonth: number;
  faxesLimit: number;
  recipientLimit: number;
  faxNumber?: string;
  humbleFaxAccessKey?: string;
  humbleFaxSecretKey?: string;
  geminiApiKey?: string;
  createdAt: number;
}

interface DashboardRecipient {
  id: string;
  name: string;
  email: string;
  keywords: string[];
  active: boolean;
}

interface DashboardFax {
  id: string;
  fromNumber: string;
  status: string;
  confidence?: number;
  reason?: string;
  receivedAt: number;
}

export interface DashboardData {
  customer: DashboardCustomer;
  recipientsCount: number;
  recipients: DashboardRecipient[];
  recentFaxes: DashboardFax[];
}

interface UseDashboardReturn {
  data: DashboardData | null | undefined;
  isLoading: boolean;
  email: string | undefined;
}

/* ----------------------------------------
   Hook
   ---------------------------------------- */

export function useDashboard(): UseDashboardReturn {
  const { session, isLoading: sessionLoading } = usePasskey();

  const queryResult = useQuery(
    api.customers.getDashboard,
    session?.email ? { email: session.email } : 'skip',
  );

  const isLoading = sessionLoading || (!!session?.email && queryResult === undefined);

  // Demo mode: return mock data when no session
  if (!sessionLoading && !session) {
    return {
      data: MOCK_DASHBOARD_DATA as DashboardData,
      isLoading: false,
      email: 'demo@faxbella.com',
    };
  }

  return {
    data: queryResult,
    isLoading,
    email: session?.email,
  };
}

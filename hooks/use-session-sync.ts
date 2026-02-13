'use client';

/**
 * Syncs the localStorage session token to an HTTP cookie
 * so that Next.js middleware can read it for route protection.
 *
 * Reads localStorage on mount and listens for cross-tab storage events.
 * Sets the cookie with Secure flag only in production (HTTPS).
 */

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'faxbella_session';
const COOKIE_NAME = 'faxbella_session';

function isSecureEnvironment(): boolean {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

function setCookie(name: string, value: string): void {
  const secure = isSecureEnvironment() ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax${secure}`;
}

function removeCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function syncTokenToCookie(token: string | null): void {
  if (token) {
    setCookie(COOKIE_NAME, token);
  } else {
    removeCookie(COOKIE_NAME);
  }
}

export function useSessionSync(): { token: string | null } {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Read current token on mount
    const currentToken = getStoredToken();
    setToken(currentToken);
    syncTokenToCookie(currentToken);

    // Listen for storage changes from other tabs
    function handleStorageEvent(event: StorageEvent): void {
      if (event.key !== STORAGE_KEY) return;

      const updatedToken = event.newValue;
      setToken(updatedToken);
      syncTokenToCookie(updatedToken);
    }

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  return { token };
}

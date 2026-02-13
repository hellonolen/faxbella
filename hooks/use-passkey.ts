'use client';

/**
 * React hook for WebAuthn passkey authentication.
 *
 * Usage:
 *   const { register, authenticate, logout, session, isLoading } = usePasskey();
 *
 * The session token is persisted in localStorage. On mount the hook
 * validates the stored token with Convex.
 */

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const SESSION_STORAGE_KEY = 'faxbella_session';

interface PasskeySession {
    email: string;
    sessionToken: string;
    expiresAt: number;
}

// ─── Helpers: ArrayBuffer <-> Base64URL ────────────────────

function bufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

export function usePasskey() {
    const [session, setSession] = useState<PasskeySession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Convex mutations
    const generateRegChallenge = useMutation(api.passkeys.generateRegistrationChallenge);
    const verifyReg = useMutation(api.passkeys.verifyRegistration);
    const generateAuthChallenge = useMutation(api.passkeys.generateAuthenticationChallenge);
    const verifyAuth = useMutation(api.passkeys.verifyAuthentication);
    const deleteSessionMut = useMutation(api.passkeys.deleteSession);
    const refreshSessionMut = useMutation(api.passkeys.refreshSession);

    // Validate stored session on mount
    const storedToken = typeof window !== 'undefined'
        ? localStorage.getItem(SESSION_STORAGE_KEY)
        : null;

    const validationResult = useQuery(
        api.passkeys.validateSession,
        storedToken ? { sessionToken: storedToken } : 'skip'
    );

    useEffect(() => {
        if (storedToken && validationResult !== undefined) {
            if (validationResult) {
                setSession({
                    email: validationResult.email,
                    sessionToken: storedToken,
                    expiresAt: validationResult.expiresAt,
                });
            } else {
                // Token is invalid or expired
                localStorage.removeItem(SESSION_STORAGE_KEY);
            }
            setIsLoading(false);
        } else if (!storedToken) {
            setIsLoading(false);
        }
    }, [storedToken, validationResult]);

    // Safety timeout: if Convex can't validate within 3s (e.g. placeholder URL),
    // clear stale token and fall through to demo mode
    useEffect(() => {
        if (!storedToken || !isLoading) return;
        const timer = setTimeout(() => {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [storedToken, isLoading]);

    // ─── Register a new passkey ────────────────────────────

    const register = useCallback(async (email: string, displayName?: string) => {
        setError(null);
        setIsLoading(true);

        try {
            if (!window.PublicKeyCredential) {
                throw new Error('WebAuthn is not supported in this browser');
            }

            // Step 1: Get registration options from Convex
            const options = await generateRegChallenge({ email, displayName });

            // Step 2: Create credential via browser WebAuthn API
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: new TextEncoder().encode(options.challenge),
                    rp: options.rp,
                    user: {
                        id: new TextEncoder().encode(options.user.id),
                        name: options.user.name,
                        displayName: options.user.displayName,
                    },
                    pubKeyCredParams: options.pubKeyCredParams as PublicKeyCredentialParameters[],
                    authenticatorSelection: options.authenticatorSelection as AuthenticatorSelectionCriteria,
                    timeout: options.timeout,
                    attestation: options.attestation as AttestationConveyancePreference,
                },
            }) as PublicKeyCredential | null;

            if (!credential) {
                throw new Error('Credential creation was cancelled');
            }

            const response = credential.response as AuthenticatorAttestationResponse;

            // Step 3: Send credential to Convex for storage
            const result = await verifyReg({
                email,
                challenge: options.challenge,
                credentialId: bufferToBase64url(credential.rawId),
                publicKey: bufferToBase64url(response.getPublicKey?.() || new ArrayBuffer(0)),
                algorithm: -7, // Default to ES256
                transports: (response.getTransports?.() as string[]) || [],
                attestationObject: bufferToBase64url(response.attestationObject),
            });

            if (result.success) {
                const newSession: PasskeySession = {
                    email,
                    sessionToken: result.sessionToken,
                    expiresAt: result.expiresAt,
                };
                setSession(newSession);
                localStorage.setItem(SESSION_STORAGE_KEY, result.sessionToken);
            }

            return result;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Registration failed';
            setError(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [generateRegChallenge, verifyReg]);

    // ─── Authenticate with an existing passkey ─────────────

    const authenticate = useCallback(async (email?: string) => {
        setError(null);
        setIsLoading(true);

        try {
            if (!window.PublicKeyCredential) {
                throw new Error('WebAuthn is not supported in this browser');
            }

            // Step 1: Get authentication options from Convex
            const options = await generateAuthChallenge({ email });

            // Step 2: Get credential assertion from browser
            const assertion = await navigator.credentials.get({
                publicKey: {
                    challenge: new TextEncoder().encode(options.challenge),
                    rpId: options.rpId,
                    allowCredentials: options.allowCredentials.map((cred: { id: string; type: string; transports?: string[] }) => ({
                        id: base64urlToBuffer(cred.id),
                        type: cred.type as 'public-key',
                        transports: cred.transports as AuthenticatorTransport[] | undefined,
                    })),
                    userVerification: options.userVerification as UserVerificationRequirement,
                    timeout: options.timeout,
                },
            }) as PublicKeyCredential | null;

            if (!assertion) {
                throw new Error('Authentication was cancelled');
            }

            const response = assertion.response as AuthenticatorAssertionResponse;

            // Step 3: Verify with Convex
            const result = await verifyAuth({
                challenge: options.challenge,
                credentialId: bufferToBase64url(assertion.rawId),
                authenticatorData: bufferToBase64url(response.authenticatorData),
                clientDataJSON: bufferToBase64url(response.clientDataJSON),
                signature: bufferToBase64url(response.signature),
            });

            if (result.success) {
                const newSession: PasskeySession = {
                    email: result.email,
                    sessionToken: result.sessionToken,
                    expiresAt: result.expiresAt,
                };
                setSession(newSession);
                localStorage.setItem(SESSION_STORAGE_KEY, result.sessionToken);
            }

            return result;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Authentication failed';
            setError(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [generateAuthChallenge, verifyAuth]);

    // ─── Logout ────────────────────────────────────────────

    const logout = useCallback(async () => {
        if (session?.sessionToken) {
            try {
                await deleteSessionMut({ sessionToken: session.sessionToken });
            } catch {
                // Ignore errors on logout
            }
        }
        setSession(null);
        localStorage.removeItem(SESSION_STORAGE_KEY);
    }, [session, deleteSessionMut]);

    // ─── Check WebAuthn support ────────────────────────────

    const isSupported = typeof window !== 'undefined' && !!window.PublicKeyCredential;

    return {
        session,
        isLoading,
        error,
        isSupported,
        isAuthenticated: !!session,
        register,
        authenticate,
        logout,
    };
}

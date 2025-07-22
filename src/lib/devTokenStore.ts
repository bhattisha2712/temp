// Simple in-memory store for development mode when database is unavailable
interface MockResetToken {
  token: string;
  email: string;
  expires: Date;
  used: boolean;
}

const mockTokenStore: Map<string, MockResetToken> = new Map();

export function storeMockResetToken(token: string, email: string): void {
  mockTokenStore.set(token, {
    token,
    email,
    expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    used: false
  });
}

export function getMockResetToken(token: string): MockResetToken | null {
  const stored = mockTokenStore.get(token);
  if (!stored) return null;
  
  // Check if expired
  if (stored.expires < new Date()) {
    mockTokenStore.delete(token);
    return null;
  }
  
  return stored;
}

export function useMockResetToken(token: string): boolean {
  const stored = mockTokenStore.get(token);
  if (!stored || stored.used) return false;
  
  stored.used = true;
  // Remove after use
  setTimeout(() => mockTokenStore.delete(token), 1000 * 60); // Clean up after 1 minute
  
  return true;
}

export function clearExpiredTokens(): void {
  const now = new Date();
  for (const [token, data] of mockTokenStore.entries()) {
    if (data.expires < now || data.used) {
      mockTokenStore.delete(token);
    }
  }
}

// Auto cleanup every 10 minutes in development
if (process.env.NODE_ENV === "development") {
  setInterval(clearExpiredTokens, 10 * 60 * 1000);
}

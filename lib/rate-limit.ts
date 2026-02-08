
interface RateLimitContext {
    tokenCount: number;
    lastRefill: number;
}

const rateLimitMap = new Map<string, RateLimitContext>();

/**
 * Simple Token Bucket Rate Limiter (In-Memory)
 * @param ip - The identifier (IP address or user ID)
 * @param limit - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns boolean - true if allowed, false if limited
 */
export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const context = rateLimitMap.get(ip) || { tokenCount: limit, lastRefill: now };

    // Refill tokens based on time passed
    const timePassed = now - context.lastRefill;
    const tokensToAdd = Math.floor(timePassed / (windowMs / limit));

    if (tokensToAdd > 0) {
        context.tokenCount = Math.min(limit, context.tokenCount + tokensToAdd);
        context.lastRefill = now;
    }

    if (context.tokenCount > 0) {
        context.tokenCount--;
        rateLimitMap.set(ip, context);
        return true;
    } else {
        rateLimitMap.set(ip, context); // Update lastRefill even if blocked? No, keep old refill time to prevent drift? Actually refill logic handles it.
        return false;
    }
}

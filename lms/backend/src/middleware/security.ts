import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

// Rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 50, // Limit each IP to 5 requests per windowMs in prod, 50 in dev
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for general API endpoints
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for password reset
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    error: 'Too many password reset attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
export function securityHeaders(_req: Request, res: Response, next: any): void {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy (basic)
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none';"
  );

  next();
}

// Request logging middleware for security monitoring
export function securityLogger(req: Request, _res: Response, next: any): void {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';
  const method = req.method;
  const url = req.url;

  // Log suspicious activities
  if (method === 'POST' && (url.includes('/auth') || url.includes('/password'))) {
    console.log(`[${timestamp}] SECURITY: ${method} ${url} from ${ip} - ${userAgent}`);
  }

  // Log potential attacks
  const suspiciousPatterns = [
    /(\.\.|\/etc\/|\/bin\/|eval\(|script>|javascript:|on\w+\s*=)/i,
    /union.*select|select.*from|drop.*table|insert.*into/i
  ];

  const requestBody = JSON.stringify(req.body || {});
  if (suspiciousPatterns.some(pattern => pattern.test(requestBody))) {
    console.warn(`[${timestamp}] POTENTIAL ATTACK: ${method} ${url} from ${ip} - Suspicious payload detected`);
  }

  next();
}
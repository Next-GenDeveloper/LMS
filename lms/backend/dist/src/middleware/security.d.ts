import type { Request, Response } from 'express';
export declare const authRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const generalRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const passwordResetRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare function securityHeaders(req: Request, res: Response, next: any): void;
export declare function securityLogger(req: Request, res: Response, next: any): void;

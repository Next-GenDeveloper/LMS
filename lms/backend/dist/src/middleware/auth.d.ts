import type { Request, Response, NextFunction } from 'express';
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function requireRole(...roles: Array<'student' | 'admin'>): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;

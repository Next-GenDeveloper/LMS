import type { Request, Response, NextFunction } from 'express';
/**
 * Middleware to secure PDF files and ensure only enrolled users with completed payments can access them
 */
export declare function pdfSecurity(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Middleware to check admin access for PDF management
 */
export declare function adminPdfAccess(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;

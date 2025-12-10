import type { Request, Response } from 'express';
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const promoteUserRole: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;

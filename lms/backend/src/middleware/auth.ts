import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.ts';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const payload = verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (e: any) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

export function requireRole(...roles: Array<'student'|'admin'>) {
  return function(req: Request, res: Response, next: NextFunction): void {
    const user = (req as any).user as { role?: string } | undefined;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (!user.role || !roles.includes(user.role as any)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  }
}

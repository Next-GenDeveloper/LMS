import { Router } from 'express';
import type { Request, Response } from 'express';
const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Enrollments API not implemented yet' });
});

export default router;

import { verifyToken } from '../utils/jwt.ts';
export function requireAuth(req, res, next) {
    try {
        const hdr = req.headers.authorization || '';
        const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
        if (!token)
            return res.status(401).json({ message: 'Unauthorized' });
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
export function requireRole(...roles) {
    return function (req, res, next) {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        if (!user.role || !roles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}

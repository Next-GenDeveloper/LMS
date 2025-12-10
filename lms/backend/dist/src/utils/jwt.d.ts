export interface JWTPayload {
    userId: string;
    email: string;
    role: 'student' | 'admin';
}
export declare const generateToken: (payload: JWTPayload) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const decodeToken: (token: string) => JWTPayload | null;

import { Enrollment } from '../models/Enrollment.ts';
import { jwtVerify } from '../utils/jwt.ts';
/**
 * Middleware to secure PDF files and ensure only enrolled users with completed payments can access them
 */
export async function pdfSecurity(req, res, next) {
    try {
        // Extract token from query parameters or authorization header
        const token = req.query.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication token required to access this resource'
            });
        }
        // Verify JWT token
        const decoded = await jwtVerify(token);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid authentication token'
            });
        }
        const userId = decoded.userId;
        const courseId = req.query.courseId;
        if (!courseId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Course ID is required'
            });
        }
        // Check if user is enrolled in the course with completed payment
        const enrollment = await Enrollment.findOne({
            student: userId,
            course: courseId,
            paymentStatus: 'completed'
        });
        if (!enrollment) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You must enroll in this course and complete payment to access this content'
            });
        }
        // Check if enrollment is active
        if (enrollment.status !== 'active') {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Your enrollment is not active. Please contact support.'
            });
        }
        // If all checks pass, allow access to the PDF
        next();
    }
    catch (error) {
        console.error('PDF Security Middleware Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to verify access permissions'
        });
    }
}
/**
 * Middleware to check admin access for PDF management
 */
export async function adminPdfAccess(req, res, next) {
    try {
        // Extract token from authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication token required'
            });
        }
        // Verify JWT token
        const decoded = await jwtVerify(token);
        if (!decoded || !decoded.userId || !decoded.role) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid authentication token'
            });
        }
        // Check if user has admin role
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Admin access required for this operation'
            });
        }
        // If all checks pass, allow access
        next();
    }
    catch (error) {
        console.error('Admin PDF Access Middleware Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to verify admin access'
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmU2VjdXJpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWlkZGxld2FyZS9wZGZTZWN1cml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTVDOztHQUVHO0FBQ0gsTUFBTSxDQUFDLEtBQUssVUFBVSxXQUFXLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUMvRSxJQUFJLENBQUM7UUFDSCw4REFBOEQ7UUFDOUQsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFlLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNYLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLEtBQUssRUFBRSxjQUFjO2dCQUNyQixPQUFPLEVBQUUsdURBQXVEO2FBQ2pFLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxtQkFBbUI7UUFDbkIsTUFBTSxPQUFPLEdBQUcsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixLQUFLLEVBQUUsY0FBYztnQkFDckIsT0FBTyxFQUFFLDhCQUE4QjthQUN4QyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FB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LENBQUM7SUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDbkIsS0FBSyxFQUFFLHVCQUF1QjtZQUM5QixPQUFPLEVBQUUsK0JBQStCO1NBQ3pDLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7IEVucm9sbG1lbnQgfSBmcm9tICcuLi9tb2RlbHMvRW5yb2xsbWVudC50cyc7XHJcbmltcG9ydCB7IGp3dFZlcmlmeSB9IGZyb20gJy4uL3V0aWxzL2p3dC50cyc7XHJcblxyXG4vKipcclxuICogTWlkZGxld2FyZSB0byBzZWN1cmUgUERGIGZpbGVzIGFuZCBlbnN1cmUgb25seSBlbnJvbGxlZCB1c2VycyB3aXRoIGNvbXBsZXRlZCBwYXltZW50cyBjYW4gYWNjZXNzIHRoZW1cclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwZGZTZWN1cml0eShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xyXG4gIHRyeSB7XHJcbiAgICAvLyBFeHRyYWN0IHRva2VuIGZyb20gcXVlcnkgcGFyYW1ldGVycyBvciBhdXRob3JpemF0aW9uIGhlYWRlclxyXG4gICAgY29uc3QgdG9rZW4gPSByZXEucXVlcnkudG9rZW4gYXMgc3RyaW5nIHx8IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24/LnNwbGl0KCcgJylbMV07XHJcblxyXG4gICAgaWYgKCF0b2tlbikge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oe1xyXG4gICAgICAgIGVycm9yOiAnVW5hdXRob3JpemVkJyxcclxuICAgICAgICBtZXNzYWdlOiAnQXV0aGVudGljYXRpb24gdG9rZW4gcmVxdWlyZWQgdG8gYWNjZXNzIHRoaXMgcmVzb3VyY2UnXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFZlcmlmeSBKV1QgdG9rZW5cclxuICAgIGNvbnN0IGRlY29kZWQgPSBhd2FpdCBqd3RWZXJpZnkodG9rZW4pO1xyXG4gICAgaWYgKCFkZWNvZGVkIHx8ICFkZWNvZGVkLnVzZXJJZCkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oe1xyXG4gICAgICAgIGVycm9yOiAnVW5hdXRob3JpemVkJyxcclxuICAgICAgICBtZXNzYWdlOiAnSW52YWxpZCBhdXRoZW50aWNhdGlvbiB0b2tlbidcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdXNlcklkID0gZGVjb2RlZC51c2VySWQ7XHJcbiAgICBjb25zdCBjb3Vyc2VJZCA9IHJlcS5xdWVyeS5jb3Vyc2VJZCBhcyBzdHJpbmc7XHJcblxyXG4gICAgaWYgKCFjb3Vyc2VJZCkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xyXG4gICAgICAgIGVycm9yOiAnQmFkIFJlcXVlc3QnLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdDb3Vyc2UgSUQgaXMgcmVxdWlyZWQnXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGlmIHVzZXIgaXMgZW5yb2xsZWQgaW4gdGhlIGNvdXJzZSB3aXRoIGNvbXBsZXRlZCBwYXltZW50XHJcbiAgICBjb25zdCBlbnJvbGxtZW50ID0gYXdhaXQgRW5yb2xsbWVudC5maW5kT25lKHtcclxuICAgICAgc3R1ZGVudDogdXNlcklkLFxyXG4gICAgICBjb3Vyc2U6IGNvdXJzZUlkLFxyXG4gICAgICBwYXltZW50U3RhdHVzOiAnY29tcGxldGVkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFlbnJvbGxtZW50KSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMykuanNvbih7XHJcbiAgICAgICAgZXJyb3I6ICdGb3JiaWRkZW4nLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdZb3UgbXVzdCBlbnJvbGwgaW4gdGhpcyBjb3Vyc2UgYW5kIGNvbXBsZXRlIHBheW1lbnQgdG8gYWNjZXNzIHRoaXMgY29udGVudCdcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgZW5yb2xsbWVudCBpcyBhY3RpdmVcclxuICAgIGlmIChlbnJvbGxtZW50LnN0YXR1cyAhPT0gJ2FjdGl2ZScpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAzKS5qc29uKHtcclxuICAgICAgICBlcnJvcjogJ0ZvcmJpZGRlbicsXHJcbiAgICAgICAgbWVzc2FnZTogJ1lvdXIgZW5yb2xsbWVudCBpcyBub3QgYWN0aXZlLiBQbGVhc2UgY29udGFjdCBzdXBwb3J0LidcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgYWxsIGNoZWNrcyBwYXNzLCBhbGxvdyBhY2Nlc3MgdG8gdGhlIFBERlxyXG4gICAgbmV4dCgpO1xyXG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ1BERiBTZWN1cml0eSBNaWRkbGV3YXJlIEVycm9yOicsIGVycm9yKTtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcclxuICAgICAgZXJyb3I6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InLFxyXG4gICAgICBtZXNzYWdlOiAnRmFpbGVkIHRvIHZlcmlmeSBhY2Nlc3MgcGVybWlzc2lvbnMnXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNaWRkbGV3YXJlIHRvIGNoZWNrIGFkbWluIGFjY2VzcyBmb3IgUERGIG1hbmFnZW1lbnRcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZG1pblBkZkFjY2VzcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xyXG4gIHRyeSB7XHJcbiAgICAvLyBFeHRyYWN0IHRva2VuIGZyb20gYXV0aG9yaXphdGlvbiBoZWFkZXJcclxuICAgIGNvbnN0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xyXG4gICAgY29uc3QgdG9rZW4gPSBhdXRoSGVhZGVyPy5zcGxpdCgnICcpWzFdO1xyXG5cclxuICAgIGlmICghdG9rZW4pIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHtcclxuICAgICAgICBlcnJvcjogJ1VuYXV0aG9yaXplZCcsXHJcbiAgICAgICAgbWVzc2FnZTogJ0F1dGhlbnRpY2F0aW9uIHRva2VuIHJlcXVpcmVkJ1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBWZXJpZnkgSldUIHRva2VuXHJcbiAgICBjb25zdCBkZWNvZGVkID0gYXdhaXQgand0VmVyaWZ5KHRva2VuKTtcclxuICAgIGlmICghZGVjb2RlZCB8fCAhZGVjb2RlZC51c2VySWQgfHwgIWRlY29kZWQucm9sZSkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oe1xyXG4gICAgICAgIGVycm9yOiAnVW5hdXRob3JpemVkJyxcclxuICAgICAgICBtZXNzYWdlOiAnSW52YWxpZCBhdXRoZW50aWNhdGlvbiB0b2tlbidcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdXNlciBoYXMgYWRtaW4gcm9sZVxyXG4gICAgaWYgKGRlY29kZWQucm9sZSAhPT0gJ2FkbWluJykge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDMpLmpzb24oe1xyXG4gICAgICAgIGVycm9yOiAnRm9yYmlkZGVuJyxcclxuICAgICAgICBtZXNzYWdlOiAnQWRtaW4gYWNjZXNzIHJlcXVpcmVkIGZvciB0aGlzIG9wZXJhdGlvbidcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgYWxsIGNoZWNrcyBwYXNzLCBhbGxvdyBhY2Nlc3NcclxuICAgIG5leHQoKTtcclxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdBZG1pbiBQREYgQWNjZXNzIE1pZGRsZXdhcmUgRXJyb3I6JywgZXJyb3IpO1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xyXG4gICAgICBlcnJvcjogJ0ludGVybmFsIFNlcnZlciBFcnJvcicsXHJcbiAgICAgIG1lc3NhZ2U6ICdGYWlsZWQgdG8gdmVyaWZ5IGFkbWluIGFjY2VzcydcclxuICAgIH0pO1xyXG4gIH1cclxufSJdfQ==
import rateLimit from 'express-rate-limit';
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
export function securityHeaders(req, res, next) {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Content Security Policy (basic)
    res.setHeader('Content-Security-Policy', "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self' data:; " +
        "connect-src 'self' https:; " +
        "frame-ancestors 'none';");
    next();
}
// Request logging middleware for security monitoring
export function securityLogger(req, res, next) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWlkZGxld2FyZS9zZWN1cml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsTUFBTSxvQkFBb0IsQ0FBQztBQUczQyw2Q0FBNkM7QUFDN0MsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQztJQUNyQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUUsYUFBYTtJQUN2QyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSw4REFBOEQ7SUFDbkgsT0FBTyxFQUFFO1FBQ1AsS0FBSyxFQUFFLDJEQUEyRDtLQUNuRTtJQUNELGVBQWUsRUFBRSxJQUFJO0lBQ3JCLGFBQWEsRUFBRSxLQUFLO0NBQ3JCLENBQUMsQ0FBQztBQUVILDBDQUEwQztBQUMxQyxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxTQUFTLENBQUM7SUFDeEMsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxFQUFFLGFBQWE7SUFDdkMsR0FBRyxFQUFFLEdBQUcsRUFBRSw2Q0FBNkM7SUFDdkQsT0FBTyxFQUFFO1FBQ1AsS0FBSyxFQUFFLDRDQUE0QztLQUNwRDtJQUNELGVBQWUsRUFBRSxJQUFJO0lBQ3JCLGFBQWEsRUFBRSxLQUFLO0NBQ3JCLENBQUMsQ0FBQztBQUVILDRDQUE0QztBQUM1QyxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxTQUFTLENBQUM7SUFDOUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxFQUFFLFNBQVM7SUFDbkMsR0FBRyxFQUFFLENBQUMsRUFBRSxzREFBc0Q7SUFDOUQsT0FBTyxFQUFFO1FBQ1AsS0FBSyxFQUFFLDJEQUEyRDtLQUNuRTtJQUNELGVBQWUsRUFBRSxJQUFJO0lBQ3JCLGFBQWEsRUFBRSxLQUFLO0NBQ3JCLENBQUMsQ0FBQztBQUVILDhCQUE4QjtBQUM5QixNQUFNLFVBQVUsZUFBZSxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBUztJQUNwRSx1QkFBdUI7SUFDdkIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUV6Qyw2QkFBNkI7SUFDN0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUVuRCx3QkFBd0I7SUFDeEIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUVuRCxrQkFBa0I7SUFDbEIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO0lBRXBFLGtDQUFrQztJQUNsQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlCQUF5QixFQUNyQyxzQkFBc0I7UUFDdEIsbURBQW1EO1FBQ25ELG9DQUFvQztRQUNwQywrQkFBK0I7UUFDL0IseUJBQXlCO1FBQ3pCLDZCQUE2QjtRQUM3Qix5QkFBeUIsQ0FDMUIsQ0FBQztJQUVGLElBQUksRUFBRSxDQUFDO0FBQ1QsQ0FBQztBQUVELHFEQUFxRDtBQUNyRCxNQUFNLFVBQVUsY0FBYyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBUztJQUNuRSxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxhQUFhLElBQUksU0FBUyxDQUFDO0lBQy9ELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksU0FBUyxDQUFDO0lBQ3JELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDMUIsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUVwQiw0QkFBNEI7SUFDNUIsSUFBSSxNQUFNLEtBQUssTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM5RSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksU0FBUyxlQUFlLE1BQU0sSUFBSSxHQUFHLFNBQVMsRUFBRSxNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELHdCQUF3QjtJQUN4QixNQUFNLGtCQUFrQixHQUFHO1FBQ3pCLDhEQUE4RDtRQUM5RCxzREFBc0Q7S0FDdkQsQ0FBQztJQUVGLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNuRCxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2xFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLHVCQUF1QixNQUFNLElBQUksR0FBRyxTQUFTLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztJQUM3RyxDQUFDO0lBRUQsSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJhdGVMaW1pdCBmcm9tICdleHByZXNzLXJhdGUtbGltaXQnO1xyXG5pbXBvcnQgdHlwZSB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XHJcblxyXG4vLyBSYXRlIGxpbWl0aW5nIGZvciBhdXRoZW50aWNhdGlvbiBlbmRwb2ludHNcclxuZXhwb3J0IGNvbnN0IGF1dGhSYXRlTGltaXQgPSByYXRlTGltaXQoe1xyXG4gIHdpbmRvd01zOiAxNSAqIDYwICogMTAwMCwgLy8gMTUgbWludXRlc1xyXG4gIG1heDogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IDUgOiA1MCwgLy8gTGltaXQgZWFjaCBJUCB0byA1IHJlcXVlc3RzIHBlciB3aW5kb3dNcyBpbiBwcm9kLCA1MCBpbiBkZXZcclxuICBtZXNzYWdlOiB7XHJcbiAgICBlcnJvcjogJ1RvbyBtYW55IGF1dGhlbnRpY2F0aW9uIGF0dGVtcHRzLCBwbGVhc2UgdHJ5IGFnYWluIGxhdGVyLidcclxuICB9LFxyXG4gIHN0YW5kYXJkSGVhZGVyczogdHJ1ZSxcclxuICBsZWdhY3lIZWFkZXJzOiBmYWxzZSxcclxufSk7XHJcblxyXG4vLyBSYXRlIGxpbWl0aW5nIGZvciBnZW5lcmFsIEFQSSBlbmRwb2ludHNcclxuZXhwb3J0IGNvbnN0IGdlbmVyYWxSYXRlTGltaXQgPSByYXRlTGltaXQoe1xyXG4gIHdpbmRvd01zOiAxNSAqIDYwICogMTAwMCwgLy8gMTUgbWludXRlc1xyXG4gIG1heDogMTAwLCAvLyBMaW1pdCBlYWNoIElQIHRvIDEwMCByZXF1ZXN0cyBwZXIgd2luZG93TXNcclxuICBtZXNzYWdlOiB7XHJcbiAgICBlcnJvcjogJ1RvbyBtYW55IHJlcXVlc3RzLCBwbGVhc2UgdHJ5IGFnYWluIGxhdGVyLidcclxuICB9LFxyXG4gIHN0YW5kYXJkSGVhZGVyczogdHJ1ZSxcclxuICBsZWdhY3lIZWFkZXJzOiBmYWxzZSxcclxufSk7XHJcblxyXG4vLyBTdHJpY3RlciByYXRlIGxpbWl0aW5nIGZvciBwYXNzd29yZCByZXNldFxyXG5leHBvcnQgY29uc3QgcGFzc3dvcmRSZXNldFJhdGVMaW1pdCA9IHJhdGVMaW1pdCh7XHJcbiAgd2luZG93TXM6IDYwICogNjAgKiAxMDAwLCAvLyAxIGhvdXJcclxuICBtYXg6IDMsIC8vIExpbWl0IGVhY2ggSVAgdG8gMyBwYXNzd29yZCByZXNldCByZXF1ZXN0cyBwZXIgaG91clxyXG4gIG1lc3NhZ2U6IHtcclxuICAgIGVycm9yOiAnVG9vIG1hbnkgcGFzc3dvcmQgcmVzZXQgYXR0ZW1wdHMsIHBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJ1xyXG4gIH0sXHJcbiAgc3RhbmRhcmRIZWFkZXJzOiB0cnVlLFxyXG4gIGxlZ2FjeUhlYWRlcnM6IGZhbHNlLFxyXG59KTtcclxuXHJcbi8vIFNlY3VyaXR5IGhlYWRlcnMgbWlkZGxld2FyZVxyXG5leHBvcnQgZnVuY3Rpb24gc2VjdXJpdHlIZWFkZXJzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgLy8gUHJldmVudCBjbGlja2phY2tpbmdcclxuICByZXMuc2V0SGVhZGVyKCdYLUZyYW1lLU9wdGlvbnMnLCAnREVOWScpO1xyXG5cclxuICAvLyBQcmV2ZW50IE1JTUUgdHlwZSBzbmlmZmluZ1xyXG4gIHJlcy5zZXRIZWFkZXIoJ1gtQ29udGVudC1UeXBlLU9wdGlvbnMnLCAnbm9zbmlmZicpO1xyXG5cclxuICAvLyBFbmFibGUgWFNTIHByb3RlY3Rpb25cclxuICByZXMuc2V0SGVhZGVyKCdYLVhTUy1Qcm90ZWN0aW9uJywgJzE7IG1vZGU9YmxvY2snKTtcclxuXHJcbiAgLy8gUmVmZXJyZXIgcG9saWN5XHJcbiAgcmVzLnNldEhlYWRlcignUmVmZXJyZXItUG9saWN5JywgJ3N0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nKTtcclxuXHJcbiAgLy8gQ29udGVudCBTZWN1cml0eSBQb2xpY3kgKGJhc2ljKVxyXG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtU2VjdXJpdHktUG9saWN5JyxcclxuICAgIFwiZGVmYXVsdC1zcmMgJ3NlbGYnOyBcIiArXHJcbiAgICBcInNjcmlwdC1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJyAndW5zYWZlLWV2YWwnOyBcIiArXHJcbiAgICBcInN0eWxlLXNyYyAnc2VsZicgJ3Vuc2FmZS1pbmxpbmUnOyBcIiArXHJcbiAgICBcImltZy1zcmMgJ3NlbGYnIGRhdGE6IGh0dHBzOjsgXCIgK1xyXG4gICAgXCJmb250LXNyYyAnc2VsZicgZGF0YTo7IFwiICtcclxuICAgIFwiY29ubmVjdC1zcmMgJ3NlbGYnIGh0dHBzOjsgXCIgK1xyXG4gICAgXCJmcmFtZS1hbmNlc3RvcnMgJ25vbmUnO1wiXHJcbiAgKTtcclxuXHJcbiAgbmV4dCgpO1xyXG59XHJcblxyXG4vLyBSZXF1ZXN0IGxvZ2dpbmcgbWlkZGxld2FyZSBmb3Igc2VjdXJpdHkgbW9uaXRvcmluZ1xyXG5leHBvcnQgZnVuY3Rpb24gc2VjdXJpdHlMb2dnZXIocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XHJcbiAgY29uc3QgaXAgPSByZXEuaXAgfHwgcmVxLmNvbm5lY3Rpb24ucmVtb3RlQWRkcmVzcyB8fCAndW5rbm93bic7XHJcbiAgY29uc3QgdXNlckFnZW50ID0gcmVxLmdldCgnVXNlci1BZ2VudCcpIHx8ICd1bmtub3duJztcclxuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kO1xyXG4gIGNvbnN0IHVybCA9IHJlcS51cmw7XHJcblxyXG4gIC8vIExvZyBzdXNwaWNpb3VzIGFjdGl2aXRpZXNcclxuICBpZiAobWV0aG9kID09PSAnUE9TVCcgJiYgKHVybC5pbmNsdWRlcygnL2F1dGgnKSB8fCB1cmwuaW5jbHVkZXMoJy9wYXNzd29yZCcpKSkge1xyXG4gICAgY29uc29sZS5sb2coYFske3RpbWVzdGFtcH1dIFNFQ1VSSVRZOiAke21ldGhvZH0gJHt1cmx9IGZyb20gJHtpcH0gLSAke3VzZXJBZ2VudH1gKTtcclxuICB9XHJcblxyXG4gIC8vIExvZyBwb3RlbnRpYWwgYXR0YWNrc1xyXG4gIGNvbnN0IHN1c3BpY2lvdXNQYXR0ZXJucyA9IFtcclxuICAgIC8oXFwuXFwufFxcL2V0Y1xcL3xcXC9iaW5cXC98ZXZhbFxcKHxzY3JpcHQ+fGphdmFzY3JpcHQ6fG9uXFx3K1xccyo9KS9pLFxyXG4gICAgL3VuaW9uLipzZWxlY3R8c2VsZWN0Lipmcm9tfGRyb3AuKnRhYmxlfGluc2VydC4qaW50by9pXHJcbiAgXTtcclxuXHJcbiAgY29uc3QgcmVxdWVzdEJvZHkgPSBKU09OLnN0cmluZ2lmeShyZXEuYm9keSB8fCB7fSk7XHJcbiAgaWYgKHN1c3BpY2lvdXNQYXR0ZXJucy5zb21lKHBhdHRlcm4gPT4gcGF0dGVybi50ZXN0KHJlcXVlc3RCb2R5KSkpIHtcclxuICAgIGNvbnNvbGUud2FybihgWyR7dGltZXN0YW1wfV0gUE9URU5USUFMIEFUVEFDSzogJHttZXRob2R9ICR7dXJsfSBmcm9tICR7aXB9IC0gU3VzcGljaW91cyBwYXlsb2FkIGRldGVjdGVkYCk7XHJcbiAgfVxyXG5cclxuICBuZXh0KCk7XHJcbn0iXX0=
import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { pdfSecurity, adminPdfAccess } from '../middleware/pdfSecurity';
const router = Router();
// Serve PDF files with security middleware
router.get('/secure/:filename', pdfSecurity, (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../../uploads', filename);
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'PDF file not found'
            });
        }
        // Check if the file is actually a PDF
        if (!filename.toLowerCase().endsWith('.pdf')) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Only PDF files can be accessed through this endpoint'
            });
        }
        // Set appropriate headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        fileStream.on('error', (error) => {
            console.error('Error streaming PDF file:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to stream PDF file'
            });
        });
    }
    catch (error) {
        console.error('Error serving secure PDF:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to serve PDF file'
        });
    }
});
// Admin endpoint to manage PDF access permissions
router.post('/:courseId/permissions', adminPdfAccess, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { userId, action } = req.body; // action: 'grant' or 'revoke'
        // In a real implementation, you would update a PDF access permissions collection
        // For this example, we'll just return success
        if (!['grant', 'revoke'].includes(action)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Action must be either 'grant' or 'revoke'"
            });
        }
        // TODO: Implement actual permission management logic
        console.log(`Admin ${action}ed PDF access for user ${userId} on course ${courseId}`);
        res.json({
            success: true,
            message: `PDF access ${action}ed successfully for user ${userId}`
        });
    }
    catch (error) {
        console.error('Error managing PDF permissions:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to manage PDF permissions'
        });
    }
});
// Admin endpoint to get PDF access list for a course
router.get('/:courseId/access-list', adminPdfAccess, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        // TODO: Implement actual access list retrieval from database
        // For this example, return mock data
        const mockAccessList = [
            {
                userId: 'user123',
                userName: 'John Doe',
                userEmail: 'john@example.com',
                accessGranted: true,
                lastAccessed: '2023-12-10T10:30:00Z'
            },
            {
                userId: 'user456',
                userName: 'Jane Smith',
                userEmail: 'jane@example.com',
                accessGranted: true,
                lastAccessed: '2023-12-09T14:15:00Z'
            }
        ];
        res.json({
            courseId,
            accessList: mockAccessList,
            totalUsers: mockAccessList.length
        });
    }
    catch (error) {
        console.error('Error getting PDF access list:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to get PDF access list'
        });
    }
});
export default router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy9wZGYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNqQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3BCLE9BQU8sRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFeEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxFQUFFLENBQUM7QUFFeEIsMkNBQTJDO0FBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQ3hELElBQUksQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVqRSx1QkFBdUI7UUFDdkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUM3QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixLQUFLLEVBQUUsV0FBVztnQkFDbEIsT0FBTyxFQUFFLG9CQUFvQjthQUM5QixDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsc0NBQXNDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDN0MsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsS0FBSyxFQUFFLGFBQWE7Z0JBQ3BCLE9B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QUM7UUFFckMsNkRBQTZEO1FBQzdELHFDQUFxQztRQUVyQyxNQUFNLGNBQWMsR0FBRztZQUNyQjtnQkFDRSxNQUFNLEVBQUUsU0FBUztnQkFDakIsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFNBQVMsRUFBRSxrQkFBa0I7Z0JBQzdCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixZQUFZLEVBQUUsc0JBQXNCO2FBQ3JDO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixTQUFTLEVBQUUsa0JBQWtCO2dCQUM3QixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsWUFBWSxFQUFFLHNCQUFzQjthQUNyQztTQUNGLENBQUM7UUFFRixHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ1AsUUFBUTtZQUNSLFVBQVUsRUFBRSxjQUFjO1lBQzFCLFVBQVUsRUFBRSxjQUFjLENBQUMsTUFBTTtTQUNsQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztRQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLEtBQUssRUFBRSx1QkFBdUI7WUFDOUIsT0FBTyxFQUFFLCtCQUErQjtTQUN6QyxDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxlQUFlLE1BQU0sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0IHsgcGRmU2VjdXJpdHksIGFkbWluUGRmQWNjZXNzIH0gZnJvbSAnLi4vbWlkZGxld2FyZS9wZGZTZWN1cml0eSc7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBSb3V0ZXIoKTtcclxuXHJcbi8vIFNlcnZlIFBERiBmaWxlcyB3aXRoIHNlY3VyaXR5IG1pZGRsZXdhcmVcclxucm91dGVyLmdldCgnL3NlY3VyZS86ZmlsZW5hbWUnLCBwZGZTZWN1cml0eSwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGZpbGVuYW1lID0gcmVxLnBhcmFtcy5maWxlbmFtZTtcclxuICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL3VwbG9hZHMnLCBmaWxlbmFtZSk7XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgZmlsZSBleGlzdHNcclxuICAgIGlmICghZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHtcclxuICAgICAgICBlcnJvcjogJ05vdCBGb3VuZCcsXHJcbiAgICAgICAgbWVzc2FnZTogJ1BERiBmaWxlIG5vdCBmb3VuZCdcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGZpbGUgaXMgYWN0dWFsbHkgYSBQREZcclxuICAgIGlmICghZmlsZW5hbWUudG9Mb3dlckNhc2UoKS5lbmRzV2l0aCgnLnBkZicpKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XHJcbiAgICAgICAgZXJyb3I6ICdCYWQgUmVxdWVzdCcsXHJcbiAgICAgICAgbWVzc2FnZTogJ09ubHkgUERGIGZpbGVzIGNhbiBiZSBhY2Nlc3NlZCB0aHJvdWdoIHRoaXMgZW5kcG9pbnQnXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldCBhcHByb3ByaWF0ZSBoZWFkZXJzIGZvciBQREZcclxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9wZGYnKTtcclxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCBgaW5saW5lOyBmaWxlbmFtZT1cIiR7ZmlsZW5hbWV9XCJgKTtcclxuXHJcbiAgICAvLyBTdHJlYW0gdGhlIGZpbGVcclxuICAgIGNvbnN0IGZpbGVTdHJlYW0gPSBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVQYXRoKTtcclxuICAgIGZpbGVTdHJlYW0ucGlwZShyZXMpO1xyXG5cclxuICAgIGZpbGVTdHJlYW0ub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHN0cmVhbWluZyBQREYgZmlsZTonLCBlcnJvcik7XHJcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcclxuICAgICAgICBlcnJvcjogJ0ludGVybmFsIFNlcnZlciBFcnJvcicsXHJcbiAgICAgICAgbWVzc2FnZTogJ0ZhaWxlZCB0byBzdHJlYW0gUERGIGZpbGUnXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNlcnZpbmcgc2VjdXJlIFBERjonLCBlcnJvcik7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XHJcbiAgICAgIGVycm9yOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyxcclxuICAgICAgbWVzc2FnZTogJ0ZhaWxlZCB0byBzZXJ2ZSBQREYgZmlsZSdcclxuICAgIH0pO1xyXG4gIH1cclxufSk7XHJcblxyXG4vLyBBZG1pbiBlbmRwb2ludCB0byBtYW5hZ2UgUERGIGFjY2VzcyBwZXJtaXNzaW9uc1xyXG5yb3V0ZXIucG9zdCgnLzpjb3Vyc2VJZC9wZXJtaXNzaW9ucycsIGFkbWluUGRmQWNjZXNzLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgY291cnNlSWQgPSByZXEucGFyYW1zLmNvdXJzZUlkO1xyXG4gICAgY29uc3QgeyB1c2VySWQsIGFjdGlvbiB9ID0gcmVxLmJvZHk7IC8vIGFjdGlvbjogJ2dyYW50JyBvciAncmV2b2tlJ1xyXG5cclxuICAgIC8vIEluIGEgcmVhbCBpbXBsZW1lbnRhdGlvbiwgeW91IHdvdWxkIHVwZGF0ZSBhIFBERiBhY2Nlc3MgcGVybWlzc2lvbnMgY29sbGVjdGlvblxyXG4gICAgLy8gRm9yIHRoaXMgZXhhbXBsZSwgd2UnbGwganVzdCByZXR1cm4gc3VjY2Vzc1xyXG5cclxuICAgIGlmICghWydncmFudCcsICdyZXZva2UnXS5pbmNsdWRlcyhhY3Rpb24pKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XHJcbiAgICAgICAgZXJyb3I6ICdCYWQgUmVxdWVzdCcsXHJcbiAgICAgICAgbWVzc2FnZTogXCJBY3Rpb24gbXVzdCBiZSBlaXRoZXIgJ2dyYW50JyBvciAncmV2b2tlJ1wiXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPRE86IEltcGxlbWVudCBhY3R1YWwgcGVybWlzc2lvbiBtYW5hZ2VtZW50IGxvZ2ljXHJcbiAgICBjb25zb2xlLmxvZyhgQWRtaW4gJHthY3Rpb259ZWQgUERGIGFjY2VzcyBmb3IgdXNlciAke3VzZXJJZH0gb24gY291cnNlICR7Y291cnNlSWR9YCk7XHJcblxyXG4gICAgcmVzLmpzb24oe1xyXG4gICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiBgUERGIGFjY2VzcyAke2FjdGlvbn1lZCBzdWNjZXNzZnVsbHkgZm9yIHVzZXIgJHt1c2VySWR9YFxyXG4gICAgfSk7XHJcblxyXG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG1hbmFnaW5nIFBERiBwZXJtaXNzaW9uczonLCBlcnJvcik7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XHJcbiAgICAgIGVycm9yOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyxcclxuICAgICAgbWVzc2FnZTogJ0ZhaWxlZCB0byBtYW5hZ2UgUERGIHBlcm1pc3Npb25zJ1xyXG4gICAgfSk7XHJcbiAgfVxyXG59KTtcclxuXHJcbi8vIEFkbWluIGVuZHBvaW50IHRvIGdldCBQREYgYWNjZXNzIGxpc3QgZm9yIGEgY291cnNlXHJcbnJvdXRlci5nZXQoJy86Y291cnNlSWQvYWNjZXNzLWxpc3QnLCBhZG1pblBkZkFjY2VzcywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGNvdXJzZUlkID0gcmVxLnBhcmFtcy5jb3Vyc2VJZDtcclxuXHJcbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgYWN0dWFsIGFjY2VzcyBsaXN0IHJldHJpZXZhbCBmcm9tIGRhdGFiYXNlXHJcbiAgICAvLyBGb3IgdGhpcyBleGFtcGxlLCByZXR1cm4gbW9jayBkYXRhXHJcblxyXG4gICAgY29uc3QgbW9ja0FjY2Vzc0xpc3QgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICB1c2VySWQ6ICd1c2VyMTIzJyxcclxuICAgICAgICB1c2VyTmFtZTogJ0pvaG4gRG9lJyxcclxuICAgICAgICB1c2VyRW1haWw6ICdqb2huQGV4YW1wbGUuY29tJyxcclxuICAgICAgICBhY2Nlc3NHcmFudGVkOiB0cnVlLFxyXG4gICAgICAgIGxhc3RBY2Nlc3NlZDogJzIwMjMtMTItMTBUMTA6MzA6MDBaJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdXNlcklkOiAndXNlcjQ1NicsXHJcbiAgICAgICAgdXNlck5hbWU6ICdKYW5lIFNtaXRoJyxcclxuICAgICAgICB1c2VyRW1haWw6ICdqYW5lQGV4YW1wbGUuY29tJyxcclxuICAgICAgICBhY2Nlc3NHcmFudGVkOiB0cnVlLFxyXG4gICAgICAgIGxhc3RBY2Nlc3NlZDogJzIwMjMtMTItMDlUMTQ6MTU6MDBaJ1xyXG4gICAgICB9XHJcbiAgICBdO1xyXG5cclxuICAgIHJlcy5qc29uKHtcclxuICAgICAgY291cnNlSWQsXHJcbiAgICAgIGFjY2Vzc0xpc3Q6IG1vY2tBY2Nlc3NMaXN0LFxyXG4gICAgICB0b3RhbFVzZXJzOiBtb2NrQWNjZXNzTGlzdC5sZW5ndGhcclxuICAgIH0pO1xyXG5cclxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIFBERiBhY2Nlc3MgbGlzdDonLCBlcnJvcik7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XHJcbiAgICAgIGVycm9yOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyxcclxuICAgICAgbWVzc2FnZTogJ0ZhaWxlZCB0byBnZXQgUERGIGFjY2VzcyBsaXN0J1xyXG4gICAgfSk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjsiXX0=
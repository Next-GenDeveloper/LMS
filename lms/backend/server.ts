import { connectMongoDB, connectPostgreSQL } from './src/config/database.ts';
import { ENV } from './src/config/env.ts';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = ENV.PORT || 5000;

async function bootstrap() {
    await connectMongoDB();
    if (ENV.USE_POSTGRES) {
        await connectPostgreSQL();
    } else {
        console.log('ℹ️ Skipping PostgreSQL connection (USE_POSTGRES is false)');
    }

    // Seed admin account
    const { seedAdmin } = await import('./src/utils/seedAdmin.ts');
    await seedAdmin();

    const { default: app } = await import('./app.ts');

    // Check for SSL certificates
    const sslKeyPath = process.env.SSL_KEY_PATH;
    const sslCertPath = process.env.SSL_CERT_PATH;

    if (sslKeyPath && sslCertPath && fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
        // HTTPS server
        const sslOptions = {
            key: fs.readFileSync(sslKeyPath),
            cert: fs.readFileSync(sslCertPath),
        };

        const httpsServer = https.createServer(sslOptions, app);
        httpsServer.listen(PORT, () => {
            console.log(`🔒 HTTPS Server is running on port ${PORT}`);
        });
    } else {
        // HTTP server (development)
        app.listen(PORT, () => {
            console.log(`🌐 HTTP Server is running on port ${PORT}`);
            if (ENV.NODE_ENV === 'production') {
                console.warn('⚠️  WARNING: Running in production without HTTPS! Configure SSL certificates.');
            }
        });
    }
}

bootstrap().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
});

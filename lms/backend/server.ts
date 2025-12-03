import { connectMongoDB, connectPostgreSQL } from './src/config/database.ts';
import { ENV } from './src/config/env.ts';

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

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

bootstrap().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
});

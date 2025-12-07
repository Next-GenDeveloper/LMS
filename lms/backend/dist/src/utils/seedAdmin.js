import { User } from '../models/User.ts';
import { hashPassword } from './Passwordhash.ts';
const ADMIN_EMAIL = 'admin@9tangle.com';
const ADMIN_PASSWORD = 'Admin@9tangle2025!';
export async function seedAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            // Ensure existing user is admin
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                existingAdmin.isVerified = true;
                await existingAdmin.save();
                console.log('✅ Updated existing user to admin role');
            }
            else {
                console.log('✅ Admin account already exists');
            }
            return;
        }
        // Create new admin account
        const hashedPassword = await hashPassword(ADMIN_PASSWORD);
        const adminUser = new User({
            email: ADMIN_EMAIL,
            password: hashedPassword,
            firstName: 'Super',
            lastName: 'Admin',
            role: 'admin',
            isVerified: true,
        });
        await adminUser.save();
        console.log('✅ Super Admin account created successfully');
        console.log(`   Email: ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
    }
    catch (error) {
        console.error('❌ Error seeding admin account:', error);
    }
}

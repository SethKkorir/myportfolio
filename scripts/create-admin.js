/**
 * One-time admin account creation script
 * Run with: node scripts/create-admin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const ADMIN_EMAIL = 'sethkorir@admin.com';
const ADMIN_PASSWORD = 'Korir@2026';

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Check if admin already exists
        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log(`✅ Admin account already exists: ${ADMIN_EMAIL}`);
            console.log('If you forgot the password, delete this user from MongoDB Atlas and re-run.');
            process.exit(0);
        }

        // Hash password and create admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        const adminUser = new User({ email: ADMIN_EMAIL, password: hashedPassword });
        await adminUser.save();

        console.log('\n🎉 Admin account created successfully!');
        console.log('─────────────────────────────────────');
        console.log(`Email:    ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
        console.log('─────────────────────────────────────');
        console.log('Login at: http://localhost:5173/login');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to create admin:', err.message);
        process.exit(1);
    }
}

createAdmin();

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const userData = {
  name: 'Admin User',
  email: 'admin@itechpark.com',
  password: 'admin123', // This will be hashed automatically
  role: 'admin',
  isActive: true
};

const seedUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/itech_dashboard');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create admin user
    const user = await User.create(userData);
    console.log('Admin user seeded successfully:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Email: admin@itechpark.com');
    console.log('Password: admin123');
    console.log('========================\n');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedUser();
}

module.exports = seedUser;

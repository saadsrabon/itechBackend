const mongoose = require('mongoose');
const Hero = require('../models/Hero');
require('dotenv').config();

const heroData = {
  title: "Result Driven Digital Agency",
  description: "I-Tech Park BD serves as your Digital Marketing Partner in all ways possible. From Social Media Marketing, WordPress Customization to ranking your website in search engines(SEO), we assist you in your digital presence.",
  primaryButton: {
    text: "Book a Call",
    link: "https://calendly.com/abchowdhury-m/30min",
    target: "_blank"
  },
  secondaryButton: {
    text: "See Our Works",
    link: "#works",
    target: "_self"
  },
  videoUrl: "https://www.youtube.com/watch?v=4HQs-yyCrr",
  isActive: true,
  order: 1
};

const seedHero = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/itech_dashboard');
    console.log('Connected to MongoDB');

    // Clear existing hero sections
    await Hero.deleteMany({});
    console.log('Cleared existing hero sections');

    // Create new hero section
    const hero = await Hero.create(heroData);
    console.log('Hero section seeded successfully:', hero);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding hero section:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedHero();
}

module.exports = seedHero;

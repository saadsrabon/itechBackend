const mongoose = require('mongoose');
const Service = require('../models/Service');
require('dotenv').config();

const servicesData = [
  // Design Section
  {
    section: "Design",
    title: "Graphic Design",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/images-1758844175642-64834234.png", alt: "Graphic Design Example", order: 1 },
      { image: "/uploads/services/images-1758844175643-2620414.png", alt: "Graphic Design Example 2", order: 2 },
      { image: "/uploads/services/images-1758844175646-88810328.png", alt: "Graphic Design Example 3", order: 3 }
    ],
    isActive: true,
    order: 1
  },
  {
    section: "Design",
    title: "Motion Poster",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/images-1758844578826-571520629.png", alt: "Motion Poster Example", order: 1 }
    ],
    isActive: true,
    order: 2
  },
  {
    section: "Design",
    title: "UI/UX",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/image-1758736412091-511095059.jpg", alt: "UI/UX Design Example", order: 1 }
    ],
    isActive: true,
    order: 3
  },
  {
    section: "Design",
    title: "Logo Animation",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/image-1758738161143-860953177.jpg", alt: "Logo Animation Example", order: 1 }
    ],
    isActive: true,
    order: 4
  },

  // Web Development Section
  {
    section: "Web Development",
    title: "Custom Code",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/web1.png", alt: "Custom Code Example", order: 1 }
    ],
    isActive: true,
    order: 1
  },
  {
    section: "Web Development",
    title: "WordPress",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/web2.png", alt: "WordPress Development Example", order: 1 }
    ],
    isActive: true,
    order: 2
  },
  {
    section: "Web Development",
    title: "Shopify",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/web3.png", alt: "Shopify Development Example", order: 1 }
    ],
    isActive: true,
    order: 3
  },

  // Video Editing Section
  {
    section: "Video Editing",
    title: "Video Editing",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/video1.png", alt: "Video Editing Example", order: 1 }
    ],
    isActive: true,
    order: 1
  },

  // Search Engine Marketing Section
  {
    section: "Search Engine Marketing",
    title: "YouTube SEO",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/seo1.png", alt: "YouTube SEO Example", order: 1 }
    ],
    isActive: true,
    order: 1
  },
  {
    section: "Search Engine Marketing",
    title: "SEO",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/seo2.png", alt: "SEO Services Example", order: 1 }
    ],
    isActive: true,
    order: 2
  },
  {
    section: "Search Engine Marketing",
    title: "Google Ads",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/seo3.png", alt: "Google Ads Example", order: 1 }
    ],
    isActive: true,
    order: 3
  },

  // Social Media Marketing Section
  {
    section: "Social Media Marketing",
    title: "Organic Social Media",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/social1.png", alt: "Organic Social Media Example", order: 1 }
    ],
    isActive: true,
    order: 1
  },
  {
    section: "Social Media Marketing",
    title: "Paid Social Media",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/social2.png", alt: "Paid Social Media Example", order: 1 }
    ],
    isActive: true,
    order: 2
  },
  {
    section: "Social Media Marketing",
    title: "Monetization",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/social3.png", alt: "Social Media Monetization Example", order: 1 }
    ],
    isActive: true,
    order: 3
  },

  // Business Consultation Section
  {
    section: "Business Consultation",
    title: "Business Consultation",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/business.png", alt: "Business Consultation Example", order: 1 }
    ],
    isActive: true,
    order: 1
  },

  // Virtual Assistant Section
  {
    section: "Virtual Assistant",
    title: "Virtual Assistant",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/virtual1.png", alt: "Virtual Assistant Example", order: 1 }
    ],
    isActive: true,
    order: 1
  },

  // Cyber Security Section
  {
    section: "Cyber Security",
    title: "Cyber Security",
    content: "I-Tech Park BD serves as your Digital Marketing Partner in all way possible. From Social Media Marketing to WordPress Customization, and ranking your website in search engines (SEO), we assist you in your digital presence.",
    images: [
      { image: "/uploads/services/cyber.png", alt: "Cyber Security Example", order: 1 }
    ],
    isActive: true,
    order: 1
  }
];

const seedServices = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/itech_dashboard');
    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Create new services
    const services = await Service.insertMany(servicesData);
    console.log(`Services seeded successfully: ${services.length} services created`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedServices();
}

module.exports = seedServices;

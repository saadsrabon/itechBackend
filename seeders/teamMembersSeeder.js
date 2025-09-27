const mongoose = require('mongoose');
const TeamMember = require('../models/TeamMember');

const teamMembersData = [
  // Core Team
  {
    section: "Core Team",
    name: "Masud Rana",
    designation: "Founder & Chief Executive Officer.",
    content: "Our CEO is a visionary leader who drives innovation and inspires excellence, guiding our team to consistently achieve outstanding results.",
    image: "/assets/member/core1.png",
    order: 1,
    isActive: true
  },
  {
    section: "Core Team",
    name: "Abu Bakar Chowdhury",
    designation: "Co Founder & Chief Operating Officer",
    content: "",
    image: "/assets/member/core2.png",
    order: 2,
    isActive: true
  },
  {
    section: "Core Team",
    name: "Biddut Bhattacharjee",
    designation: "Chief Technology Officer",
    content: "",
    image: "/assets/member/core3.png",
    order: 3,
    isActive: true
  },

  // Design Team
  {
    section: "Design",
    name: "Abdur Rabbi",
    designation: "Logo Designer- Team Lead",
    content: "",
    image: "/assets/member/design1.png",
    order: 1,
    isActive: true
  },
  {
    section: "Design",
    name: "Ashadul Islam Ahad",
    designation: "Design Team - Asst. Team Lead",
    content: "",
    image: "/assets/member/designer2.png",
    order: 2,
    isActive: true
  },
  {
    section: "Design",
    name: "Md. Abdul Motaleb",
    designation: "Motion Graphics - Team Lead",
    content: "",
    image: "/assets/member/designer3.png",
    order: 3,
    isActive: true
  },
  {
    section: "Design",
    name: "Shakal Ahmed",
    designation: "Design Team - Team Lead",
    content: "",
    image: "/assets/member/designer4.png",
    order: 4,
    isActive: true
  },

  // Digital Marketing Team
  {
    section: "Digital Marketing",
    name: "Sume Akter",
    designation: "Marketer -Team Lead",
    content: "",
    image: "/assets/member/digitalmarketer1.png",
    order: 1,
    isActive: true
  },
  {
    section: "Digital Marketing",
    name: "Anisur Rahman",
    designation: "Instagram Linkdin Organic Marketing-Asst Team Lead",
    content: "",
    image: "/assets/member/digitalmarketer2.png",
    order: 2,
    isActive: true
  },
  {
    section: "Digital Marketing",
    name: "Dewan Miah",
    designation: "Facebook Organic Marketing -Team Member",
    content: "",
    image: "/assets/member/digitalmarketer3.png",
    order: 3,
    isActive: true
  },
  {
    section: "Digital Marketing",
    name: "Jaynto Kumar Roy",
    designation: "Facebook Organic Marketing - Team Member",
    content: "",
    image: "/assets/member/digitalmarketer4.png",
    order: 4,
    isActive: true
  },
  {
    section: "Digital Marketing",
    name: "Md Mostafijur Rahman",
    designation: "Lead Generation Expert",
    content: "",
    image: "/assets/member/digitalmarketer5.png",
    order: 5,
    isActive: true
  },
  {
    section: "Digital Marketing",
    name: "Nijam Uddin",
    designation: "Instagram Organic Marketing - Team Lead",
    content: "",
    image: "/assets/member/digitalmarketer6.png",
    order: 6,
    isActive: true
  },
  {
    section: "Digital Marketing",
    name: "Rakib Islam",
    designation: "Instagram+Twitter Organic Marketing -Asst. Team Lead",
    content: "",
    image: "/assets/member/digitalmarketer7.png",
    order: 7,
    isActive: true
  },
  {
    section: "Digital Marketing",
    name: "Shihab Uddin Fahim",
    designation: "Social Media Paid Marketing - Team Lead",
    content: "",
    image: "/assets/member/digitalmarketer8.png",
    order: 8,
    isActive: true
  },
  {
    section: "Digital Marketing",
    name: "Tahmid Nabil",
    designation: "Facebook Organic Marketing - Team Lead",
    content: "",
    image: "/assets/member/digitalmarketer10.png",
    order: 9,
    isActive: true
  },

  // Video Editing Team
  {
    section: "Video Editing",
    name: "Al Af Muntasir",
    designation: "Video Editor - Team Leader",
    content: "",
    image: "/assets/member/videoeditor1.png",
    order: 1,
    isActive: true
  },

  // Web Development Team
  {
    section: "Web Development",
    name: "Sharier Nahid",
    designation: "Wordpress Developer- Team Lead",
    content: "",
    image: "/assets/member/webdeveloper1.png",
    order: 1,
    isActive: true
  },

  // Support Team
  {
    section: "Support",
    name: "Nahin Rahman",
    designation: "Support Team",
    content: "",
    image: "/assets/member/support1.png",
    order: 1,
    isActive: true
  },

  // SEO Team
  {
    section: "SEO",
    name: "Ratul Islam Rafi",
    designation: "SEO Team - Team Member(SEO)",
    content: "",
    image: "/assets/member/seo1.png",
    order: 1,
    isActive: true
  }
];

const seedTeamMembers = async () => {
  try {
    console.log('🌱 Starting team members seeding...');
    
    // Clear existing team members
    await TeamMember.deleteMany({});
    console.log('✅ Cleared existing team members');

    // Insert new team members
    const createdTeamMembers = await TeamMember.insertMany(teamMembersData);
    console.log(`✅ Created ${createdTeamMembers.length} team members`);

    // Log summary by section
    const summary = teamMembersData.reduce((acc, member) => {
      acc[member.section] = (acc[member.section] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Team Members Summary:');
    Object.entries(summary).forEach(([section, count]) => {
      console.log(`   ${section}: ${count} members`);
    });

    console.log('🎉 Team members seeding completed successfully!');
    
    return {
      success: true,
      message: 'Team members seeded successfully',
      count: createdTeamMembers.length,
      summary
    };
  } catch (error) {
    console.error('❌ Error seeding team members:', error);
    throw error;
  }
};

// Export for use in other files
module.exports = { seedTeamMembers, teamMembersData };

// Run seeder directly if this file is executed
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => seedTeamMembers())
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}




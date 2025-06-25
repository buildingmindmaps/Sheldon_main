/**
 * Seed script for creating initial course and module data
 *
 * Run this script with: node seedCoursesAndModules.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/course');
const Module = require('./models/Module');

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Sample course data
const courses = [
  {
    title: 'Profitability: Case Practice',
    description: 'Learn how to solve profitability cases using structured frameworks and real-world examples.',
    slug: 'profitability-case-practice',
    thumbnail: ''
  },
  {
    title: 'Business Frameworks Fundamentals',
    description: 'Master the core business frameworks used by top management consultants and business strategists.',
    slug: 'business-frameworks-fundamentals',
    thumbnail: ''
  }
];

// Sample module data (will be populated with course IDs after course creation)
const moduleTemplates = [
  // Modules for Profitability course
  [
    {
      title: 'Introduction to Profitability Analysis',
      order: 1,
      duration: 30,
      content: 'Overview of profitability case frameworks'
    },
    {
      title: 'Revenue Analysis Techniques',
      order: 2,
      duration: 45,
      content: 'Detailed analysis of revenue drivers'
    },
    {
      title: 'Cost Structure Evaluation',
      order: 3,
      duration: 40,
      content: 'Frameworks for analyzing cost structures'
    },
    {
      title: 'Profit Improvement Strategies',
      order: 4,
      duration: 50,
      content: 'Strategic approaches to improve profitability'
    }
  ],
  // Modules for Business Frameworks course
  [
    {
      title: 'Porter\'s Five Forces',
      order: 1,
      duration: 35,
      content: 'Understanding competitive forces that shape strategy'
    },
    {
      title: 'SWOT Analysis',
      order: 2,
      duration: 30,
      content: 'Evaluating strengths, weaknesses, opportunities, and threats'
    },
    {
      title: 'BCG Matrix',
      order: 3,
      duration: 25,
      content: 'Portfolio management using the growth-share matrix'
    },
    {
      title: 'Balanced Scorecard',
      order: 4,
      duration: 40,
      content: 'Strategic planning and management system'
    }
  ],
  // Modules for Consulting Interview course
  [
    {
      title: 'Case Interview Fundamentals',
      order: 1,
      duration: 40,
      content: 'Introduction to case interview formats and expectations'
    },
    {
      title: 'Market Sizing Cases',
      order: 2,
      duration: 45,
      content: 'Techniques for solving market sizing problems'
    },
    {
      title: 'Profitability Cases',
      order: 3,
      duration: 50,
      content: 'Approaches to profitability case questions'
    },
    {
      title: 'M&A and Growth Strategy Cases',
      order: 4,
      duration: 55,
      content: 'Frameworks for M&A and growth strategy cases'
    }
  ]
];

// Seed function
const seedData = async () => {
  try {
    // Connect to the database
    const conn = await connectDB();

    // Clear existing data
    await Course.deleteMany({});
    await Module.deleteMany({});
    console.log('Cleared existing courses and modules');

    // Create courses and modules
    for (let i = 0; i < courses.length; i++) {
      // Create the course
      const newCourse = await Course.create(courses[i]);
      console.log(`Created course: ${newCourse.title}`);

      // Create modules for this course
      const modulePromises = moduleTemplates[i].map(moduleTemplate => {
        return Module.create({
          ...moduleTemplate,
          courseId: newCourse._id
        });
      });

      const modules = await Promise.all(modulePromises);
      console.log(`Created ${modules.length} modules for ${newCourse.title}`);

      // Update course with module IDs
      newCourse.modules = modules.map(module => module._id);
      await newCourse.save();
      console.log(`Updated ${newCourse.title} with module references`);
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();

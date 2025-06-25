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
      title: 'Water Purifier Profitability Case',
      order: 1,
      duration: 60,
      level: 'Beginner',
      description: 'Solve a real-world case on a water purifier manufacturer with declining profitability.',
      
      // --- NEW: Add the case-specific data here ---
      caseStatement: 'Your client is a water purifier manufacturer in India, focused on residential customers. The client is experiencing lower profitability (defined as EBITDA/Revenue) compared to competitors. They have hired you to analyze the issue and provide recommendations.',
      caseFacts: [
        "Profitability is defined as EBITDA/Revenue.",
        "The focus is on residential customers only.",
        "There are no differences in the Revenue component compared to competitors.",
        "In the value chain, only the after-sales service component cost is higher than competitors.",
        "There are no differences in costs for material supply or the method of service employed.",
        "The warranty period and number of services per year are the same as competitors.",
        "Rates of dealership fees are standard across all competitors."
      ],

      caseConversation: [
  { sender: 'User', text: "I would first like to receive clarification on how the client is defining profitability. Is it defined as the ratio profit/revenue? Also, is the profit being considered operating profit or net profit? Is it a recent phenomenon or long term one?" },
  { sender: 'Interviewer', text: "You are correct about the definition of profitability. The client is using EBITDA (Earnings Before Interest, Tax, Depreciation & Amortization) value for profitability calculations. This issue is occurring for past one year." },
  { sender: 'User', text: "Okay. I think I am clear about the problem statement. Now, I would like to understand about the client’s business. Where is the client located in the value chain of this product? I think at a high level, such a product will have its value chain as Suppliers → Manufacturer → Distributor → Retailer." },
  { sender: 'Interviewer', text: "You are correct about the value chain. The client is mainly a manufacturer of the purifiers." },
  { sender: 'User', text: "Okay. And what are different types of purifiers offered by the client? Is the profitability issue specific to any single type?" },
  { sender: 'Interviewer', text: "The client offers two types of technologies – RO and UV. Both types are facing the same issue." },
  { sender: 'User', text: "Got it. Then, I would like to understand geographic span of the client. Where is the client currently operating namely location of manufacturing plant and covered geography of sales?" },
  { sender: 'Interviewer', text: "The client sales purifiers across India. The only manufacturing plant is in Gurgaon." },
  { sender: 'User', text: "Okay. And to what kind of customers is the client offering its products?" },
  { sender: 'Interviewer', text: "The client sales purifiers to residential as well as industrial applications." },
  { sender: 'User', text: "Is the profitability issue particular to a segment or across both the segments?" },
  { sender: 'Interviewer', text: "This issue is faced mainly by the residential segment of customers." },
  { sender: 'User', text: "Next, I would like to understand about competition present in this industry. How is the presence of client in the market?" },
  { sender: 'Interviewer', text: "The water purifier market is largely organized. Organized players occupy 60% share in the market. There are four major players in the market and the client has a 28% market share." },
  { sender: 'User', text: "Okay, I assume the client is a market leader considering such a high value of market share. I think I have our client’s context. Now, I would like to evaluate different components of profitability with respect to competitors to get to the root cause behind client’s issue. EBITDA could be split into two components – Revenue (+) and Operating Costs (-). Are both of these metrics affected for our client?" },
  { sender: 'Interviewer', text: "Revenues have been healthy. However, the Operating Costs are higher than all 3 of the client’s competitors." },
  { sender: 'User', text: "Okay! In that case, I would like to take a value chain approach to identify the components of Operating Cost that are leading to a decrease in profitability. Will that be a good approach?" },
  { sender: 'Interviewer', text: "Sure. You can move ahead with this approach." },
  { sender: 'User', text: "The value chain in this industry can broadly be defined as Raw Material and other Inputs -> Inbound Logistics -> Manufacturing and Quality Check -> Storage and Outbound Logistics -> Marketing & Sales -> After-sales Service. Where is our client facing higher operating costs?" },
  { sender: 'Interviewer', text: "This looks good. The client is experiencing higher costs in the after-sales service component. Can you delve into that further?" },
  { sender: 'User', text: "Sure. First, I would like to understand how the client is operating its after-sales service. Do they employ technicians or outsource entire after-sales function?" },
  { sender: 'Interviewer', text: "The client, similar to the competitors, uses a dealership model for the after-sales services. Dealers can be exclusive for a company or may serve to multiple companies. The client, however, has focused on developing exclusive network of about 6000 dealers across India." },
  { sender: 'User', text: "Okay. And what kind of after-sales service is being offered by the dealers?" },
  { sender: 'Interviewer', text: "There are two types – scheduled service which is offered to every buyer within the warranty period and unscheduled service which is offered upon receiving any complaint from the buyer. The cost of scheduled service is entirely borne by the manufacturer. Unscheduled service involves additional revenue to the client from sale of spare parts." },
  { sender: 'User', text: "I would like to focus first on scheduled service as it is increasing only costs and not revenue." },
  { sender: 'Interviewer', text: "Sure. Sounds like a reasonable choice. We can evaluate unscheduled service later if time permits." },
  { sender: 'User', text: "Yes. So, I would like to divide costs of scheduled service as material (spare parts like filter to replace), man (employees like technicians in dealerships) and method (the process followed for the service). Is there any of these component where the client could be facing higher costs?" },
  { sender: 'Interviewer', text: "The client is as efficient as competitors with production of spare parts and the dealers are also following industry standard processes for service. Can you further expand on the dealership cost?" },
  { sender: 'User', text: "Definitely. I would consider the dealership cost per unit of the purifier to benchmark with competitors. I would divide the dealership cost into number of services per unit and rate charged by dealers per service. Number of services per unit can be further expressed as number of services per year and warranty period in years. Is the client offering anything different from competitors in these numbers?" },
  { sender: 'Interviewer', text: "No. The client is offering 2-year warranty period with standard number of services per year same as the competitors." },
  { sender: 'User', text: "Okay. Then moving to rate charged by dealers per service, can you please explain if the rate is fixed or there are further components involved?" },
  { sender: 'Interviewer', text: "Yes. So, the rate charged by dealers consists of three components – a base value of Rs. 100/service, an incentive value of Rs. 50/service if the service time is less than 8 hrs. and a conveyance value per service depending upon the distance travelled by the technician." },
  { sender: 'User', text: "Benchmarking against the competitors, is there any component where the client is incurring higher costs? Do we have any data about that?" },
  { sender: 'Interviewer', text: "Yes. So, the total costs incurred are higher for the incentive value component." },
  { sender: 'User', text: "I see. I would like to split the incentive component as rate per service and the fraction of total services qualified for incentive. Which of these components is higher as compared to competitors?" },
  { sender: 'Interviewer', text: "Well, the rate of incentive component is common across all the dealerships. The fraction of qualified services seems to be higher in case of the client." },
  { sender: 'User', text: "As the incentive is based on the criteria of service time less than 8 hrs., this could imply that maybe competitors have a tighter criteria for this component. Is there any reason why this value was set as 8 hrs." },
  { sender: 'Interviewer', text: "So, the client had renewed the agreement with dealers about a year ago. In the new agreement of 3 years, the client decided to offer better incentive component to attract new dealers as well as retain existing dealers. Therefore, the criteria was set at 8 hrs. as compared to competitor’s value of 3 hrs." },
  { sender: 'Interviewer', text: "Now, can you provide recommendations to the client based on the analysis performed?" },
  { sender: 'User', text: "Sure. I would like to divide the recommendations into two categories based on short-term and long-term orientation. In short term, as the agreement will continue, the client may not be able to modify the dealership rate structure. The client can implement cost cutting operations in other parts of after-sales service operation. However, in long term, it is highly recommended to work on reducing the time criteria as it will also improve customer satisfaction with after-sales service. The client can renew the agreement with a tighter constraint and work on building better relationships with the dealers providing them the necessary support & expertise on improving operational efficiency." },
  { sender: 'Interviewer', text: "Great. We can conclude here. Thank you." }
]

    },
    {
      title: 'Revenue Analysis Techniques',
      order: 2,
      duration: 45,
      level: 'Intermediate',
      description: 'Learn techniques to break down and analyze revenue streams.',
      isLocked: true,
    },
  ],
  // Modules for Business Frameworks course
  [
    {
      title: 'Porter\'s Five Forces',
      order: 1,
      duration: 35,
      level: 'Beginner',
      description: 'Explore the five forces shaping competitive strategy.',
      content: 'Understanding competitive forces that shape strategy'
    },
    {
      title: 'SWOT Analysis',
      order: 2,
      duration: 30,
      level: 'Beginner',
      description: 'Master internal and external business analysis through SWOT.',
      content: 'Evaluating strengths, weaknesses, opportunities, and threats'
    },
    {
      title: 'BCG Matrix',
      order: 3,
      duration: 25,
      level: 'Intermediate',
      description: 'Use the BCG matrix to manage product portfolios.',
      content: 'Portfolio management using the growth-share matrix'
    },
    {
      title: 'Balanced Scorecard',
      order: 4,
      duration: 40,
      level: 'Advanced',
      description: 'Link strategy with performance using the balanced scorecard.',
      content: 'Strategic planning and management system'
    }
  ],
  // Modules for Consulting Interview course
  [
    {
      title: 'Case Interview Fundamentals',
      order: 1,
      duration: 40,
      level: 'Beginner',
      description: 'Learn the formats, expectations, and mindset for case interviews.',
      content: 'Introduction to case interview formats and expectations'
    },
    {
      title: 'Market Sizing Cases',
      order: 2,
      duration: 45,
      level: 'Intermediate',
      description: 'Practice estimating market sizes using top-down and bottom-up approaches.',
      content: 'Techniques for solving market sizing problems'
    },
    {
      title: 'Profitability Cases',
      order: 3,
      duration: 50,
      level: 'Intermediate',
      description: 'Gain hands-on experience solving profitability cases.',
      content: 'Approaches to profitability case questions'
    },
    {
      title: 'M&A and Growth Strategy Cases',
      order: 4,
      duration: 55,
      level: 'Advanced',
      description: 'Dive deep into mergers, acquisitions, and strategies for scalable growth.',
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

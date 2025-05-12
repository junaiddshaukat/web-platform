const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/devweekends';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define schemas
const MentorSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  linkedin: String,
  github: String,
  leetcode: String,
  picture: String,
  university: String,
  mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentee' }]
});

const MenteeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  linkedin: String,
  github: String,
  leetcode: String,
  picture: String,
  university: String,
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' }
});

// Register models
const Mentor = mongoose.models.Mentor || mongoose.model('Mentor', MentorSchema);
const Mentee = mongoose.models.Mentee || mongoose.model('Mentee', MenteeSchema);

// Sample data
const mentorData = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    linkedin: 'https://linkedin.com/in/johnsmith',
    github: 'https://github.com/johnsmith',
    leetcode: 'https://leetcode.com/johnsmith',
    picture: 'https://randomuser.me/api/portraits/men/1.jpg',
    university: 'MIT'
  },
  {
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    phone: '555-234-5678',
    linkedin: 'https://linkedin.com/in/emmajohnson',
    github: 'https://github.com/emmajohnson',
    leetcode: 'https://leetcode.com/emmajohnson',
    picture: 'https://randomuser.me/api/portraits/women/2.jpg',
    university: 'Stanford University'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '555-345-6789',
    linkedin: 'https://linkedin.com/in/michaelchen',
    github: 'https://github.com/michaelchen',
    leetcode: 'https://leetcode.com/michaelchen',
    picture: 'https://randomuser.me/api/portraits/men/3.jpg',
    university: 'Harvard University'
  },
  {
    name: 'Sophia Patel',
    email: 'sophia.patel@example.com',
    phone: '555-456-7890',
    linkedin: 'https://linkedin.com/in/sophiapatel',
    github: 'https://github.com/sophiapatel',
    leetcode: 'https://leetcode.com/sophiapatel',
    picture: 'https://randomuser.me/api/portraits/women/4.jpg',
    university: 'Oxford University'
  }
];

const menteeData = [
  {
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@example.com',
    phone: '555-567-8901',
    linkedin: 'https://linkedin.com/in/alexrodriguez',
    github: 'https://github.com/alexrodriguez',
    leetcode: 'https://leetcode.com/alexrodriguez',
    picture: 'https://randomuser.me/api/portraits/men/5.jpg',
    university: 'University of California'
  },
  {
    name: 'Olivia Brown',
    email: 'olivia.brown@example.com',
    phone: '555-678-9012',
    linkedin: 'https://linkedin.com/in/oliviabrown',
    github: 'https://github.com/oliviabrown',
    leetcode: 'https://leetcode.com/oliviabrown',
    picture: 'https://randomuser.me/api/portraits/women/6.jpg',
    university: 'ETH Zurich'
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '555-789-0123',
    linkedin: 'https://linkedin.com/in/jameswilson',
    github: 'https://github.com/jameswilson',
    leetcode: 'https://leetcode.com/jameswilson',
    picture: 'https://randomuser.me/api/portraits/men/7.jpg',
    university: 'Imperial College London'
  },
  {
    name: 'Ava Martinez',
    email: 'ava.martinez@example.com',
    phone: '555-890-1234',
    linkedin: 'https://linkedin.com/in/avamartinez',
    github: 'https://github.com/avamartinez',
    leetcode: 'https://leetcode.com/avamartinez',
    picture: 'https://randomuser.me/api/portraits/women/8.jpg',
    university: 'Princeton University'
  },
  {
    name: 'William Lee',
    email: 'william.lee@example.com',
    phone: '555-901-2345',
    linkedin: 'https://linkedin.com/in/williamlee',
    github: 'https://github.com/williamlee',
    leetcode: 'https://leetcode.com/williamlee',
    picture: 'https://randomuser.me/api/portraits/men/9.jpg',
    university: 'Cambridge University'
  },
  {
    name: 'Isabella Kim',
    email: 'isabella.kim@example.com',
    phone: '555-012-3456',
    linkedin: 'https://linkedin.com/in/isabellakim',
    github: 'https://github.com/isabellakim',
    leetcode: 'https://leetcode.com/isabellakim',
    picture: 'https://randomuser.me/api/portraits/women/10.jpg',
    university: 'Caltech'
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Mentor.deleteMany({});
    await Mentee.deleteMany({});
    console.log('Cleared existing data');

    // Add mentors
    const savedMentors = await Mentor.insertMany(mentorData);
    console.log('Added mentors:', savedMentors.map(m => m.name).join(', '));

    // Add mentees and assign to mentors
    const menteesToInsert = menteeData.map((mentee, index) => {
      // Assign each mentee to a mentor (using modulo to cycle through mentors)
      const mentorIndex = index % savedMentors.length;
      return {
        ...mentee,
        mentor: savedMentors[mentorIndex]._id
      };
    });

    const savedMentees = await Mentee.insertMany(menteesToInsert);
    console.log('Added mentees:', savedMentees.map(m => m.name).join(', '));

    // Update mentor documents with mentee references
    for (const mentee of savedMentees) {
      await Mentor.findByIdAndUpdate(
        mentee.mentor,
        { $push: { mentees: mentee._id } }
      );
    }
    console.log('Updated mentor-mentee relationships');

    // Log the relationships
    const updatedMentors = await Mentor.find().populate('mentees');
    for (const mentor of updatedMentors) {
      console.log(`\nMentor: ${mentor.name} has ${mentor.mentees.length} mentees:`);
      mentor.mentees.forEach((mentee, i) => {
        console.log(`  ${i+1}. ${mentee.name} (${mentee.university})`);
      });
    }

    console.log('\nDatabase seeding completed!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase(); 
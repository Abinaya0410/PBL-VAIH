
const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('./models/Course');
const User = require('./models/User');

async function listAll() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    for (const t of users) {
      const c = await Course.countDocuments({ 
        $or: [
          { teacher: t._id },
          { teacher: t._id.toString() }
        ]
      });
      console.log(`- ${t.name} (${t.email}) ID: ${t._id} -> Courses: ${c}`);
    }
    
    const allC = await Course.find().limit(5);
    console.log(`First few courses in DB:`);
    allC.forEach(c => {
      console.log(`- Course: ${c.title}, Teacher Field: ${c.teacher} (Type: ${typeof c.teacher})`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}
listAll();

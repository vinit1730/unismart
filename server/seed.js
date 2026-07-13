import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/unismart') 
  .then(async () => {
    console.log("Connected to MongoDB...");

    // 1. Define inline collections bypassing schema errors
    const DynamicUser = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const DynamicStudent = mongoose.models.Student || mongoose.model('Student', new mongoose.Schema({}, { strict: false }));

    // 2. See if 'vinit' exists. If not, create him!
    let facultyUser = await DynamicUser.findOne({ name: /vinit/i });

    if (!facultyUser) {
      console.log("Faculty user 'vinit' not found. Creating one...");
      facultyUser = await DynamicUser.create({
        name: "vinit",
        email: "vinit@unismart.com",
        role: "FACULTY",
        password: "hashedpassword123" // dummy placeholder password
      });
      console.log(`Created new faculty user with ID: ${facultyUser._id}`);
    } else {
      console.log(`Found existing faculty user with ID: ${facultyUser._id}`);
    }

    // 3. Clean up old test data under this specific batch
    await DynamicStudent.deleteMany({ batch: "CSE-2024" });

    // 4. Insert the test student profile mapping it directly to the faculty ID
    await DynamicStudent.create({
      name: "Rahul Sharma",
      rollNumber: "CSE-2024-001",
      batch: "CSE-2024",
      semester: 4,
      facultyId: facultyUser._id
    });

    console.log("🎉 Database seeded successfully with both Faculty and Student records!");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("Database seed error:", err);
    mongoose.connection.close();
  });
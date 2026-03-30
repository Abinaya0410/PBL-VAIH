const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log("Connected to MongoDB...");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        const users = [
            {
                name: "Test Teacher",
                email: "teacher@test.com",
                password: hashedPassword,
                role: "teacher",
                mobileNumber: "9876543210",
                profileCompleted: true,
                institutionName: "PBL Academy",
            },
            {
                name: "Test Student",
                email: "student@test.com",
                password: hashedPassword,
                role: "student",
                mobileNumber: "8876543210",
                profileCompleted: true,
                collegeName: "PBL College",
            }
        ];

        for (const u of users) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
                console.log(`Created ${u.role}: ${u.email}`);
            } else {
                console.log(`${u.role} already exists: ${u.email}`);
            }
        }

        console.log("Seeding complete!");
    } catch (err) {
        console.error("Seeding Error:", err.message);
    } finally {
        await mongoose.disconnect();
    }
};

seedUsers();

require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    // Check required environment variables
    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is not configured in .env");
    }

    if (!process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_PASSWORD is not configured in .env");
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    console.log("Admin created successfully!");
    console.log(`Admin email: ${admin.email}`);
  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

const start = async () => {
  await connectDB();
  await createAdmin();
};

start();
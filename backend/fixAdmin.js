require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const fixAdmin = async () => {
  try {
    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is not configured in .env");
    }

    if (!process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_PASSWORD is not configured in .env");
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    // Find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log(`Admin with email ${email} was not found.`);
      return;
    }

    // Hash password again
    const hashedPassword = await bcrypt.hash(password, 12);

    // Fix/update admin
    admin.password = hashedPassword;

    // Make sure admin role is correct if your schema has a role field
    if (admin.role !== undefined) {
      admin.role = "admin";
    }

    await admin.save();

    console.log("Admin fixed successfully!");
    console.log(`Admin email: ${admin.email}`);
  } catch (error) {
    console.error("Error fixing admin:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

const start = async () => {
  await connectDB();
  await fixAdmin();
};

start();
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

const resetAdminPassword = async () => {
  try {
    // Check required environment variables
    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is not configured in .env");
    }

    if (!process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_PASSWORD is not configured in .env");
    }

    const email = process.env.ADMIN_EMAIL;
    const newPassword = process.env.ADMIN_PASSWORD;

    // Find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log("Admin not found.");
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    admin.password = hashedPassword;

    await admin.save();

    console.log("Admin password reset successfully!");
    console.log(`Admin email: ${admin.email}`);
  } catch (error) {
    console.error("Error resetting admin password:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

const start = async () => {
  await connectDB();
  await resetAdminPassword();
};

start();
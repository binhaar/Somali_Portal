require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");

const checkAdmin = async () => {
  try {
    await connectDB();

    const admins = await User.find({ role: "ADMIN" }).select(
      "email username role accountType isActive isVerified"
    );

    console.log("ADMIN USERS:");
    console.log(admins);

    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

checkAdmin();
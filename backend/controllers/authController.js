const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      accountType: user.accountType,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
};

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

const registerUser = async (req, res) => {
  try {
    const {
      accountType,
      username,
      firstName,
      lastName,
      otherNames,
      dateOfBirth,
      placeOfBirth,
      gender,
      nationalIdNumber,
      passportNumber,
      nationality,
      phone,
      email,
      password,
    } = req.body;

    if (!accountType) {
      return res.status(400).json({
        message: "Account type is required.",
      });
    }

    if (!["CITIZEN", "VISITOR"].includes(accountType)) {
      return res.status(400).json({
        message: "Invalid account type.",
      });
    }

    if (
      !username ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !placeOfBirth ||
      !gender ||
      !phone ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    if (!["MALE", "FEMALE"].includes(gender)) {
      return res.status(400).json({
        message: "Invalid gender.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    if (accountType === "CITIZEN" && !nationalIdNumber) {
      return res.status(400).json({
        message: "National ID number is required for citizens.",
      });
    }

    if (
      accountType === "VISITOR" &&
      (!passportNumber || !nationality)
    ) {
      return res.status(400).json({
        message:
          "Passport number and nationality are required for visitors.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const existingUsername = await User.findOne({
      username: username.trim(),
    });

    if (existingUsername) {
      return res.status(409).json({
        message: "This username is already taken.",
      });
    }

    if (nationalIdNumber) {
      const existingNationalId = await User.findOne({
        nationalIdNumber: nationalIdNumber.trim(),
      });

      if (existingNationalId) {
        return res.status(409).json({
          message: "This National ID number is already registered.",
        });
      }
    }

    if (passportNumber) {
      const existingPassport = await User.findOne({
        passportNumber: passportNumber.trim(),
      });

      if (existingPassport) {
        return res.status(409).json({
          message: "This passport number is already registered.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      accountType,
      role: accountType === "CITIZEN" ? "CITIZEN" : "VISITOR",

      username: username.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      otherNames: otherNames?.trim(),

      dateOfBirth,
      placeOfBirth: placeOfBirth.trim(),
      gender,

      nationalIdNumber:
        accountType === "CITIZEN"
          ? nationalIdNumber?.trim()
          : undefined,

      passportNumber:
        accountType === "VISITOR"
          ? passportNumber?.trim()
          : undefined,

      nationality:
        accountType === "VISITOR"
          ? nationality?.trim()
          : undefined,

      phone: phone.trim(),
      email: normalizedEmail,

      password: hashedPassword,

      isVerified: false,
      isActive: true,
    });

    res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        accountType: user.accountType,
        role: user.role,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Registration failed.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    /*
      IMPORTANT:
      No localStorage.
      No sessionStorage.
      JWT is stored inside HttpOnly SESSION COOKIE.
    */

    res.cookie("portal_session", token, cookieOptions);

    res.json({
      message: "Login successful.",

      user: {
        id: user._id,
        accountType: user.accountType,
        role: user.role,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        otherNames: user.otherNames,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CURRENT USER
|--------------------------------------------------------------------------
*/

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      message: "Failed to get current user.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

const logoutUser = (req, res) => {
  res.clearCookie("portal_session", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.json({
    message: "Logged out successfully.",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
};
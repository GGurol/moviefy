// backend/db/seed.ts
import User from "../models/user";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "admin@admin.com";
const ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "123456";
const ADMIN_NAME = process.env.DEFAULT_ADMIN_NAME || "admin";

export const createDefaultAdminIfNeeded = async () => {
  try {
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    console.log("Admin user not found, creating one...");
    
    // CORRECTED: Removed the manual hashing.
    // The pre-save hook in the User model will handle this automatically.
    // const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const adminUser = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // Pass the plain-text password
      isVerified: true,
      role: "admin",
    });

    await adminUser.save();
    console.log("Default admin user created successfully.");

  } catch (error) {
    console.error("Error during admin user seeding:", error);
  }
};
import bcrypt from "bcryptjs";
import db from "./db.js";

// PLACEHOLDER account for development only.
// Don't reuse a password you use anywhere else.
const admin = {
  name: "Admin",
  email: "admin@123.test",
  password: "admin123",
};

const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(admin.email);

if (existing) {
  console.log("Admin account already exists. Nothing to do.");
} else {
  const passwordHash = await bcrypt.hash(admin.password, 10);

  db.prepare(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
  ).run(admin.name, admin.email, passwordHash);

  console.log(`Created admin account: ${admin.email}`);
}   
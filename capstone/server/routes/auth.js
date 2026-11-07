import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = db
    .prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?")
    .get(email.trim().toLowerCase());

  const passwordMatches = user && (await bcrypt.compare(password, user.password_hash));

  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  req.session.userId = user.id;
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out." });
  });
});

// Tells the frontend who is logged in. React calls this on page load.
router.get("/me", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in." });
  }

  const user = db
    .prepare("SELECT id, name, email FROM users WHERE id = ?")
    .get(req.session.userId);

  res.json({ user });
});

export default router;
/** @format */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");

// GET Register Page
router.get("/", (req, res) => {
  res.render("register");
});

// POST Register
router.post(
  "/register",
  body("username").trim().isLength({ min: 5 }),
  body("email").trim().isEmail().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: errors.array(), message: "Invalid data" });
    }

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
    });
    res.redirect("/login");
  },
);

// GET Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// POST Login
router.post(
  "/login",
  body("username").trim().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: errors.array(), message: "Invalid credentials" });
    }

    const { username, password } = req.body;
    const user = await userModel.findOne({ username: username.toLowerCase() });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" },
    );

    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.redirect("/home"); // redirect to home page after login
  },
);

module.exports = router;

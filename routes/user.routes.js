/** @format */

const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});
router.post(
  "/register",
  body("username").trim().isLength({ min: 5 }),
  body("email").trim().isEmail().isLength({ min: 13 }),
  body("password").trim().isLength({ min: 3 }),
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
        message: "invalid data",
      });
    }
    res.send(errors);
    console.log(req.body);
    res.send("register");
  },
);

module.exports = router;

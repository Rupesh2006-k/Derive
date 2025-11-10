/** @format */

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
router.get("/register", (req, res) => {
  res.render("register");
});
router.post(
  "/register",
  body("email").trim().isEmail().isLength({ min: 13 }),
  body("password").trim().isLength({ min: 5 }),
  body("username").trim().isLength({ min: 3 }),
  (req, res) => { 
    let error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error);
      return res.status(400).json({
        error: error.array(),
        message: "invalid data",                               
      });
    }
    let val = req.body;
    console.log(val);
    res.send(error);
  },
);

module.exports = router;

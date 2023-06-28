const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "rajeshisagood$boy";

// ROUTE:1-Create a User using: POST "/api/auth/createuser"
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;

    // If there are errors, return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    // Check whether a user with this email already exists
    try {
      let existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "A user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      await newUser.save();

      const payload = {
        user: {
          id: newUser.id,
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);

      success = true;

      res.json({ success,authToken });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE:2-Authenticate a user using: POST "/api/auth/login" (no login required)
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // If there are errors, return bad request
    let  success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success=false

        return res.status(400).json({ success,error: "Invalid email or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        success=false
        return res.status(400).json({ success, error: "Invalid email or password" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);
      success=true;
      res.json({ success,authToken });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE:3-GET loggedin  user details using: POST "/api/auth/getuser"  login required
router.post('/getuser',fetchuser,async (req, res) => {


    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user)
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;

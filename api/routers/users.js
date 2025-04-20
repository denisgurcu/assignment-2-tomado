require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authenticateToken = require('../middleware/auth.jwt');  // path to middleware auth

const JWT_SECRET = process.env.JWT_SECRET;
const usersRouter = express.Router();

// Register New User
usersRouter.post("/", [
    body("email").isEmail().withMessage("Invalid Email").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ], async (req, res) => {
    console.log('Received registration request:', req.body);  // Log incoming data
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());  // Log validation errors
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);  // Log the hashed password for debugging
  
    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error('Error creating user:', err);  // Log any error
          return res.status(500).send("Error creating user");
        }
  
        console.log('User created successfully with ID:', result.insertId);  // Log success
        res.status(201).json({
          message: "User Created!",
          userId: result.insertId
        });
      }
    );
  });
  
  // User Login
  usersRouter.post("/sign-in", (req, res) => {
    console.log('Received login request:', req.body);  // Log incoming login data
  
    const { email, password } = req.body;
  
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
      if (err || result.length === 0) {
        console.error('Login failed: Invalid email or password');  // Log if the email is not found
        return res.status(401).json({ message: "Invalid Email or Password" });
      }
  
      const user = result[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.error('Login failed: Password mismatch');  // Log if the password doesn't match
        return res.status(401).json({ message: "Invalid Email or Password" });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '8h' }
      );
      console.log('Generated JWT:', token);  // Add this line before sending the response

      res.json({ message: 'Success!', jwt: token });  // Ensure this sends the token);
    });
  });
  

// Get user profile (Authenticated route)
usersRouter.get("/me", authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.query("SELECT email FROM users WHERE id = ?", [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ message: "User not found" });
        }

        res.json({ email: results[0].email }); // Returning email instead of username
    });
});


module.exports = usersRouter;

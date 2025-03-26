const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const { token, user } = await User.create({ username, email, password });
        return res.json({
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
          });
    } catch (err) {
        // Check for unique constraint violations (PostgreSQL error code 23505)
        if (err.code === '23505') {

            let errorMessage = "Duplicate entry detected"; // Default message
            if (err.constraint.includes('users_username_key')) {
                return res.status(400).json({ error: "Username already taken" });
            } else if (err.constraint.includes('users_email_key')) {
                return res.status(400).json({ error: "Email already taken" });
            }
            return res.status(400).json({ error: errorMessage });
        }

        return res.status(400).json({ error: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
          });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

module.exports = router;
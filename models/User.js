const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
    // Create a new user
    static async create({ username, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await db.query(
            `INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email`,
            [username, email, hashedPassword]
        );

        const user = result.rows[0];

        // Generate a token after the user is created
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // You can adjust the expiration time as needed
        );

        return { token, user };
    }

    // Authenticate a user
    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT id, username, email, password FROM users WHERE username = $1`,
            [username]
        );
        const user = result.rows[0];

        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
                delete user.password; // Remove password from user object
                return user;
            }
        }

        throw new Error("Invalid username/password");
    }

    // Find a user by username
    static async findByUsername(username) {
        const result = await db.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        );
        return result.rows[0];
    }

    static async updateProfile(username, email) {
        const result = await db.query(
          `UPDATE users
           SET email = $1
           WHERE username = $2
           RETURNING id, username, email`,
          [email, username]
        );
        return result.rows[0]; // Return updated user data
    }
}

module.exports = User;
const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
            return next();
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
    } else {
        return res.status(401).json({ error: "Authorization token required" });
    }
}

// Middleware to ensure the correct user is making the request
function ensureCorrectUser(req, res, next) {
    if (req.user && req.user.username === req.params.username) {
        return next();
    } else {
        return res.status(403).json({ error: "Unauthorized" });
    }
}

module.exports = { authenticateJWT, ensureCorrectUser };
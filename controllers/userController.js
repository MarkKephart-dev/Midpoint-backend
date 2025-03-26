const User = require('../models/User');

async function getUser(req, res) {
    try {
        const { username } = req.params;
        const user = await User.findByUsername(username);
        if (!user) throw new Error("User not found");
        return res.json(user);
    } catch (err) {
        return res.status(404).json({ error: err.message });
    }
}

async function updateUser(req, res) {
    const { email } = req.body;
    const username = req.params.username; // Extract user ID from authenticated user
    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required." });
    }
  
    try {
      // Update the user in the database
      const updatedUser = await User.updateProfile(username, email);
      console.log("after update", updatedUser);
      return res.json(updatedUser); // Send back updated user data
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update profile." });
}}

module.exports = { getUser, updateUser };
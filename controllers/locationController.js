const Location = require('../models/Location');

async function saveLocation(req, res) {
    try {
        const { name, address } = req.body;
        const userId = req.user.id; // Ensure authentication middleware sets req.user
        const newLocation = await Location.create(userId, name, address);
        return res.status(201).json(newLocation);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

async function getLocations(req, res) {
    try {
        const userId = req.user.id;
        const locations = await Location.findByUserId(userId);
        return res.json(locations);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

// DELETE route to remove a saved location
async function deleteLocation(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id; // Extract user ID from JWT token
  
      const deletedLocation = await Location.removeLocation(id, userId);
      if (!deletedLocation) {
        return res.status(404).json({ error: "Location not found or unauthorized" });
      }
      return res.json({ message: "Location removed successfully" });
    } catch (err) {
      return next(err);
    }
};

// PATCH route to edit a location name
async function editLocationName(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const userId = req.user.id; // Extract user ID from JWT token
  
      if (!name) {
        return res.status(400).json({ error: "New location name is required." });
      }
  
      const updatedLocation = await Location.updateLocationName(id, userId, name);
      if (!updatedLocation) {
        return res.status(404).json({ error: "Location not found or unauthorized" });
      }
      
      return res.json(updatedLocation);
    } catch (err) {
      return next(err);
    }
}

module.exports = { saveLocation, getLocations, deleteLocation, editLocationName };
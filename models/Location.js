const db = require('../db');

class Location {
    // Create a new location
    static async create(userId, name, address) {
        const result = await db.query(
            `INSERT INTO locations (user_id, name, address)
            VALUES ($1, $2, $3)
            RETURNING id, name, address`,
            [userId, name, address]
        );
        return result.rows[0];
    }

    // Find all locations for a user
    static async findByUserId(userId) {
        const result = await db.query(
            `SELECT id, name, address FROM locations WHERE user_id = $1`,
            [userId]
        );
        return result.rows;
    }

    // Edit Location Name for a user
    static async updateLocationName(locationId, userId, newName) {
        const result = await db.query(
          `UPDATE locations
           SET name = $1
           WHERE id = $2 AND user_id = $3
           RETURNING id, name, address, user_id AS "userId"`,
          [newName, locationId, userId]
        );
      
        return result.rows[0]; // Returns the updated location if successful
    }

    static async removeLocation(locationId, userId) {
        const result = await db.query(
          `DELETE FROM locations
           WHERE id = $1 AND user_id = $2
           RETURNING id`,
          [locationId, userId]
        );
    
        return result.rows[0]; // Returns the deleted location if successful
    }
}

module.exports = Location;
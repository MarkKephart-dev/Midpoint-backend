const db = require('./db');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        console.log("🌱 Seeding data...");

        await db.query('DELETE FROM locations');
        await db.query('DELETE FROM users');

        const hashedPassword = await bcrypt.hash('password123', 12);
        const userResult = await db.query(
            `INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id`,
            ['testuser', 'test@example.com', hashedPassword]
        );

        const userId = userResult.rows[0].id;

        // Create sample locations
        await db.query(
            `INSERT INTO locations (user_id, name, address)
            VALUES
            ($1, 'home', "4222 Salem Springs Ct., Winston-Salem, NC"),
            ($1, 'work', '5238 Salem Woods Dr., Graham, NC') -- Los Angeles`,
            [userId]
        );

        console.log("✅ Seed complete!");
    } catch (err) {
        console.error("❌ Error seeding data:", err);
    } finally {
        process.exit();
    }
}

seed();

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors()); // Enable frontend to access the backend
app.use(express.json()); // Parse JSON body requests

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/locations', locationRoutes);

if (require.main === module) {
    // Only run the server if this is the main module
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;

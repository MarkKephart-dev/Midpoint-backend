const express = require('express');
const { saveLocation, getLocations, deleteLocation, editLocationName } = require('../controllers/locationController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateJWT, saveLocation);
router.get('/', authenticateJWT, getLocations);
router.delete('/:id', authenticateJWT, deleteLocation);
router.patch('/:id', authenticateJWT, editLocationName);

module.exports = router;

const express = require('express');
const { getUser, updateUser } = require('../controllers/userController');
const { authenticateJWT, ensureCorrectUser } = require('../middleware/auth');

const router = express.Router();

router.get('/:username', authenticateJWT, ensureCorrectUser, getUser);
router.put('/:username', authenticateJWT, ensureCorrectUser, updateUser);

module.exports = router;

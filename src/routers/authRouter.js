const express = require('express');
const router = express.Router();

const { signUp, login } = require('../controllers/authController');

/* SignUp Route */
router.post('/signup', signUp);

/* Login Route */
router.post('/login', login);

module.exports = router;
const express =  require('express');
const router = express.Router();
const { contact_post } = require('../controllers/contactUsController');

router.post('/contactus', contact_post);

module.exports = router;
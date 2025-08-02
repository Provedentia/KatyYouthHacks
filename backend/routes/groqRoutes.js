const express = require('express');
const router = express.Router();

const groqController = require('../controllers/groqController');

router.post('/analyze', groqController.callGroq);

module.exports = router;


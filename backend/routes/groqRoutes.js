const express = require('express');
const router = express.Router();

const groqController = require('../controllers/groqController');

router.post('/analyze', groqController.callGroq);
router.post('/keep-relevant', groqController.keepRelevantText);

module.exports = router;

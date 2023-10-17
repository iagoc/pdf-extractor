const express = require('express'); 
const router = express.Router();

const { getPhrases } = require('../controllers/extractor')

router.post("/", getPhrases);

module.exports = router;
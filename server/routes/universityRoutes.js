const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');

router.post('/', universityController.createUniversity);
router.get('/', universityController.getUniversities);
router.delete('/:id', universityController.deleteUniversity);

module.exports = router;

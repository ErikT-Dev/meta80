const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/movies', movieController.getMovies);
router.get('/movies/filters', movieController.getFilterOptions);
router.get('/movies/update-filter-counts', movieController.updateFilterCounts);

module.exports = router;

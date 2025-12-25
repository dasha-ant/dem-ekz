const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { 
  getAllApplications, 
  updateApplicationStatus,
  getStatistics 
} = require('../controllers/adminController');

router.get('/applications', authMiddleware, adminMiddleware, getAllApplications);
router.put('/applications/:id/status', authMiddleware, adminMiddleware, updateApplicationStatus);
router.get('/statistics', authMiddleware, adminMiddleware, getStatistics);

module.exports = router;
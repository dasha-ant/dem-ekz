const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { 
  getAllApplications, 
  updateApplicationStatus,
  getStatistics,
  getAllUsers,
  deleteUser,
  getUserApplicationsByUserId
} = require('../controllers/adminController');

router.get('/applications', authMiddleware, adminMiddleware, getAllApplications);
router.put('/applications/:id/status', authMiddleware, adminMiddleware, updateApplicationStatus);
router.get('/statistics', authMiddleware, adminMiddleware, getStatistics);

router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);
router.get('/users/:userId/applications', authMiddleware, adminMiddleware, getUserApplicationsByUserId);

module.exports = router;
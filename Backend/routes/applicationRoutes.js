const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { 
  createApplication, 
  getUserApplications, 
  addFeedback 
} = require('../controllers/applicationController');

const applicationValidation = [
  body('courseName')
    .notEmpty()
    .withMessage('Название курса обязательно'),
  body('startDate')
    .notEmpty()
    .withMessage('Дата начала обучения обязательна'),
  body('paymentMethod')
    .isIn(['наличными', 'перевод по номеру телефона'])
    .withMessage('Выберите корректный способ оплаты')
];

router.post('/', authMiddleware, applicationValidation, createApplication);
router.get('/', authMiddleware, getUserApplications);



module.exports = router;
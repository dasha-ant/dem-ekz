const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const registerValidation = [
  body('username')
    .isLength({ min: 6 })
    .withMessage('Логин должен быть не менее 6 символов')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Логин должен содержать только латинские буквы и цифры'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Пароль должен быть не менее 8 символов'),
  body('fullName')
    .matches(/^[а-яА-ЯёЁ\s]+$/)
    .withMessage('ФИО должно содержать только кириллицу и пробелы'),
  body('email')
    .isEmail()
    .withMessage('Некорректный email'),
  body('phone')
    .matches(/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/)
    .withMessage('Телефон должен быть в формате 8(XXX)XXX-XX-XX')
];

const loginValidation = [
  body('username').notEmpty().withMessage('Логин обязателен'),
  body('password').notEmpty().withMessage('Пароль обязателен')
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/admin/login', authController.adminLogin);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const login = async (req, res) => {
  try {
    console.log('🔐 Вход:', req.body.username);
    
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Логин и пароль обязательны'
      });
    }

    const user = await User.findOne({ 
      where: { username },
      attributes: ['id', 'username', 'password', 'fullName', 'phone', 'email', 'role', 'createdAt', 'updatedAt']
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET || 'korochki_secret_key_2024',
      { expiresIn: '24h' }
    );
    
    console.log('✅ Успешный вход:', user.username);
    
    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
    
  } catch (error) {
    console.error('💥 Ошибка входа:', error.message);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при входе'
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    console.log('👑 Попытка входа администратора');
    
    const { username, password } = req.body;

    if (username !== 'Admin' || password !== 'KorokNET') {
      return res.status(401).json({
        success: false,
        message: 'Неверные учетные данные администратора'
      });
    }

    let admin = await User.findOne({ 
      where: { username: 'Admin' },
      attributes: ['id', 'username', 'password', 'fullName', 'phone', 'email', 'role']
    });
    
    if (!admin) {
      console.log('Создаем администратора...');
      admin = await User.create({
        username: 'Admin',
        password: 'KorokNET',
        fullName: 'Администратор Системы',
        phone: '8(800)123-45-67',
        email: 'admin@korochki.ru',
        role: 'admin'
      });
    }

 
    const isPasswordValid = await admin.comparePassword('KorokNET');
    
  
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username,
        role: admin.role 
      },
      process.env.JWT_SECRET || 'korochki_secret_key_2024',
      { expiresIn: '24h' }
    );
    
    console.log('✅ Администратор вошел');
    
    res.json({
      success: true,
      message: 'Вход администратора выполнен успешно',
      user: {
        id: admin.id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role
      },
      token
    });
    
  } catch (error) {
    console.error('💥 Ошибка входа администратора:', error.message);
    res.status(500).json({
      success: false,
      message: 'Ошибка при входе администратора'
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, fullName, phone, email } = req.body;

   
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username },
          { email }
        ]
      } 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким логином или email уже существует'
      });
    }

   
    const user = await User.create({
      username,
      password,
      fullName,
      phone,
      email,
      role: 'user'
    });

    
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET || 'korochki_secret_key_2024',
      { expiresIn: '24h' }
    );

    console.log('✅ Новый пользователь:', username);
    
    res.status(201).json({
      success: true,
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
    
  } catch (error) {
    console.error('💥 Ошибка регистрации:', error.message);
    res.status(500).json({
      success: false,
      message: 'Ошибка при регистрации'
    });
  }
};

const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных пользователя'
    });
  }
};

module.exports = { 
  register, 
  login, 
  adminLogin,
  getMe 
};
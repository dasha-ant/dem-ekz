const { Application, User } = require('../models');

const createApplication = async (req, res) => {
  try {
    console.log('Создание заявки:', req.body);
    console.log('Пользователь:', req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Пользователь не авторизован'
      });
    }

    const { courseName, startDate, paymentMethod } = req.body;
    
   
    if (!courseName || !startDate || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Все поля обязательны'
      });
    }
    
    
    const allowedCourses = [
      'Основы алгоритмизации и программирования',
      'Основы веб-дизайна', 
      'Основы проектирования баз данных'
    ];
    
    if (!allowedCourses.includes(courseName)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный курс'
      });
    }
    
    
    const [day, month, year] = startDate.split('.');
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    
    const application = await Application.create({
      userId: req.user.id,
      courseName,
      startDate: isoDate,
      paymentMethod,
      status: 'Новая'
    });
    
    console.log('Заявка создана:', application.id);
    
    res.status(201).json({
      success: true,
      message: 'Заявка успешно создана',
      application: {
        id: application.id,
        courseName: application.courseName,
        startDate: application.startDate,
        paymentMethod: application.paymentMethod,
        status: application.status
      }
    });
    
  } catch (error) {
    console.error('ОШИБКА создания заявки:', error);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при создании заявки',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getUserApplications = async (req, res) => {
  try {
    console.log('Получение заявок для пользователя:', req.user.id);
    
    const applications = await Application.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    console.log('Найдено заявок:', applications.length);
    
    res.json({
      success: true,
      applications: applications.map(app => ({
        id: app.id,
        courseName: app.courseName,
        startDate: app.startDate,
        paymentMethod: app.paymentMethod,
        status: app.status,
        createdAt: app.createdAt
      }))
    });
  } catch (error) {
    console.error('Ошибка получения заявок:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении заявок'
    });
  
  }
  
};

module.exports = { 
  createApplication, 
  getUserApplications, 
 
};
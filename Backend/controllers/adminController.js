const { Application, User, sequelize } = require('../models');
const { Op } = require('sequelize');

const getAllApplications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      startDate, 
      endDate,
      search 
    } = req.query;

    const offset = (page - 1) * limit;

    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    let userWhere = {};
    let includeOptions = {
      model: User,
      as: 'user',
      attributes: ['id', 'fullName', 'email', 'phone', 'username', 'role', 'createdAt']
    };

    if (search) {
      includeOptions.where = {
        [Op.or]: [
          { fullName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } },
          { username: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const { count, rows } = await Application.findAndCountAll({
      where,
      include: [includeOptions],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    res.json({
      success: true,
      applications: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении заявок',
      error: error.message
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByPk(id, {
      include: [{
        model: User,
        as: 'user'
      }]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Заявка не найдена'
      });
    }

    const allowedStatuses = ['Новая', 'Идет обучение', 'Обучение завершено'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Недопустимый статус'
      });
    }

    await application.update({ status });

    if (status === 'Обучение завершено') {
      console.log(`Отправка уведомления пользователю ${application.user.email} о завершении курса`);
    }

    res.json({
      success: true,
      message: 'Статус заявки обновлен',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении статуса',
      error: error.message
    });
  }
};

const getStatistics = async (req, res) => {
  try {
    const totalApplications = await Application.count();
    const newApplications = await Application.count({ 
      where: { status: 'Новая' } 
    });
    const inProgressApplications = await Application.count({ 
      where: { status: 'Идет обучение' } 
    });
    const completedApplications = await Application.count({ 
      where: { status: 'Обучение завершено' } 
    });
    
    const totalUsers = await User.count();
    const recentUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const applicationsByCourse = await Application.findAll({
      attributes: [
        'courseName',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['courseName'],
      raw: true
    });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const applicationsOverTime = await Application.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        'status'
      ],
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt')), 'status'],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    const usersWithApplications = await User.findAll({
      attributes: [
        'id',
        'username',
        'fullName',
        'email',
        'role',
        [sequelize.fn('COUNT', sequelize.col('applications.id')), 'applicationCount']
      ],
      include: [{
        model: Application,
        as: 'applications',
        attributes: [],
        required: false
      }],
      group: ['User.id'],
      raw: true
    });

    res.json({
      success: true,
      statistics: {
        totalApplications,
        newApplications,
        inProgressApplications,
        completedApplications,
        totalUsers,
        recentUsers,
        applicationsByCourse,
        applicationsOverTime,
        usersWithApplications
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении статистики',
      error: error.message
    });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search,
      role
    } = req.query;

    const offset = (page - 1) * limit;
 
    const where = {};
    
    if (role) {
      where.role = role;
    }
    
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [{
        model: Application,
        as: 'applications',
        attributes: ['id', 'courseName', 'status', 'createdAt']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      users: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении пользователей',
      error: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Нельзя удалить собственный аккаунт'
      });
    }

    const user = await User.findByPk(id, {
      include: [{
        model: Application,
        as: 'applications'
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    if (user.applications && user.applications.length > 0) {
      await Application.destroy({
        where: { userId: id }
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'Пользователь и его заявки успешно удалены'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении пользователя',
      error: error.message
    });
  }
};

const getUserApplicationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    const applications = await Application.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      },
      applications: applications.map(app => ({
        id: app.id,
        courseName: app.courseName,
        startDate: app.startDate,
        paymentMethod: app.paymentMethod,
        status: app.status,
        feedback: app.feedback,
        rating: app.rating,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении заявок пользователя',
      error: error.message
    });
  }
};

module.exports = { 
  getAllApplications, 
  updateApplicationStatus, 
  getStatistics,
  getAllUsers,
  deleteUser,
  getUserApplicationsByUserId
};
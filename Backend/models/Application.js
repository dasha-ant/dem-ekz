const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  courseName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'course_name'
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_date'
  },
  paymentMethod: {
    type: DataTypes.ENUM('наличными', 'перевод по номеру телефона'),
    allowNull: false,
    field: 'payment_method'
  },
  status: {
    type: DataTypes.ENUM('Новая', 'Идет обучение', 'Обучение завершено'),
    defaultValue: 'Новая'
  },
  feedback: {
    type: DataTypes.TEXT
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  timestamps: true,
  tableName: 'applications'
});

module.exports = Application;
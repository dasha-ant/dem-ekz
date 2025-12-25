const sequelize = require('../db');
const User = require('./User');
const Application = require('./Application');

User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Application
};
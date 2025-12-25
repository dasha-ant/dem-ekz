const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});


async function startServer() {
  try {

    await sequelize.authenticate();
    console.log('✅ Подключение к базе данных установлено');
    
    await sequelize.sync({ alter: true });
    console.log('✅ База данных синхронизирована');
    
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📡 API доступен: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error.message);
    process.exit(1);
  }
}

startServer();
const { User, sequelize } = require('./models');

async function createAdmin() {
  try {
    console.log('🔄 Подключение к базе данных...');
    await sequelize.authenticate();
    console.log('✅ Подключение успешно');
    
    console.log('🔄 Синхронизация таблиц...');
    await sequelize.sync({ alter: true });
    console.log('✅ Таблицы синхронизированы');
  
    const existingAdmin = await User.findOne({ where: { username: 'Admin' } });
    
    if (existingAdmin) {
      console.log('✅ Администратор уже существует');
      console.log('   Логин:', existingAdmin.username);
      console.log('   Роль:', existingAdmin.role);
      console.log('   ID:', existingAdmin.id);

      const isValid = await existingAdmin.comparePassword('KorokNET');
      console.log('   Пароль KorokNET работает:', isValid ? '✅ Да' : '❌ Нет');

      if (!isValid) {
        console.log('🔄 Обновляем пароль администратора...');
        await existingAdmin.update({ password: 'KorokNET' });
        console.log('✅ Пароль обновлен');
      }
    } else {

      console.log('👑 Создаю администратора...');
      const admin = await User.create({
        username: 'Admin',
        password: 'KorokNET',
        fullName: 'Администратор Системы',
        phone: '8(800)123-45-67',
        email: 'admin@korochki.ru',
        role: 'admin'
      });
      
      console.log('✅ АДМИНИСТРАТОР СОЗДАН!');
      console.log('   Логин: Admin');
      console.log('   Пароль: KorokNET');
      console.log('   ID:', admin.id);
      console.log('   Роль:', admin.role);
  
      const isValid = await admin.comparePassword('KorokNET');
      console.log('   Пароль работает:', isValid ? '✅ Да' : '❌ Нет');
    }
    
    console.log('\n🎉 Готово! Теперь можно войти как администратор:');
    console.log('   На фронтенде нажми "Вход для администратора"');
    console.log('   Или введи вручную:');
    console.log('   Логин: Admin');
    console.log('   Пароль: KorokNET');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
    console.error('Детали:', error);
    process.exit(1);
  }
}

createAdmin();